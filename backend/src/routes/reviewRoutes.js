const express = require('express');
const router = express.Router();
const {
    getProductReviews,
    canUserReview,
    createReview,
    getAllReviews,
    updateReviewStatus,
    deleteReview
} = require('../controllers/ReviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (logged-in users)
router.get('/can-review/:productId', protect, canUserReview);
router.post('/', protect, createReview);

// Admin routes
router.get('/admin', protect, admin, getAllReviews);
router.put('/:id/status', protect, admin, updateReviewStatus);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
