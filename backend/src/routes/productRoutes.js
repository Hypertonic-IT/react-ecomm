const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct
} = require('../controllers/ProductController');
const { protect, admin, checkUser } = require('../middleware/authMiddleware');

router.route('/')
    .get(checkUser, getProducts)
    .post(protect, admin, createProduct);

router.route('/:id')
    .get(checkUser, getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

module.exports = router;
