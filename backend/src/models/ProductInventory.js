const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    reserved: {
        type: Number,
        default: 0,
        min: 0
    },
    available: {
        type: Number,
        default: 0,
        min: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    price: {
        type: Number
    },
    images: [String]
}, { _id: true });

// Virtual for actual available stock
variantSchema.virtual('actualAvailable').get(function () {
    return this.stock - this.reserved;
});

const inventoryHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        enum: ['ADDED', 'DEDUCTED', 'RESERVED', 'RELEASED', 'RETURNED', 'ADJUSTED'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        enum: [
            'NEW_SHIPMENT',
            'MANUAL_CORRECTION',
            'RETURN_ADDED',
            'DAMAGED_GOODS',
            'INVENTORY_AUDIT',
            'ORDER_PLACED',
            'ORDER_CANCELLED',
            'CART_RESERVATION',
            'CART_EXPIRED',
            'PAYMENT_FAILED'
        ]
    },
    adminId: {
        type: String
    },
    adminName: {
        type: String
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    previousStock: Number,
    newStock: Number,
    notes: String
});

const productInventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    variants: [variantSchema],

    // Overall product settings
    trackInventory: {
        type: Boolean,
        default: true
    },
    allowBackorder: {
        type: Boolean,
        default: false
    },
    hideWhenOutOfStock: {
        type: Boolean,
        default: false
    },

    // Stock alerts
    lowStockAlert: {
        enabled: {
            type: Boolean,
            default: true
        },
        threshold: {
            type: Number,
            default: 10
        },
        notified: {
            type: Boolean,
            default: false
        }
    },

    // Inventory history
    history: [inventoryHistorySchema],

    // Metadata
    lastStockUpdate: {
        type: Date,
        default: Date.now
    },
    lastUpdatedBy: String,

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
productInventorySchema.index({ productId: 1 });
productInventorySchema.index({ 'variants.sku': 1 });
productInventorySchema.index({ category: 1 });
productInventorySchema.index({ 'variants.stock': 1 });

// Methods

// Check if variant is in stock
productInventorySchema.methods.isVariantInStock = function (variantId) {
    const variant = this.variants.id(variantId);
    if (!variant) return false;
    return (variant.stock - variant.reserved) > 0;
};

// Get variant by SKU
productInventorySchema.methods.getVariantBySKU = function (sku) {
    return this.variants.find(v => v.sku === sku.toUpperCase());
};

// Reserve stock for cart
productInventorySchema.methods.reserveStock = async function (variantId, quantity) {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    const available = variant.stock - variant.reserved;
    if (available < quantity) {
        throw new Error(`Only ${available} units available`);
    }

    variant.reserved += quantity;
    variant.available = variant.stock - variant.reserved;

    // Add to history
    this.history.push({
        action: 'RESERVED',
        quantity: quantity,
        reason: 'CART_RESERVATION',
        previousStock: variant.stock,
        newStock: variant.stock
    });

    await this.save();
    return variant;
};

// Release reserved stock
productInventorySchema.methods.releaseStock = async function (variantId, quantity, reason = 'CART_EXPIRED') {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    variant.reserved = Math.max(0, variant.reserved - quantity);
    variant.available = variant.stock - variant.reserved;

    // Add to history
    this.history.push({
        action: 'RELEASED',
        quantity: quantity,
        reason: reason,
        previousStock: variant.stock,
        newStock: variant.stock
    });

    await this.save();
    return variant;
};

// Deduct stock (on order confirmation)
productInventorySchema.methods.deductStock = async function (variantId, quantity, orderId, reason = 'ORDER_PLACED') {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    const previousStock = variant.stock;

    // Deduct from both stock and reserved
    variant.stock = Math.max(0, variant.stock - quantity);
    variant.reserved = Math.max(0, variant.reserved - quantity);
    variant.available = variant.stock - variant.reserved;

    // Add to history
    this.history.push({
        action: 'DEDUCTED',
        quantity: quantity,
        reason: reason,
        orderId: orderId,
        previousStock: previousStock,
        newStock: variant.stock
    });

    this.lastStockUpdate = Date.now();

    await this.save();
    return variant;
};

// Restore stock (on cancellation/return)
productInventorySchema.methods.restoreStock = async function (variantId, quantity, orderId, reason = 'ORDER_CANCELLED') {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    const previousStock = variant.stock;

    variant.stock += quantity;
    variant.available = variant.stock - variant.reserved;

    // Add to history
    this.history.push({
        action: 'RETURNED',
        quantity: quantity,
        reason: reason,
        orderId: orderId,
        previousStock: previousStock,
        newStock: variant.stock
    });

    this.lastStockUpdate = Date.now();

    await this.save();
    return variant;
};

// Add stock (manual/shipment)
productInventorySchema.methods.addStock = async function (variantId, quantity, adminId, adminName, reason = 'NEW_SHIPMENT', notes = '') {
    const variant = this.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    const previousStock = variant.stock;

    variant.stock += quantity;
    variant.available = variant.stock - variant.reserved;

    // Add to history
    this.history.push({
        action: 'ADDED',
        quantity: quantity,
        reason: reason,
        adminId: adminId,
        adminName: adminName,
        previousStock: previousStock,
        newStock: variant.stock,
        notes: notes
    });

    this.lastStockUpdate = Date.now();
    this.lastUpdatedBy = adminName;

    // Reset low stock notification
    if (variant.stock > this.lowStockAlert.threshold) {
        this.lowStockAlert.notified = false;
    }

    await this.save();
    return variant;
};

// Check and get low stock variants
productInventorySchema.methods.getLowStockVariants = function () {
    return this.variants.filter(v =>
        v.stock > 0 && v.stock <= (v.lowStockThreshold || this.lowStockAlert.threshold)
    );
};

// Check and get out of stock variants
productInventorySchema.methods.getOutOfStockVariants = function () {
    return this.variants.filter(v => v.stock === 0);
};

const ProductInventory = mongoose.model('ProductInventory', productInventorySchema);

module.exports = ProductInventory;
