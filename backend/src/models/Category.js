const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] },
    showInHeader: { type: Boolean, default: false },
    productsCount: { type: Number, default: 0 } // Can be updated via hooks or aggregation
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
