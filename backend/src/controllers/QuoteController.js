const Quote = require('../models/Quote');


// @desc    Submit wholesale quote request
// @route   POST /api/quotes
// @access  Public
const submitQuoteRequest = async (req, res) => {
    const { name, email, phone, message, itemsDescription } = req.body;

    try {
        const quote = new Quote({
            user_id: req.user ? req.user._id : null,
            name,
            email,
            phone,
            message,
            itemsDescription,
            status: 'pending'
        });

        const savedQuote = await quote.save();
        res.status(201).json({ success: true, data: savedQuote });
    } catch (error) {
        console.error('Error submitting quote request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get wholesale quotes
// @route   GET /api/quotes
// @access  Private
const getQuotes = async (req, res) => {
    try {
        let quotes;

        // If user is admin (or manager), let them see all quotes
        const isStaff = req.user.isAdmin ||
            ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(req.user.role);

        if (isStaff) {
            quotes = await Quote.find({}).populate('user_id', 'name emailOrMobile').sort({ createdAt: -1 });
        } else {
            // Regular user sees only their own quotes
            quotes = await Quote.find({ user_id: req.user._id }).sort({ createdAt: -1 });
        }

        res.json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Admin respond to quote request
// @route   PUT /api/quotes/:id/respond
// @access  Private/Admin
const respondToQuoteRequest = async (req, res) => {
    const { adminResponse } = req.body;

    if (!adminResponse) {
        return res.status(400).json({ success: false, message: 'Response message is required' });
    }

    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote request not found' });
        }

        quote.adminResponse = adminResponse;
        quote.status = 'responded';
        await quote.save();

        res.json({ success: true, message: 'Quote response recorded', data: quote });
    } catch (error) {
        console.error('Error responding to quote request:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Track quotes by email (public)
// @route   POST /api/quotes/track
// @access  Public
const trackQuote = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    try {
        // Find ALL quotes for this email, newest first
        const quotes = await Quote.find({
            email: { $regex: new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        }).sort({ createdAt: -1 });

        if (!quotes || quotes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No quote requests found for this email address. Please check your email and try again.'
            });
        }

        const formatted = quotes.map(q => ({
            _id: q._id,
            name: q.name,
            email: q.email,
            phone: q.phone,
            itemsDescription: q.itemsDescription,
            message: q.message,
            status: q.status,
            adminResponse: q.adminResponse || null,
            createdAt: q.createdAt,
            updatedAt: q.updatedAt
        }));

        res.json({ success: true, quotes: formatted });
    } catch (error) {
        console.error('Error tracking quote:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    submitQuoteRequest,
    getQuotes,
    respondToQuoteRequest,
    trackQuote
};
