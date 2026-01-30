const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },

    // Discount Configuration
    discountType: {
        type: String,
        enum: ['percentage', 'flat'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    maxDiscount: {
        type: Number,
        default: null // Only for percentage type
    },

    // Applicability
    applicableTo: {
        type: String,
        enum: ['all', 'categories', 'products'],
        default: 'all'
    },
    applicableCategories: [{
        type: String
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    // Usage Rules
    minOrderValue: {
        type: Number,
        default: 0
    },
    usageLimit: {
        type: Number,
        default: null // null = unlimited
    },
    perUserLimit: {
        type: Number,
        default: 1
    },

    // Validity
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    // Status & Tracking
    isActive: {
        type: Boolean,
        default: true
    },
    usedCount: {
        type: Number,
        default: 0
    },

    // Usage History
    usageHistory: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        discountAmount: Number,
        usedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Metadata
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

// Methods

// Check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();

    if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
    if (now < this.startDate) return { valid: false, message: 'Coupon not yet active' };
    if (now > this.endDate) return { valid: false, message: 'Coupon has expired' };
    if (this.usageLimit && this.usedCount >= this.usageLimit) {
        return { valid: false, message: 'Coupon usage limit reached' };
    }

    return { valid: true };
};

// Check if user can use this coupon
couponSchema.methods.canUserUse = function (userId) {
    if (!this.perUserLimit) return true;

    const userUsageCount = this.usageHistory.filter(
        h => h.userId && h.userId.toString() === userId.toString()
    ).length;

    return userUsageCount < this.perUserLimit;
};

// Calculate discount for cart
couponSchema.methods.calculateDiscount = function (cartTotal, cartItems = []) {
    // Check minimum order value
    if (cartTotal < this.minOrderValue) {
        return {
            applicable: false,
            message: `Minimum order value of ₹${this.minOrderValue} required`,
            discount: 0
        };
    }

    // Check applicability
    let applicableAmount = cartTotal;

    if (this.applicableTo === 'categories') {
        // Calculate total of items from applicable categories
        applicableAmount = cartItems
            .filter(item => this.applicableCategories.includes(item.category))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else if (this.applicableTo === 'products') {
        // Calculate total of applicable products
        applicableAmount = cartItems
            .filter(item => this.applicableProducts.some(p => p.toString() === item.productId.toString()))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    if (applicableAmount === 0) {
        return {
            applicable: false,
            message: 'No applicable items in cart',
            discount: 0
        };
    }

    // Calculate discount
    let discount = 0;

    if (this.discountType === 'percentage') {
        discount = (applicableAmount * this.discountValue) / 100;

        // Apply max discount cap if set
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        // Flat discount
        discount = Math.min(this.discountValue, applicableAmount);
    }

    return {
        applicable: true,
        discount: Math.round(discount * 100) / 100, // Round to 2 decimals
        message: 'Coupon applied successfully'
    };
};

// Record usage
couponSchema.methods.recordUsage = async function (userId, orderId, discountAmount) {
    this.usedCount += 1;
    this.usageHistory.push({
        userId,
        orderId,
        discountAmount,
        usedAt: new Date()
    });
    this.updatedAt = new Date();
    await this.save();
};

// Update timestamp on save
couponSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
