const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    },
    adminNote: { type: String }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
