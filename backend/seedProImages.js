
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

const imageSets = {
    Men: [
        [ // Set 1: Urban/Street
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
            'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80',
            'https://images.unsplash.com/photo-1515243066686-3a6d3c73f37b?w=800&q=80'
        ],
        [ // Set 2: Casual
            'https://images.unsplash.com/photo-1617137968427-85924c809a10?w=800&q=80',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'
        ]
    ],
    Women: [
        [ // Set 1: Chic/Dress
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
            'https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=800&q=80'
        ],
        [ // Set 2: Casual/Street
            'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
            'https://images.unsplash.com/photo-1550614000-4b9519e0921f?w=800&q=80'
        ]
    ],
    Kids: [
        [
            'https://images.unsplash.com/photo-1519238263496-61437a8ac686?w=800&q=80',
            'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
            'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80'
        ]
    ],
    Accessories: [
        [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', // Bag
            'https://images.unsplash.com/photo-1590874103328-3275f6993142?w=800&q=80',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'
        ],
        [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', // Sunglasses
            'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
        ]
    ],
    Footwear: [
        [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Red Nike
            'https://images.unsplash.com/photo-1607522602199-3d3bfdce4638?w=800&q=80',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80'
        ],
        [
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', // Vans
            'https://images.unsplash.com/photo-1521093470119-a3acdc43374a?w=800&q=80',
            'https://images.unsplash.com/photo-1565299999261-28ba859019bb?w=800&q=80'
        ]
    ]
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hypertonic');
        console.log('MongoDB Connected');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update`);

        let updatedCount = 0;

        for (const product of products) {
            const category = product.category;
            const sets = imageSets[category] || imageSets['Men']; // Fallback

            // Pick a random set
            const randomSet = sets[Math.floor(Math.random() * sets.length)];

            // Assign: Main image is index 0, others go to gallery
            // Note: We keep the main image if it matches the style, or just overwrite everything for consistency
            // Let's overwrite everything to ensure high quality "multiple" images look cohesive

            product.image = randomSet[0];
            product.images = randomSet.slice(1); // Rest are gallery

            await product.save();
            updatedCount++;
            process.stdout.write('.');
        }

        console.log(`\nSuccessfully updated ${updatedCount} products with multiple images.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateImages();
