const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    images: [{
        type: String // URLs to uploaded images
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    adminNote: {
        type: String,
        trim: true
    },
    helpfulCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient queries
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product

// Virtual for masked user name
reviewSchema.virtual('maskedUserName').get(function () {
    if (this.user && this.user.name) {
        const name = this.user.name;
        if (name.length <= 2) return name;
        return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    }
    return 'Anonymous';
});

// Ensure virtuals are included in JSON
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);
