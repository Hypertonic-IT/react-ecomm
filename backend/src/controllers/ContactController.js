const Contact = require('../models/Contact');

// @desc  Submit contact form
// @route POST /api/contact
// @access Public
const submitContact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        res.status(201).json({ success: true, message: 'Your message has been received. We\'ll get back to you shortly!' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// @desc  Get all contact submissions (Admin)
// @route GET /api/contact
// @access Private/Admin
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json({ success: true, contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc  Update contact status (Admin)
// @route PUT /api/contact/:id/status
// @access Private/Admin
const updateContactStatus = async (req, res) => {
    const { status, adminNote } = req.body;
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

        if (status) contact.status = status;
        if (adminNote !== undefined) contact.adminNote = adminNote;
        await contact.save();

        res.json({ success: true, message: 'Contact updated', data: contact });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { submitContact, getContacts, updateContactStatus };
