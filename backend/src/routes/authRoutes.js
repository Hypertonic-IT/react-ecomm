const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, signup, login } = require('../controllers/AuthController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
// Profile & Password
router.put('/profile', require('../controllers/AuthController').updateProfile);
router.post('/change-password', require('../controllers/AuthController').changePassword);

// Wishlist Routes
router.get('/wishlist', require('../controllers/AuthController').getWishlist);
router.post('/wishlist/add', require('../controllers/AuthController').addToWishlist);
router.delete('/wishlist/:productId', require('../controllers/AuthController').removeFromWishlist);

module.exports = router;
