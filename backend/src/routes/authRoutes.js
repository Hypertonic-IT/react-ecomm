const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, signup, login } = require('../controllers/AuthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/business/register', require('../controllers/AuthController').businessRegister);
// Profile & Password
router.put('/profile', protect, require('../controllers/AuthController').updateProfile);
router.post('/change-password', protect, require('../controllers/AuthController').changePassword);
router.post('/reset-password', require('../controllers/AuthController').resetPassword);
router.post('/google-login', require('../controllers/AuthController').googleLogin);

// Wishlist Routes
router.get('/wishlist', protect, require('../controllers/AuthController').getWishlist);
router.post('/wishlist/add', protect, require('../controllers/AuthController').addToWishlist);
router.delete('/wishlist/:productId', protect, require('../controllers/AuthController').removeFromWishlist);

module.exports = router;
