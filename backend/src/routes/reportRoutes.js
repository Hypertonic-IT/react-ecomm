const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');
// Import protect/admin middleware if needed, e.g., const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard Stats
// @route   GET /api/reports/dashboard
router.get('/dashboard', reportController.getDashboardStats);

// Sales Report
// @route   GET /api/reports/sales
router.get('/sales', reportController.getSalesReports);

// Order Stats
// @route   GET /api/reports/orders
router.get('/orders', reportController.getOrderStats);

// Product Stats
// @route   GET /api/reports/products
router.get('/products', reportController.getProductStats);

module.exports = router;
