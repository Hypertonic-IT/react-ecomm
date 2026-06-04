const express = require('express');
const router = express.Router();
const {
    submitQuoteRequest,
    getQuotes,
    respondToQuoteRequest,
    trackQuote
} = require('../controllers/QuoteController');
const { protect, admin, checkUser } = require('../middleware/authMiddleware');

router.post('/track', trackQuote); // Public — must be BEFORE /:id routes

router.route('/')
    .post(checkUser, submitQuoteRequest)
    .get(protect, getQuotes);

router.route('/:id/respond')
    .put(protect, admin, respondToQuoteRequest);

module.exports = router;

