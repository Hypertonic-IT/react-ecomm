
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hypertonic');
        console.log('MongoDB Connected');

        const categories = await Product.distinct('category');
        console.log('Categories:', categories);

        const products = await Product.find({}, 'name category image images');
        console.log('Sample Products:', products.slice(0, 5));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
