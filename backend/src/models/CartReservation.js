const mongoose = require('mongoose');

// Cart Reservation Schema
const cartReservationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        sku: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        reservedAt: {
            type: Date,
            default: Date.now
        }
    }],
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index - auto delete when expired
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED'],
        default: 'ACTIVE'
    }
}, { timestamps: true });

// Index for quick lookups
cartReservationSchema.index({ userId: 1, sessionId: 1 });
cartReservationSchema.index({ expiresAt: 1 });
cartReservationSchema.index({ status: 1 });

// Method to check if reservation is still valid
cartReservationSchema.methods.isValid = function () {
    return this.status === 'ACTIVE' && this.expiresAt > new Date();
};

// Method to extend reservation
cartReservationSchema.methods.extend = async function (minutes = 15) {
    this.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    await this.save();
    return this;
};

const CartReservation = mongoose.model('CartReservation', cartReservationSchema);

module.exports = CartReservation;
