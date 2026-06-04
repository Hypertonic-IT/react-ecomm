const BusinessApplication = require('../models/BusinessApplication');
const User = require('../models/User');

// @desc    Submit Business Application
// @route   POST /api/business/apply
// @access  Private
const submitApplication = async (req, res) => {
    const {
        business_name,
        contact_person,
        email,
        phone,
        gst_number,
        business_address,
        business_type,
        city,
        state,
        monthly_requirement
    } = req.body;

    try {
        const userId = req.user._id;

        // Check if there is an existing pending or approved application
        const existingApp = await BusinessApplication.findOne({ user_id: userId });
        if (existingApp) {
            if (existingApp.status === 'approved') {
                return res.status(400).json({ success: false, message: 'You already have an approved business account' });
            }
            if (existingApp.status === 'pending') {
                return res.status(400).json({ success: false, message: 'Your business application is already pending review' });
            }
        }

        const application = new BusinessApplication({
            user_id: userId,
            business_name,
            contact_person,
            email,
            phone,
            gst_number,
            business_address,
            business_type,
            city,
            state,
            monthly_requirement,
            status: 'pending'
        });

        const savedApp = await application.save();
        res.status(201).json({ success: true, data: savedApp });
    } catch (error) {
        console.error('Error submitting business application:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current user's business application status
// @route   GET /api/business/status
// @access  Private
const getApplicationStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const application = await BusinessApplication.findOne({ user_id: userId });

        if (!application) {
            return res.json({ success: true, application: null });
        }

        res.json({ success: true, application });
    } catch (error) {
        console.error('Error fetching application status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all business applications (Admin only)
// @route   GET /api/business/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
    try {
        const applications = await BusinessApplication.find({})
            .populate('user_id', 'name emailOrMobile')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching business applications:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update application status (Admin only)
// @route   PUT /api/business/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    try {
        const application = await BusinessApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        // If approved, update user accountType and status
        if (status === 'approved') {
            await User.findByIdAndUpdate(application.user_id, { accountType: 'business', status: 'Active' });
        } else if (status === 'rejected') {
            await User.findByIdAndUpdate(application.user_id, { status: 'Rejected' });
        } else if (status === 'pending') {
            await User.findByIdAndUpdate(application.user_id, { status: 'Pending Approval' });
        }

        res.json({ success: true, message: `Application status updated to ${status}`, data: application });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle isActive for a business application (Admin)
// @route   PUT /api/business/applications/:id/active
// @access  Private/Admin
const toggleApplicationActive = async (req, res) => {
    const { isActive } = req.body;
    try {
        const application = await BusinessApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        application.isActive = isActive;
        await application.save();

        // Also update the User's status accordingly
        if (!isActive) {
            await User.findByIdAndUpdate(application.user_id, { status: 'Rejected' });
        } else {
            await User.findByIdAndUpdate(application.user_id, { status: 'Active' });
        }

        res.json({ success: true, message: `Account ${isActive ? 'activated' : 'deactivated'}`, data: application });
    } catch (error) {
        console.error('Error toggling active status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    submitApplication,
    getApplicationStatus,
    getApplications,
    updateApplicationStatus,
    toggleApplicationActive
};
