const SiteConfig = require('../models/SiteConfig');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        // Find the first document, if not exists create one with defaults
        let settings = await SiteConfig.findOne();
        if (!settings) {
            settings = await SiteConfig.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await SiteConfig.findOne();
        if (!settings) {
            settings = await SiteConfig.create({});
        }

        // Update fields
        settings.siteName = req.body.siteName || settings.siteName;
        settings.supportEmail = req.body.supportEmail || settings.supportEmail;
        settings.currencySymbol = req.body.currencySymbol || settings.currencySymbol;
        settings.shippingFee = req.body.shippingFee !== undefined ? req.body.shippingFee : settings.shippingFee;
        settings.freeShippingThreshold = req.body.freeShippingThreshold !== undefined ? req.body.freeShippingThreshold : settings.freeShippingThreshold;

        if (req.body.socialLinks) {
            settings.socialLinks = {
                ...settings.socialLinks,
                ...req.body.socialLinks
            };
        }

        // Future: Handle heroSlides if needed here

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
