const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // For now, system created products have no specific user owner
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: [{ // For gallery
        type: String
    }],
    description: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true // Primary category
    },
    categories: [{
        type: String
    }],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    salePrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    isSale: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isExclusive: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Advanced fields
    colors: [String],

    sizes: [String],

    // Rich Data Content
    shortDescription: { type: String },
    specifications: [{
        name: String,
        value: String
    }],
    shippingInfo: { type: String }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
