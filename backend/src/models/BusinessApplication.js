const mongoose = require('mongoose');

const businessApplicationSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    business_name: {
        type: String,
        required: true
    },
    contact_person: {
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
    gst_number: {
        type: String
    },
    business_address: {
        type: String,
        required: true
    },
    business_type: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    monthly_requirement: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'business_applications'
});

const BusinessApplication = mongoose.model('BusinessApplication', businessApplicationSchema);

module.exports = BusinessApplication;
