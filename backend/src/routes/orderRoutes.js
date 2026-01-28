const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/OrderController');

router.post('/', addOrderItems);
router.get('/', getAllOrders);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
