const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const menCount = await Product.countDocuments({ categories: 'Men' });
    const womenCount = await Product.countDocuments({ categories: 'Women' });
    const menCatCount = await Product.countDocuments({ category: 'Men' });
    const womenCatCount = await Product.countDocuments({ category: 'Women' });
    
    console.log(`Men: ${menCount} (categories include Men), ${menCatCount} (category exact)`);
    console.log(`Women: ${womenCount} (categories include Women), ${womenCatCount} (category exact)`);
    
    const sampleMen = await Product.findOne({ categories: 'Men' });
    if(sampleMen) console.log("Men sample:", sampleMen.name, sampleMen.category, sampleMen.categories);
    else console.log("No men products found");

    const sampleWomen = await Product.findOne({ categories: 'Women' });
    if(sampleWomen) console.log("Women sample:", sampleWomen.name, sampleWomen.category, sampleWomen.categories);

    process.exit();
}
check();
