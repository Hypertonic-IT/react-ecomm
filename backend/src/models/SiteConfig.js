const mongoose = require('mongoose');

const siteConfigSchema = mongoose.Schema({
    siteName: {
        type: String,
        default: "Hypertonic"
    },
    supportEmail: {
        type: String,
        default: "support@hypertonic.com"
    },
    currencySymbol: {
        type: String,
        default: "$"
    },
    shippingFee: {
        type: Number,
        default: 10
    },
    freeShippingThreshold: {
        type: Number,
        default: 100
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String
    },
    // Marketing Banners
    heroSlides: [{
        title: String,
        subtitle: String,
        image: String,
        cta: String,
        link: String
    }]
}, {
    timestamps: true
});

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);

module.exports = SiteConfig;
