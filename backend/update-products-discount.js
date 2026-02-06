const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');

const updateProductsWithDiscount = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hypertonic');
        console.log('✅ MongoDB Connected');

        // Get all products
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products`);

        // Update each product with random discount (10-30%)
        for (const product of products) {
            // Skip if already has discount
            if (product.discount > 0) {
                console.log(`⏭️  Skipping ${product.name} - already has discount`);
                continue;
            }

            // Generate random discount between 10-30%
            const discount = Math.floor(Math.random() * 21) + 10; // 10-30%
            const salePrice = product.price - (product.price * (discount / 100));

            product.discount = discount;
            product.salePrice = parseFloat(salePrice.toFixed(2));

            await product.save();
            console.log(`✅ Updated ${product.name}: ${discount}% OFF, Sale Price: ₹${product.salePrice}`);
        }

        console.log('\n🎉 All products updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateProductsWithDiscount();
