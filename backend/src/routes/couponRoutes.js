const express = require('express');
const router = express.Router();
const couponController = require('../controllers/CouponController');

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/coupons
 * @desc    Get all coupons
 * @access  Admin
 */
router.get('/', couponController.getAllCoupons);

/**
 * @route   GET /api/coupons/stats
 * @desc    Get coupon statistics
 * @access  Admin
 */
router.get('/stats', couponController.getCouponStats);

/**
 * @route   GET /api/coupons/:id
 * @desc    Get single coupon by ID
 * @access  Admin
 */
router.get('/:id', couponController.getCouponById);

/**
 * @route   POST /api/coupons
 * @desc    Create new coupon
 * @access  Admin
 * @body    { code, name, discountType, discountValue, ... }
 */
router.post('/', couponController.createCoupon);

/**
 * @route   PUT /api/coupons/:id
 * @desc    Update coupon
 * @access  Admin
 */
router.put('/:id', couponController.updateCoupon);

/**
 * @route   DELETE /api/coupons/:id
 * @desc    Delete coupon
 * @access  Admin
 */
router.delete('/:id', couponController.deleteCoupon);

// ============================================
// USER ROUTES
// ============================================

/**
 * @route   POST /api/coupons/validate
 * @desc    Validate and apply coupon
 * @access  Public
 * @body    { code, cartTotal, cartItems, userId }
 */
router.post('/validate', couponController.validateCoupon);

/**
 * @route   POST /api/coupons/record-usage
 * @desc    Record coupon usage after successful order
 * @access  Internal
 * @body    { couponId, userId, orderId, discountAmount }
 */
router.post('/record-usage', couponController.recordCouponUsage);

module.exports = router;
