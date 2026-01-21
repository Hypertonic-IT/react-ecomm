const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    emailOrMobile: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 10 * 60 * 1000 // 10 minutes default
    }
}, {
    timestamps: true
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete documents after expiry

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
