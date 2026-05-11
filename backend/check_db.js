const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB:", mongoose.connection.name);
    
    const count = await Product.countDocuments();
    console.log("Total Products in DB:", count);
    
    if (count > 0) {
      const sample = await Product.findOne();
      console.log("Sample Product Name:", sample.name);
      console.log("Sample Product Image:", sample.image);
    } else {
        console.log("No products found. Did you run seed.js successfully?");
    }
    
    process.exit();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkProducts();
