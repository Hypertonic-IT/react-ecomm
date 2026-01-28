const ProductInventory = require('../models/ProductInventory');
const CartReservation = require('../models/CartReservation');
const Product = require('../models/Product');

// Inventory Settings (can be moved to database later)
const INVENTORY_SETTINGS = {
    RESERVATION_TIME_MINUTES: 15,
    LOW_STOCK_THRESHOLD: 10,
    ENABLE_CART_RESERVATION: true,
    AUTO_HIDE_OUT_OF_STOCK: false
};

/**
 * Get all inventory
 */
exports.getAllInventory = async (req, res) => {
    try {
        const { category, stockStatus, search } = req.query;

        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        const inventory = await ProductInventory.find(query)
            .populate('productId', 'name image')
            .sort({ lastStockUpdate: -1 });

        // Filter by stock status if needed
        let filteredInventory = inventory;
        if (stockStatus && stockStatus !== 'All') {
            filteredInventory = inventory.filter(inv => {
                const totalStock = inv.variants.reduce((sum, v) => sum + v.stock, 0);
                const totalReserved = inv.variants.reduce((sum, v) => sum + v.reserved, 0);
                const available = totalStock - totalReserved;

                if (stockStatus === 'In Stock') return available > INVENTORY_SETTINGS.LOW_STOCK_THRESHOLD;
                if (stockStatus === 'Low Stock') return available > 0 && available <= INVENTORY_SETTINGS.LOW_STOCK_THRESHOLD;
                if (stockStatus === 'Out of Stock') return available === 0;
                return true;
            });
        }

        // Search by product name or SKU
        if (search) {
            filteredInventory = filteredInventory.filter(inv =>
                inv.productName.toLowerCase().includes(search.toLowerCase()) ||
                inv.variants.some(v => v.sku.includes(search.toUpperCase()))
            );
        }

        res.json({
            success: true,
            data: filteredInventory,
            count: filteredInventory.length
        });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get inventory for specific product
 */
exports.getProductInventory = async (req, res) => {
    try {
        const { productId } = req.params;

        const inventory = await ProductInventory.findOne({ productId })
            .populate('productId', 'name image category price');

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory not found for this product'
            });
        }

        res.json({
            success: true,
            data: inventory
        });
    } catch (error) {
        console.error('Get product inventory error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Check variant availability (for user side)
 */
exports.checkVariantAvailability = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity = 1 } = req.query;

        const inventory = await ProductInventory.findOne({ productId });

        if (!inventory) {
            return res.json({
                success: false,
                available: false,
                message: 'Product not found'
            });
        }

        const variant = inventory.variants.id(variantId);

        if (!variant) {
            return res.json({
                success: false,
                available: false,
                message: 'Variant not found'
            });
        }

        const available = variant.stock - variant.reserved;
        const isAvailable = available >= parseInt(quantity);

        res.json({
            success: true,
            available: isAvailable,
            stock: variant.stock,
            reserved: variant.reserved,
            actualAvailable: available,
            quantity: parseInt(quantity),
            canAddToCart: isAvailable,
            message: isAvailable ? 'In stock' : 'Out of stock'
        });
    } catch (error) {
        console.error('Check availability error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Reserve stock (when adding to cart)
 */
exports.reserveStock = async (req, res) => {
    try {
        const { userId, sessionId, items } = req.body;

        if (!INVENTORY_SETTINGS.ENABLE_CART_RESERVATION) {
            return res.json({
                success: true,
                message: 'Reservation disabled, stock will be checked at checkout'
            });
        }

        // Check if user already has active reservation
        let reservation = await CartReservation.findOne({
            userId,
            sessionId,
            status: 'ACTIVE'
        });

        // Process each item
        const reservedItems = [];
        const errors = [];

        for (const item of items) {
            try {
                const inventory = await ProductInventory.findOne({ productId: item.productId });

                if (!inventory) {
                    errors.push({ sku: item.sku, error: 'Product not found' });
                    continue;
                }

                await inventory.reserveStock(item.variantId, item.quantity);
                reservedItems.push(item);
            } catch (error) {
                errors.push({ sku: item.sku, error: error.message });
            }
        }

        if (reservedItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Could not reserve any items',
                errors
            });
        }

        // Create or update reservation
        const expiresAt = new Date(Date.now() + INVENTORY_SETTINGS.RESERVATION_TIME_MINUTES * 60 * 1000);

        if (reservation) {
            reservation.items = reservedItems;
            reservation.expiresAt = expiresAt;
            await reservation.save();
        } else {
            reservation = await CartReservation.create({
                userId,
                sessionId,
                items: reservedItems,
                expiresAt
            });
        }

        res.json({
            success: true,
            message: 'Stock reserved successfully',
            reservation: reservation,
            expiresIn: INVENTORY_SETTINGS.RESERVATION_TIME_MINUTES,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Reserve stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Release reserved stock (cart abandoned/expired)
 */
exports.releaseReservedStock = async (req, res) => {
    try {
        const { userId, sessionId } = req.body;

        const reservation = await CartReservation.findOne({
            userId,
            sessionId,
            status: 'ACTIVE'
        });

        if (!reservation) {
            return res.json({
                success: true,
                message: 'No active reservation found'
            });
        }

        // Release stock for each item
        for (const item of reservation.items) {
            try {
                const inventory = await ProductInventory.findOne({ productId: item.productId });
                if (inventory) {
                    await inventory.releaseStock(item.variantId, item.quantity, 'CART_EXPIRED');
                }
            } catch (error) {
                console.error('Error releasing stock:', error);
            }
        }

        // Mark reservation as expired
        reservation.status = 'EXPIRED';
        await reservation.save();

        res.json({
            success: true,
            message: 'Reserved stock released'
        });
    } catch (error) {
        console.error('Release stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Deduct stock (on successful payment)
 */
exports.deductStock = async (req, res) => {
    try {
        const { orderId, userId, sessionId, items } = req.body;

        const deductedItems = [];
        const errors = [];

        for (const item of items) {
            try {
                const inventory = await ProductInventory.findOne({ productId: item.productId });

                if (!inventory) {
                    errors.push({ sku: item.sku, error: 'Product not found' });
                    continue;
                }

                await inventory.deductStock(item.variantId, item.quantity, orderId, 'ORDER_PLACED');
                deductedItems.push(item);
            } catch (error) {
                errors.push({ sku: item.sku, error: error.message });
            }
        }

        // Mark reservation as converted
        if (userId && sessionId) {
            await CartReservation.updateOne(
                { userId, sessionId, status: 'ACTIVE' },
                { status: 'CONVERTED' }
            );
        }

        res.json({
            success: true,
            message: 'Stock deducted successfully',
            deductedItems,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Deduct stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Restore stock (on order cancellation/return)
 */
exports.restoreStock = async (req, res) => {
    try {
        const { orderId, items, reason = 'ORDER_CANCELLED' } = req.body;

        const restoredItems = [];
        const errors = [];

        for (const item of items) {
            try {
                const inventory = await ProductInventory.findOne({ productId: item.productId });

                if (!inventory) {
                    errors.push({ sku: item.sku, error: 'Product not found' });
                    continue;
                }

                await inventory.restoreStock(item.variantId, item.quantity, orderId, reason);
                restoredItems.push(item);
            } catch (error) {
                errors.push({ sku: item.sku, error: error.message });
            }
        }

        res.json({
            success: true,
            message: 'Stock restored successfully',
            restoredItems,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Restore stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update stock (admin manual update)
 */
exports.updateStock = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity, reason, notes } = req.body;
        const adminId = req.headers['user-id'] || 'admin';
        const adminName = req.headers['user-name'] || 'Admin User';

        const inventory = await ProductInventory.findOne({ productId });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory not found'
            });
        }

        const variant = inventory.variants.id(variantId);
        const currentStock = variant.stock;
        const quantityChange = parseInt(quantity) - currentStock;

        if (quantityChange > 0) {
            // Adding stock
            await inventory.addStock(
                variantId,
                quantityChange,
                adminId,
                adminName,
                reason || 'MANUAL_CORRECTION',
                notes
            );
        } else if (quantityChange < 0) {
            // Removing stock (manual adjustment)
            const previousStock = variant.stock;
            variant.stock = parseInt(quantity);
            variant.available = variant.stock - variant.reserved;

            inventory.history.push({
                action: 'ADJUSTED',
                quantity: Math.abs(quantityChange),
                reason: reason || 'MANUAL_CORRECTION',
                adminId,
                adminName,
                previousStock,
                newStock: variant.stock,
                notes
            });

            inventory.lastStockUpdate = Date.now();
            inventory.lastUpdatedBy = adminName;

            await inventory.save();
        }

        res.json({
            success: true,
            message: 'Stock updated successfully',
            variant: inventory.variants.id(variantId)
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get inventory history
 */
exports.getInventoryHistory = async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit = 50 } = req.query;

        const inventory = await ProductInventory.findOne({ productId });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: 'Inventory not found'
            });
        }

        const history = inventory.history
            .sort((a, b) => b.date - a.date)
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            data: history,
            count: history.length
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get low stock alerts
 */
exports.getLowStockAlerts = async (req, res) => {
    try {
        const inventory = await ProductInventory.find({ trackInventory: true })
            .populate('productId', 'name image');

        const lowStockProducts = [];

        inventory.forEach(inv => {
            const lowStockVariants = inv.getLowStockVariants();
            if (lowStockVariants.length > 0) {
                lowStockProducts.push({
                    product: inv.productName,
                    productId: inv.productId,
                    variants: lowStockVariants,
                    category: inv.category
                });
            }
        });

        res.json({
            success: true,
            data: lowStockProducts,
            count: lowStockProducts.length
        });
    } catch (error) {
        console.error('Get low stock alerts error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get out of stock products
 */
exports.getOutOfStockProducts = async (req, res) => {
    try {
        const inventory = await ProductInventory.find({ trackInventory: true })
            .populate('productId', 'name image');

        const outOfStockProducts = [];

        inventory.forEach(inv => {
            const outOfStockVariants = inv.getOutOfStockVariants();
            if (outOfStockVariants.length > 0) {
                outOfStockProducts.push({
                    product: inv.productName,
                    productId: inv.productId,
                    variants: outOfStockVariants,
                    category: inv.category
                });
            }
        });

        res.json({
            success: true,
            data: outOfStockProducts,
            count: outOfStockProducts.length
        });
    } catch (error) {
        console.error('Get out of stock error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Cleanup expired reservations (cron job)
 */
exports.cleanupExpiredReservations = async () => {
    try {
        const expiredReservations = await CartReservation.find({
            status: 'ACTIVE',
            expiresAt: { $lt: new Date() }
        });

        for (const reservation of expiredReservations) {
            // Release stock
            for (const item of reservation.items) {
                try {
                    const inventory = await ProductInventory.findOne({ productId: item.productId });
                    if (inventory) {
                        await inventory.releaseStock(item.variantId, item.quantity, 'CART_EXPIRED');
                    }
                } catch (error) {
                    console.error('Error releasing expired stock:', error);
                }
            }

            // Mark as expired
            reservation.status = 'EXPIRED';
            await reservation.save();
        }

        console.log(`Cleaned up ${expiredReservations.length} expired reservations`);
        return expiredReservations.length;
    } catch (error) {
        console.error('Cleanup error:', error);
        return 0;
    }
};

module.exports = exports;
