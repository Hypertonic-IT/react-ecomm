const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/AdminController');

// Define routes
// Dashboard stats should be accessible to all admin/manager roles
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
