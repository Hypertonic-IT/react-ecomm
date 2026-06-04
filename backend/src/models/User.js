const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    emailOrMobile: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager', 'customer'],
        default: 'customer'
    },
    accountType: {
        type: String,
        enum: ['personal', 'business'],
        default: 'personal'
    },
    status: {
        type: String,
        enum: ['Active', 'Pending Approval', 'Rejected'],
        default: 'Active'
    },
    wishlist: [{
        productId: { type: String }, // removed required: true
        name: { type: String },
        price: { type: Number },
        image: { type: String },
        inStock: { type: Boolean, default: true }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
