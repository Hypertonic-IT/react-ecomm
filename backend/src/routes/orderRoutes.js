const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/OrderController');

router.post('/', addOrderItems);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
