const Coupon = require('../models/Coupon');

/**
 * Get all coupons (Admin)
 */
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 })
            .populate('applicableProducts', 'name price');

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get single coupon by ID (Admin)
 */
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('applicableProducts', 'name price image');

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({
            success: true,
            data: coupon
        });
    } catch (error) {
        console.error('Get coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create new coupon (Admin)
 */
exports.createCoupon = async (req, res) => {
    try {
        const {
            code,
            name,
            description,
            discountType,
            discountValue,
            maxDiscount,
            applicableTo,
            applicableCategories,
            applicableProducts,
            minOrderValue,
            usageLimit,
            perUserLimit,
            startDate,
            endDate,
            isActive
        } = req.body;

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            name,
            description,
            discountType,
            discountValue,
            maxDiscount: discountType === 'percentage' ? maxDiscount : null,
            applicableTo,
            applicableCategories: applicableTo === 'categories' ? applicableCategories : [],
            applicableProducts: applicableTo === 'products' ? applicableProducts : [],
            minOrderValue: minOrderValue || 0,
            usageLimit: usageLimit || null,
            perUserLimit: perUserLimit || 1,
            startDate,
            endDate,
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.headers['user-id'] || 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update coupon (Admin)
 */
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key !== '_id' && key !== 'usedCount' && key !== 'usageHistory') {
                coupon[key] = req.body[key];
            }
        });

        // Uppercase code
        if (req.body.code) {
            coupon.code = req.body.code.toUpperCase();
        }

        await coupon.save();

        res.json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon
        });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete coupon (Admin)
 */
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Validate and apply coupon (User)
 */
exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal, cartItems, userId } = req.body;

        // Find coupon
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Check if coupon is valid
        const validityCheck = coupon.isValid();
        if (!validityCheck.valid) {
            return res.status(400).json({
                success: false,
                message: validityCheck.message
            });
        }

        // Check if user can use this coupon
        if (userId && !coupon.canUserUse(userId)) {
            return res.status(400).json({
                success: false,
                message: `You have already used this coupon ${coupon.perUserLimit} time(s)`
            });
        }

        // Calculate discount
        const discountResult = coupon.calculateDiscount(cartTotal, cartItems);

        if (!discountResult.applicable) {
            return res.status(400).json({
                success: false,
                message: discountResult.message
            });
        }

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            data: {
                couponId: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount: discountResult.discount,
                finalTotal: cartTotal - discountResult.discount
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Record coupon usage (Called after successful order)
 */
exports.recordCouponUsage = async (req, res) => {
    try {
        const { couponId, userId, orderId, discountAmount } = req.body;

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        await coupon.recordUsage(userId, orderId, discountAmount);

        res.json({
            success: true,
            message: 'Coupon usage recorded'
        });
    } catch (error) {
        console.error('Record coupon usage error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get coupon statistics (Admin)
 */
exports.getCouponStats = async (req, res) => {
    try {
        const stats = await Coupon.aggregate([
            {
                $group: {
                    _id: null,
                    totalCoupons: { $sum: 1 },
                    activeCoupons: {
                        $sum: { $cond: ['$isActive', 1, 0] }
                    },
                    totalUsage: { $sum: '$usedCount' },
                    totalDiscount: {
                        $sum: {
                            $reduce: {
                                input: '$usageHistory',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.discountAmount'] }
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0] || {
                totalCoupons: 0,
                activeCoupons: 0,
                totalUsage: 0,
                totalDiscount: 0
            }
        });
    } catch (error) {
        console.error('Get coupon stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
