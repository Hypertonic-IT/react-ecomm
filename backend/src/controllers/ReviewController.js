const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public (only approved reviews)
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { status = 'approved' } = req.query;

        const query = { product: productId };

        // Only show approved reviews to public
        if (!req.user || !req.user.isAdmin) {
            query.status = 'approved';
        } else if (status !== 'all') {
            query.status = status;
        }

        const reviews = await Review.find(query)
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // Calculate review statistics
        const stats = await Review.aggregate([
            { $match: { product: productId, status: 'approved' } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                    rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                    rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                    rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                    rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
                }
            }
        ]);

        res.json({
            success: true,
            reviews,
            stats: stats[0] || {
                averageRating: 0,
                totalReviews: 0,
                rating5: 0,
                rating4: 0,
                rating3: 0,
                rating2: 0,
                rating1: 0
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Check if user can review a product
// @route   GET /api/reviews/can-review/:productId
// @access  Private
exports.canUserReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.json({
                success: true,
                canReview: false,
                reason: 'already_reviewed',
                review: existingReview
            });
        }

        // Check if user has purchased and received this product
        const deliveredOrder = await Order.findOne({
            user: userId,
            'items.product': productId,
            status: 'delivered'
        });

        if (!deliveredOrder) {
            return res.json({
                success: true,
                canReview: false,
                reason: 'not_purchased'
            });
        }

        res.json({
            success: true,
            canReview: true,
            isVerifiedPurchase: true
        });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { product, rating, title, comment, images } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!product || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Product, rating, and comment are required'
            });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ product, user: userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user purchased the product
        const deliveredOrder = await Order.findOne({
            user: userId,
            'items.product': product,
            status: 'delivered'
        });

        const review = await Review.create({
            product,
            user: userId,
            rating,
            title,
            comment,
            images: images || [],
            isVerifiedPurchase: !!deliveredOrder,
            status: 'pending' // All reviews start as pending
        });

        const populatedReview = await Review.findById(review._id).populate('user', 'name');

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully and is pending approval',
            review: populatedReview
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
    try {
        const { status, product, rating, search, page = 1, limit = 10 } = req.query;

        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (product) {
            query.product = product;
        }

        if (rating) {
            query.rating = parseInt(rating);
        }

        if (search) {
            query.$or = [
                { comment: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const reviews = await Review.find(query)
            .populate('user', 'name email')
            .populate('product', 'name image price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments(query);

        // Get status counts
        const statusCounts = await Review.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            total,
            pending: statusCounts.find(s => s._id === 'pending')?.count || 0,
            approved: statusCounts.find(s => s._id === 'approved')?.count || 0,
            rejected: statusCounts.find(s => s._id === 'rejected')?.count || 0
        };

        res.json({
            success: true,
            reviews,
            stats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update review status (Approve/Reject)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.status = status;
        if (adminNote) {
            review.adminNote = adminNote;
        }

        await review.save();

        const updatedReview = await Review.findById(id)
            .populate('user', 'name email')
            .populate('product', 'name image');

        res.json({
            success: true,
            message: `Review ${status} successfully`,
            review: updatedReview
        });
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.deleteOne();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
