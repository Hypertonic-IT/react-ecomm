const express = require('express');
const router = express.Router();
const { protect, admin, checkRole } = require('../middleware/authMiddleware');
const {
    addOrderItems,
    getAllOrders,
    getB2BOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    trackOrder
} = require('../controllers/OrderController');

router.post('/', protect, addOrderItems);
router.get('/', protect, admin, getAllOrders);
router.get('/b2b', protect, admin, getB2BOrders);
router.get('/myorders', protect, getMyOrders);
router.post('/track', trackOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, checkRole(['super_admin', 'sales_manager']), updateOrderStatus);

module.exports = router;
