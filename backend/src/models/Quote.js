const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    itemsDescription: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'responded'],
        default: 'pending'
    },
    adminResponse: {
        type: String
    }
}, {
    timestamps: true
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
