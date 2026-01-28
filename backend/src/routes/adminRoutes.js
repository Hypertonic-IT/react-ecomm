const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/AdminController');

// Define routes
router.get('/stats', getDashboardStats);

module.exports = router;
