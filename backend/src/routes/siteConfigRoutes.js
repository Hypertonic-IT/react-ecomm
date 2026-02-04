const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/SiteConfigController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSettings)
    .put(protect, admin, updateSettings);

module.exports = router;
