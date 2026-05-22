const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');
const ProductInventory = require('./src/models/ProductInventory');

// Logic identical to frontend to ensure exact match
const extractCategoryTokens = (p) => {
    const tokens = [];
    const push = (v) => { if (v || v === 0) tokens.push(String(v).toLowerCase().trim()); };

    if (p.category) {
        if (typeof p.category === 'string') push(p.category.replace(/['’]/g, ''));
        else if (typeof p.category === 'object') {
            push(p.category.id || p.category._id || p.category.name || p.category.title);
        }
    }
    if (p.categoryId) push(p.categoryId);
    if (p.gender) push(p.gender);
    if (p.categories && Array.isArray(p.categories)) p.categories.forEach(c => push(c));

    return tokens.flatMap(t => t.split(/[,/\s]+/).map(x => x.replace(/[^a-z0-9]/g, '').trim()).filter(Boolean));
};

const isMen = (p) => {
    const toks = extractCategoryTokens(p);
    return toks.some(t => ['men', 'man', 'male'].includes(t) || (t.includes('men') && !t.includes('women')) || (t.includes('male') && !t.includes('female')));
};
const isWomen = (p) => {
    const toks = extractCategoryTokens(p);
    return toks.some(t => ['women', 'woman', 'female'].includes(t) || t.includes('women') || t.includes('female'));
};

async function cleanupProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        // Fetch all active products
        const products = await Product.find({ isActive: { $ne: false } }).lean();
        
        // Find the 10 Men's products that match the frontend slice
        const menProducts = products.filter(isMen).slice(0, 10);
        const menIds = new Set(menProducts.map(p => p._id.toString()));
        
        // Find the 10 Women's products that match the frontend slice
        const womenProducts = products.filter(p => isWomen(p) && !menIds.has(p._id.toString())).slice(0, 10);
        
        const productsToKeep = [...menProducts, ...womenProducts];
        const idsToKeep = productsToKeep.map(p => p._id);
        
        console.log(`Keeping ${menProducts.length} Men's products and ${womenProducts.length} Women's products.`);
        
        // Delete all products NOT in the idsToKeep array
        const deleteProductsResult = await Product.deleteMany({ _id: { $nin: idsToKeep } });
        console.log(`Deleted ${deleteProductsResult.deletedCount} unnecessary products.`);
        
        // Delete all inventories for the deleted products
        const deleteInventoriesResult = await ProductInventory.deleteMany({ productId: { $nin: idsToKeep } });
        console.log(`Deleted ${deleteInventoriesResult.deletedCount} unnecessary inventory records.`);
        
        // Optional: also delete any inactive products if they exist (already handled by $nin query)
        
        process.exit();
    } catch (err) {
        console.error("Error cleaning up products:", err);
        process.exit(1);
    }
}

cleanupProducts();
