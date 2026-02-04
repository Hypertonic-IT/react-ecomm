
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

// Temporary data from fashionData.js (Hardcoded here for simplicity of script)
const products = [
    {
        name: "Classic Denim Jacket",
        price: 2499,
        category: "Men",
        image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&q=80",
        isNewArrival: true,
        isTrending: true,
        rating: 4.5,
        numReviews: 12,
        countInStock: 20,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Floral Summer Dress",
        price: 1499,
        salePrice: 1299,
        category: "Women",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80",
        isSale: true,
        isTrending: true,
        rating: 4.8,
        numReviews: 8,
        countInStock: 15,
        sizes: ["XS", "S", "M"]
    },
    {
        name: "Urban Street Hoodie",
        price: 2999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        isNewArrival: true,
        rating: 4.2,
        numReviews: 5,
        countInStock: 30,
        sizes: ["M", "L", "XL", "XXL"]
    },
    {
        name: "Leather Crossbody Bag",
        price: 3999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
        isTrending: true,
        rating: 4.7,
        numReviews: 22,
        countInStock: 10
    },
    {
        name: "Kids' Cotton T-Shirt",
        price: 499,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1519238263496-61437a8ac686?w=500&q=80",
        rating: 4.6,
        numReviews: 15,
        countInStock: 50,
        sizes: ["4T", "5T", "6T"]
    },
    {
        name: "Slim Fit Chinos",
        price: 1299,
        category: "Men",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
        isTrending: true,
        rating: 4.4,
        numReviews: 9,
        countInStock: 25,
        sizes: ["30", "32", "34", "36"]
    },
    {
        name: "Summer Straw Hat",
        price: 799,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500&q=80",
        isNewArrival: true,
        rating: 4.3,
        numReviews: 7,
        countInStock: 18
    },
    {
        name: "Running Sneakers",
        price: 3499,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        isTrending: true,
        rating: 4.9,
        numReviews: 45,
        countInStock: 12,
        sizes: ["8", "9", "10", "11"]
    },
    {
        name: "Elegant Evening Gown",
        price: 5999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80",
        isNewArrival: true,
        rating: 4.8,
        numReviews: 6,
        countInStock: 5,
        sizes: ["S", "M", "L"]
    },
    {
        name: "Leather Boots",
        price: 4999,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?w=500&q=80",
        rating: 4.6,
        numReviews: 20,
        countInStock: 8,
        sizes: ["8", "9", "10", "11"]
    },
    {
        name: "Men's Classic Watch",
        price: 8999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        isTrending: true,
        rating: 4.9,
        numReviews: 30,
        countInStock: 15
    },
    {
        name: "Striped Cotton Shirt",
        price: 999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
        rating: 4.3,
        numReviews: 14,
        countInStock: 22,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Denim Shorts",
        price: 899,
        category: "Women",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
        isSale: true,
        rating: 4.5,
        numReviews: 18,
        countInStock: 30,
        sizes: ["26", "28", "30", "32"]
    },
    {
        name: "Aviator Sunglasses",
        price: 2499,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
        isTrending: true,
        rating: 4.7,
        numReviews: 25,
        countInStock: 40
    },
    {
        name: "Patterned Scarf",
        price: 399,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?w=500&q=80",
        rating: 4.2,
        numReviews: 10,
        countInStock: 50
    },
    {
        name: "Kids' Denim Jacket",
        price: 1199,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1622290291314-e67306341f22?w=500&q=80",
        isNewArrival: true,
        rating: 4.6,
        numReviews: 8,
        countInStock: 12,
        sizes: ["4T", "5T", "6T", "Small"]
    },
    {
        name: "Wireless Headphones",
        price: 4999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        isTrending: true,
        rating: 4.8,
        numReviews: 60,
        countInStock: 100
    },
    {
        name: "Yoga Leggings",
        price: 699,
        category: "Women",
        image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&q=80",
        rating: 4.5,
        numReviews: 16,
        countInStock: 28,
        sizes: ["XS", "S", "M", "L"]
    },
    {
        name: "Men's Polo Shirt",
        price: 799,
        category: "Men",
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80",
        rating: 4.3,
        numReviews: 11,
        countInStock: 40,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Ankle Boots",
        price: 2999,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80",
        isNewArrival: true,
        rating: 4.7,
        numReviews: 24,
        countInStock: 14,
        sizes: ["7", "8", "9"]
    }
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing products...');
        await Product.deleteMany();

        console.log('Seeding new products...');
        const createdProducts = await Product.insertMany(products);

        console.log(`Successfully added ${createdProducts.length} products!`);
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
