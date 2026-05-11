const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const ProductInventory = require('./src/models/ProductInventory');
const User = require('./src/models/User');
const imageService = require('./src/services/ImageService');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing old data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        await ProductInventory.deleteMany({});
        await User.deleteMany({ emailOrMobile: 'admin' }); // Reset admin account if exists

        console.log('Creating Admin User...');
        await User.create({
            name: 'Kayaroop Admin',
            emailOrMobile: 'admin',
            password: 'admin',
            isAdmin: true,
            role: 'super_admin'
        });

        console.log('Inserting Categories...');
        const categoriesData = [
            { name: "Men", slug: "men", description: "Latest trends for men", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: true },
            { name: "Women", slug: "women", description: "Trendy styles for women", image: "https://images.unsplash.com/photo-1524041255072-7da0525d6b34?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: true },
            { name: "T-Shirts", slug: "t-shirts", description: "Casual T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Jackets", slug: "jackets", description: "Warm Jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Jeans", slug: "jeans", description: "Denim Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Shirts", slug: "shirts", description: "Formal & Casual Shirts", image: "https://images.unsplash.com/photo-1596755095514-ce00c3b75620?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Hoodies", slug: "hoodies", description: "Comfortable Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Dresses", slug: "dresses", description: "Elegant Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Tops", slug: "tops", description: "Stylish Tops", image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Sweaters", slug: "sweaters", description: "Cozy Sweaters", image: "https://images.unsplash.com/photo-1614831623868-6c845b4fc231?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false },
            { name: "Skirts", slug: "skirts", description: "Fashionable Skirts", image: "https://images.unsplash.com/photo-1583496661160-c2561910d68f?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: false }
        ];

        const insertedCategories = await Category.insertMany(categoriesData);
        console.log(`Inserted ${insertedCategories.length} categories.`);

        console.log('Generating Products...');
        const adjectives = ["Classic", "Modern", "Vintage", "Elegant", "Casual", "Sporty", "Premium", "Cozy", "Stylish", "Urban"];
        const materials = ["Cotton", "Leather", "Denim", "Silk", "Wool", "Linen", "Polyester"];
        const colors = ["Black", "White", "Navy", "Red", "Grey", "Olive", "Beige", "Pink"];
        const sizes = ["S", "M", "L", "XL"];

        // Men's Specifics - High Quality Curated Unsplash IDs
        const mensTypes = ["T-Shirt", "Jacket", "Jeans", "Shirt", "Hoodie"];
        const mensTypeImages = {
            "T-Shirt": [
                "1521572163474-6864f9cf17ab", "1581655353564-df123a1eb820", "1529374255404-311a2a4f1fd9",
                "1576566588028-4147f3842f27", "1618517351400-5e0e40741511", "1503341455253-b2e72fbb0dbb",
                "1562157873-818bc0726f68", "1554568210-b1c1b9eb1e43", "1618354691229-88d4e9245158"
            ],
            "Jacket": [
                "1551028719-00167b16eac5", "1591047139829-d91aecb6caea", "1544022613-e87ca75a784a",
                "1559551409-dadc959f76b8", "1604644401890-0b44589d71e2", "1520975954732-35dd233062a4",
                "1551488831-00ddcb6c6bd3", "1548883354-931198fd49cc", "1617137968427-85924c800a22"
            ],
            "Jeans": [
                "1542272604-787c3835535d", "1541099649105-f69ad21f3246", "1582552938357-57467770fce3",
                "1604176354204-92d47ed3eaec", "1475178626620-a4d074967452", "1541099643274-981880db73ec",
                "1602293589930-45aad59ba3ab", "1605518216938-eb61c024890a"
            ],
            "Shirt": [
                "1596755095514-ce00c3b75620", "1602810318383-e386cc2a3ce1", "1603252109303-2751441dd15e",
                "1621072156002-e2fcc103e86c", "1617137968427-85924c800a22", "1583900982751-ad33021399e7",
                "1561715276-312066039562", "1559582733-f3d241fde1fd"
            ],
            "Hoodie": [
                "1556821840-3a63f95609a7", "1572495641004-28421ae52e52", "1562157873-818bc0726f68",
                "151378917860a-58c1777f99af", "1541099649105-f69ad21f3246", "1586363104862-2ae862c0ba8c"
            ]
        };
 
        // Women's Specifics - High Quality Curated Unsplash IDs
        const womensTypes = ["Dress", "Top", "Sweater", "Skirt", "Jeans"];
        const womensTypeImages = {
            "Dress": [
                "1595777457583-95e059d581b8", "1515347619152-3cb0e4cd5a89", "1539008835657-9e8e9680c956",
                "1566174053879-31528523f8ae", "1572804013309-59a88b7e92f1", "1598559069352-3d8437b0d42c",
                "1516575150278-77189286d347", "1574706182521-d82c0ef2e8b0"
            ],
            "Top": [
                "1503342394128-c104d54dba01", "1550614000-4b95d466b0f9", "1503341504253-b2e72fbb0dbb",
                "1503342217485-be3c1aefca9a", "1485968579580-b6d095142e6e", "1604171662601-583812752142"
            ],
            "Sweater": [
                "1614831623868-6c845b4fc231", "1434389677669-e08b4cac3105", "1509319117193-57bab727e09d",
                "1608234807905-446fb467cf9a", "1501446529957-6226bd447c46"
            ],
            "Skirt": [
                "1583496661160-c2561910d68f", "1582142407894-ec85a1260a46", "1485230814862-22ad3ad9e2d0",
                "1515347619152-3cb0e4cd5a89", "1571508601936-6ca847b92b61"
            ],
            "Jeans": [
                "1541099649105-f69ad21f3246", "1602293589930-45aad59ba3ab", "1541099643274-981880db73ec",
                "1604176354204-92d47ed3eaec", "1618354691229-88d4e9245158"
            ]
        };

        const productsToInsert = [];
        const inventoryToInsert = [];

        // Initialize Gemini for Metadata (Descriptions/Titles)
        const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
        const metadataModel = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }) : null;

        // Helper to generate products for a category
        const generateProducts = async (categoryName, types, typeImages, count) => {
            console.log(`Generating ${count} products for ${categoryName}...`);
            
            for (let i = 0; i < count; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                const mat = materials[Math.floor(Math.random() * materials.length)];
                
                let name = `${adj} ${mat} ${type}`;
                let description = `This is a high quality ${name}. Perfect for any occasion.`;
                let shortDescription = `A beautiful ${name}`;

                // Use Gemini for more professional names and descriptions if key is available
                if (metadataModel) {
                    try {
                        const prompt = `Generate a professional, catchy eCommerce product name and a 2-sentence description for a ${categoryName} ${type} made of ${mat}. Style: ${adj}. Format: Name | Description`;
                        const result = await metadataModel.generateContent(prompt);
                        const text = result.response.text();
                        if (text.includes('|')) {
                            const parts = text.split('|');
                            name = parts[0].trim();
                            description = parts[1].trim();
                            shortDescription = description.substring(0, 100);
                        }
                    } catch (err) {
                        console.warn("Gemini Metadata generation failed, using defaults.");
                    }
                }
                
                // Strictly 499 to 1000
                const price = Math.floor(Math.random() * (1000 - 499 + 1)) + 499; 
                const isOnSale = Math.random() > 0.7;
                const salePrice = isOnSale ? Math.floor(Math.random() * (price - 499)) + 499 : 0;
                const discount = salePrice > 0 ? Math.floor(((price - salePrice) / price) * 100) : 0;

                // Use ImageService (Gemini or Fallback)
                const optimizedImageUrl = await imageService.generateProductImage(name, categoryName, type);
                
                // For gallery, use curated Unsplash IDs for variety and speed
                const availableImages = typeImages[type] || ["1521572163474-6864f9cf17ab"];
                const shuffled = [...availableImages].sort(() => 0.5 - Math.random());
                const galleryImages = shuffled.slice(0, 3).map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`);

                let subCategory = type + "s";
                if (type === "Dress") subCategory = "Dresses";
                if (type === "Jeans") subCategory = "Jeans";

                const product = new Product({
                    name,
                    image: optimizedImageUrl,
                    images: galleryImages,
                    description,
                    brand: "Kayaroop",
                    category: categoryName,
                    categories: [categoryName, subCategory],
                    price,
                    salePrice,
                    discount,
                    countInStock: Math.floor(Math.random() * 100) + 10,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    numReviews: Math.floor(Math.random() * 50),
                    isNewArrival: Math.random() > 0.8,
                    isTrending: Math.random() > 0.8,
                    colors: [colors[Math.floor(Math.random() * colors.length)]],
                    sizes: sizes,
                    shortDescription,
                    isActive: true
                });

                productsToInsert.push(product);

                const activePrice = salePrice > 0 ? salePrice : price;
                const variants = sizes.map((size, index) => ({
                    color: product.colors[0],
                    size,
                    sku: `SKU-${product._id.toString().substring(18)}-${index}`,
                    stock: Math.floor(product.countInStock / sizes.length),
                    available: Math.floor(product.countInStock / sizes.length),
                    price: activePrice
                }));

                const inventory = new ProductInventory({
                    productId: product._id,
                    productName: product.name,
                    category: product.category,
                    basePrice: activePrice,
                    variants,
                    trackInventory: true
                });

                inventoryToInsert.push(inventory);
                
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        };

        await generateProducts("Men", mensTypes, mensTypeImages, 50);
        await generateProducts("Women", womensTypes, womensTypeImages, 50);

        await Product.insertMany(productsToInsert);
        await ProductInventory.insertMany(inventoryToInsert);
        
        console.log(`Inserted ${productsToInsert.length} products and inventory records.`);
        console.log('Seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
