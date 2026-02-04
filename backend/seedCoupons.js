
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Coupon = require('./src/models/Coupon');

// Load env vars
dotenv.config();

const coupons = [
    {
        code: "FLAT500",
        name: "Flat ₹500 OFF",
        description: "Save ₹500 on orders above ₹2499",
        discountType: "flat",
        discountValue: 500,
        minOrderValue: 2499,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "WELCOME10",
        name: "Welcome Offer",
        description: "Get 10% off on your first order",
        discountType: "percentage",
        discountValue: 10,
        maxDiscount: 1000,
        minOrderValue: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "SUMMER30",
        name: "Summer Sale",
        description: "Get 30% off on all summer collections",
        discountType: "percentage",
        discountValue: 30,
        maxDiscount: 2000,
        minOrderValue: 1499,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "FIRSTBUY",
        name: "First Purchase Deal",
        description: "Flat ₹200 off on your first purchase over ₹999",
        discountType: "flat",
        discountValue: 200,
        minOrderValue: 999,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "DIWALI20",
        name: "Diwali Special",
        description: "Celebration offer: 20% off on ethnic wear",
        discountType: "percentage",
        discountValue: 20,
        maxDiscount: 5000,
        minOrderValue: 1999,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "FREESHIP",
        name: "Free Shipping",
        description: "Free shipping on orders above ₹499",
        discountType: "flat",
        discountValue: 0,
        minOrderValue: 499,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "WINTER15",
        name: "Winter Warmers",
        description: "15% off on jackets and sweaters",
        discountType: "percentage",
        discountValue: 15,
        maxDiscount: 1500,
        minOrderValue: 999,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "SUPER50",
        name: "Super 50 Deal",
        description: "Get ₹50 off on small orders",
        discountType: "flat",
        discountValue: 50,
        minOrderValue: 299,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "LUCKY7",
        name: "Lucky 7% Off",
        description: "An extra 7% off on everything",
        discountType: "percentage",
        discountValue: 7,
        maxDiscount: 700,
        minOrderValue: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        code: "MEGA1000",
        name: "Mega Savings",
        description: "Flat ₹1000 off on premium orders over ₹5000",
        discountType: "flat",
        discountValue: 1000,
        minOrderValue: 5000,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    }
];

const seedCoupons = async () => {
    try {
        await connectDB();

        console.log('Clearing existing coupons...');
        await Coupon.deleteMany();

        console.log('Seeding new coupons...');
        await Coupon.insertMany(coupons);

        console.log(`Successfully added ${coupons.length} coupons!`);
        process.exit();
    } catch (error) {
        console.error('Error seeding coupons:', error);
        process.exit(1);
    }
};

seedCoupons();
