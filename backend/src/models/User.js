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
