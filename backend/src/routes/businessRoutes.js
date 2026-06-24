const express = require('express');
const router = express.Router();
const {
    submitApplication,
    getApplicationStatus,
    getApplications,
    updateApplicationStatus,
    toggleApplicationActive,
    deleteApplication
} = require('../controllers/BusinessController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/apply', protect, submitApplication);
router.get('/status', protect, getApplicationStatus);
router.get('/applications', protect, admin, getApplications);
router.put('/applications/:id/status', protect, admin, updateApplicationStatus);
router.put('/applications/:id/active', protect, admin, toggleApplicationActive);
router.delete('/applications/:id', protect, admin, deleteApplication);

module.exports = router;
