const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/InventoryController');

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory (with filters)
 * @access  Admin
 * @query   category, stockStatus, search
 */
router.get('/', inventoryController.getAllInventory);

/**
 * @route   GET /api/inventory/product/:productId
 * @desc    Get inventory for specific product
 * @access  Admin
 */
router.get('/product/:productId', inventoryController.getProductInventory);

/**
 * @route   PUT /api/inventory/product/:productId/variant/:variantId
 * @desc    Update stock for specific variant (Admin manual update)
 * @access  Admin
 * @body    { quantity, reason, notes }
 */
router.put('/product/:productId/variant/:variantId', inventoryController.updateStock);

/**
 * @route   GET /api/inventory/product/:productId/history
 * @desc    Get inventory history for product
 * @access  Admin
 */
router.get('/product/:productId/history', inventoryController.getInventoryHistory);

/**
 * @route   GET /api/inventory/alerts/low-stock
 * @desc    Get low stock alerts
 * @access  Admin
 */
router.get('/alerts/low-stock', inventoryController.getLowStockAlerts);

/**
 * @route   GET /api/inventory/alerts/out-of-stock
 * @desc    Get out of stock products
 * @access  Admin
 */
router.get('/alerts/out-of-stock', inventoryController.getOutOfStockProducts);

// ============================================
// USER/CUSTOMER ROUTES
// ============================================

/**
 * @route   GET /api/inventory/check/:productId/variant/:variantId
 * @desc    Check variant availability (for user side)
 * @access  Public
 * @query   quantity (default: 1)
 */
router.get('/check/:productId/variant/:variantId', inventoryController.checkVariantAvailability);

/**
 * @route   POST /api/inventory/reserve
 * @desc    Reserve stock when adding to cart
 * @access  Public
 * @body    { userId, sessionId, items: [{ productId, variantId, sku, quantity }] }
 */
router.post('/reserve', inventoryController.reserveStock);

/**
 * @route   POST /api/inventory/release
 * @desc    Release reserved stock (cart abandoned)
 * @access  Public
 * @body    { userId, sessionId }
 */
router.post('/release', inventoryController.releaseReservedStock);

// ============================================
// ORDER PROCESSING ROUTES
// ============================================

/**
 * @route   POST /api/inventory/deduct
 * @desc    Deduct stock on successful payment
 * @access  Internal/Order Service
 * @body    { orderId, userId, sessionId, items: [{ productId, variantId, sku, quantity }] }
 */
router.post('/deduct', inventoryController.deductStock);

/**
 * @route   POST /api/inventory/restore
 * @desc    Restore stock on order cancellation/return
 * @access  Internal/Order Service
 * @body    { orderId, items: [{ productId, variantId, sku, quantity }], reason }
 */
router.post('/restore', inventoryController.restoreStock);

module.exports = router;
