const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const ProductInventory = require('./src/models/ProductInventory');
const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const productsData = [
    // --- Men Products (10 items) ---
    {
        name: "Casual Denim Jacket",
        category: "Men",
        image: "/uploads/products/casual-denim-jacket-1778505001762.png",
        description: "Classic casual denim jacket with a premium washed finish. Perfect for layering.",
        price: 1499,
        isNewArrival: true,
        isTrending: true,
        rating: 4.5,
        numReviews: 12,
        colors: ["Navy"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Leather Jacket",
        category: "Men",
        image: "/uploads/products/casual-leather-jacket-1778504998224.png",
        description: "Elegant casual leather jacket with durable lining and comfortable fit.",
        price: 1499,
        isNewArrival: false,
        isTrending: true,
        rating: 4.4,
        numReviews: 10,
        colors: ["Black"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Wool Hoodie",
        category: "Men",
        image: "/uploads/products/casual-wool-hoodie-1778505039962.png",
        description: "Cozy wool blend hoodie designed for warmth and modern street style.",
        price: 1299,
        isNewArrival: false,
        isTrending: false,
        rating: 4.3,
        numReviews: 8,
        colors: ["Grey"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Classic Denim Hoodie",
        category: "Men",
        image: "/uploads/products/classic-denim-hoodie-1778505018510.png",
        description: "Denim style hoodie combining classic blue details with comfortable cotton fleece.",
        price: 1399,
        isNewArrival: true,
        isTrending: false,
        rating: 4.2,
        numReviews: 5,
        colors: ["Blue"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Polyester Shirt",
        category: "Men",
        image: "/uploads/products/casual-polyester-shirt-1778504984888.png",
        description: "Lightweight and breathable casual polyester shirt for warm weather comfort.",
        price: 999,
        isNewArrival: false,
        isTrending: false,
        rating: 4.3,
        numReviews: 14,
        colors: ["White"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Classic Linen Shirt",
        category: "Men",
        image: "/uploads/products/classic-linen-shirt-1778505023912.png",
        description: "Premium pure linen shirt offering a classic fit and natural cooling comfort.",
        price: 1299,
        isNewArrival: false,
        isTrending: false,
        rating: 4.1,
        numReviews: 11,
        colors: ["Beige"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Cotton T-Shirt",
        category: "Men",
        image: "/uploads/products/casual-cotton-t-shirt-1778505058330.png",
        description: "Soft and durable everyday casual cotton t-shirt with a relaxed neck fit.",
        price: 799,
        isNewArrival: false,
        isTrending: false,
        rating: 4.3,
        numReviews: 9,
        colors: ["Olive"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Sporty Cotton T-Shirt",
        category: "Men",
        image: "/uploads/products/sporty-cotton-t-shirt-1778505113352.png",
        description: "Cotton stretch athletic fit t-shirt built for running or casual lounging.",
        price: 899,
        isNewArrival: false,
        isTrending: false,
        rating: 4.1,
        numReviews: 6,
        colors: ["Red"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Denim Jeans",
        category: "Men",
        image: "/uploads/products/casual-denim-jeans-1778505085778.png",
        description: "Classic straight-leg denim jeans crafted with durable cotton denim.",
        price: 1299,
        isNewArrival: false,
        isTrending: true,
        rating: 4.4,
        numReviews: 18,
        colors: ["Navy"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Classic Denim Jeans",
        category: "Men",
        image: "/uploads/products/classic-denim-jeans-1778505113230.png",
        description: "Modern slim-fit blue denim jeans with minor distressing details.",
        price: 1399,
        isNewArrival: false,
        isTrending: false,
        rating: 4.2,
        numReviews: 7,
        colors: ["Blue"],
        sizes: ["S", "M", "L", "XL"]
    },

    // --- Women Products (10 items) ---
    {
        name: "Casual Cotton Dress",
        category: "Women",
        image: "/uploads/products/casual-cotton-dress-1778505151664.png",
        description: "Soft A-line cotton dress with floral accents. Perfect for breezy summer days.",
        price: 1499,
        salePrice: 1299,
        discount: 13,
        isNewArrival: false,
        isTrending: true,
        rating: 4.8,
        numReviews: 15,
        colors: ["Pink"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Linen Dress",
        category: "Women",
        image: "/uploads/products/casual-linen-dress-1778505145682.png",
        description: "Relaxed fit pure linen dress offering ultimate style and natural cooling.",
        price: 1399,
        isNewArrival: false,
        isTrending: false,
        rating: 4.6,
        numReviews: 9,
        colors: ["Beige"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Leather Top",
        category: "Women",
        image: "/uploads/products/casual-leather-top-1778505164948.png",
        description: "Bold leather-look crop top designed for a modern fashion statement.",
        price: 899,
        isNewArrival: false,
        isTrending: false,
        rating: 4.1,
        numReviews: 5,
        colors: ["Black"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Cozy Leather Top",
        category: "Women",
        image: "/uploads/products/cozy-leather-top-1778505090497.png",
        description: "Stylish and cozy layered top with soft leather trim details.",
        price: 999,
        isNewArrival: false,
        isTrending: false,
        rating: 4.2,
        numReviews: 8,
        colors: ["Brown"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Denim Sweater",
        category: "Women",
        image: "/uploads/products/casual-denim-sweater-1778505158414.png",
        description: "Unique sweater blending soft knit fabric with stylish denim accents.",
        price: 1299,
        isNewArrival: false,
        isTrending: false,
        rating: 4.3,
        numReviews: 10,
        colors: ["Blue"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Linen Sweater",
        category: "Women",
        image: "/uploads/products/casual-linen-sweater-1778505148693.png",
        description: "Lightweight sweater ideal for layering in mid-season weather.",
        price: 1199,
        isNewArrival: false,
        isTrending: false,
        rating: 4.4,
        numReviews: 6,
        colors: ["White"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Wool Skirt",
        category: "Women",
        image: "/uploads/products/casual-wool-skirt-1778505178057.png",
        description: "Chic pleated wool skirt keeping you warm and stylish all day long.",
        price: 1199,
        isNewArrival: false,
        isTrending: false,
        rating: 4.4,
        numReviews: 12,
        colors: ["Grey"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Classic Denim Skirt",
        category: "Women",
        image: "/uploads/products/classic-denim-skirt-1778505198272.png",
        description: "Fitted button-down denim skirt made from durable high-quality denim.",
        price: 1299,
        isNewArrival: false,
        isTrending: false,
        rating: 4.5,
        numReviews: 14,
        colors: ["Blue"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Casual Cotton Jeans",
        category: "Women",
        image: "/uploads/products/casual-cotton-jeans-1778505009618.png",
        description: "Comfortable high-waisted cotton jeans offering a flattering slim profile.",
        price: 1099,
        isNewArrival: false,
        isTrending: false,
        rating: 4.3,
        numReviews: 16,
        colors: ["Blue"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Cozy Cotton Jeans",
        category: "Women",
        image: "/uploads/products/cozy-cotton-jeans-1778505111247.png",
        description: "Relaxed loose-fit boyfriend jeans for ultimate everyday cozy vibes.",
        price: 1199,
        isNewArrival: false,
        isTrending: false,
        rating: 4.4,
        numReviews: 7,
        colors: ["Beige"],
        sizes: ["S", "M", "L", "XL"]
    }
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing old data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        await ProductInventory.deleteMany({});
        await User.deleteMany({ emailOrMobile: 'admin' });

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
            { name: "Women", slug: "women", description: "Trendy styles for women", image: "https://images.unsplash.com/photo-1524041255072-7da0525d6b34?auto=format&fit=crop&q=80&w=800", status: "Active", showInHeader: true }
        ];

        const insertedCategories = await Category.insertMany(categoriesData);
        console.log(`Inserted ${insertedCategories.length} categories.`);

        console.log('Inserting Products and Inventory...');
        const productsToInsert = [];
        const inventoryToInsert = [];

        for (const item of productsData) {
            const countInStock = Math.floor(Math.random() * 100) + 10;
            const price = item.price;
            const salePrice = item.salePrice || 0;
            const discount = item.discount || 0;
            
            const product = new Product({
                name: item.name,
                image: item.image,
                images: [
                    item.image
                ],
                description: item.description,
                brand: "Kayaroop",
                category: item.category,
                categories: [item.category],
                price: price,
                salePrice: salePrice,
                discount: discount,
                countInStock: countInStock,
                rating: item.rating,
                numReviews: item.numReviews,
                isNewArrival: item.isNewArrival || false,
                isTrending: item.isTrending || false,
                colors: item.colors,
                sizes: item.sizes,
                shortDescription: item.description.substring(0, 100),
                isActive: true
            });

            productsToInsert.push(product);

            const activePrice = salePrice > 0 ? salePrice : price;
            const variants = item.sizes.map((size, index) => ({
                color: product.colors[0],
                size,
                sku: `SKU-${product._id.toString().substring(18)}-${index}`,
                stock: Math.floor(countInStock / item.sizes.length),
                available: Math.floor(countInStock / item.sizes.length),
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
        }

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
