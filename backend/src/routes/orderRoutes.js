const express = require('express');
const router = express.Router();
const { protect, admin, checkRole } = require('../middleware/authMiddleware');
const {
    addOrderItems,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/OrderController');

router.post('/', protect, addOrderItems);
router.get('/', protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, checkRole(['super_admin', 'sales_manager']), updateOrderStatus);

module.exports = router;
