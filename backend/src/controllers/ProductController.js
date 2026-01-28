
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        // Also support filtering by category via query param
        if (req.query.category) {
            keyword.category = req.query.category;
        }

        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        // We now expect the full payload from the frontend
        const {
            name, price, description, image, category, countInStock,
            sizes, colors, isNewArrival, isTrending, isSale, isBestSeller, isExclusive, isActive
        } = req.body;

        const product = new Product({
            name,
            price,
            user: req.user ? req.user._id : null,
            image,
            category,
            countInStock,
            description,
            sizes,
            colors,
            isNewArrival: isNewArrival || false,
            isTrending: isTrending || false,
            isSale: isSale || false,
            isBestSeller: isBestSeller || false,
            isExclusive: isExclusive || false,
            isActive: isActive !== undefined ? isActive : true,
            rating: 0,
            numReviews: 0
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name, price, description, image, category, countInStock,
        sizes, colors, isNewArrival, isTrending, isSale, isBestSeller, isExclusive, isActive
    } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.category = category;
            product.countInStock = countInStock;
            product.sizes = sizes;
            product.colors = colors;

            if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
            if (isTrending !== undefined) product.isTrending = isTrending;
            if (isSale !== undefined) product.isSale = isSale;
            if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
            if (isExclusive !== undefined) product.isExclusive = isExclusive;
            if (isActive !== undefined) product.isActive = isActive;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
};
