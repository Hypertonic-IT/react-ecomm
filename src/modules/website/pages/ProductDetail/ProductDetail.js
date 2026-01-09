
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../../../../data/fashionData';
import { useShop } from '../../../../context/ShopContext';
import { FaHeart, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import Newsletter from '../../components/Newsletter/Newsletter';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('black');
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const found = products.find(p => p.id === parseInt(id));
        if (found) {
            setProduct(found);
            setSelectedImage(found.image);
            // Scroll to top when product changes
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    // Mock additional images for gallery
    const galleryImages = [
        product.image,
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', // Fashion generic 1
        'https://images.unsplash.com/photo-1550614000-4b9519e0921f?w=500&q=80', // Fashion generic 2
        'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&q=80'  // Fashion generic 3
    ];

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 5);

    return (
        <div className="pdp-page">
            <TopBar />
            <Header />

            <div className="pdp-container">
                {/* Breadcrumbs */}
                <div className="pdp-breadcrumbs">
                    <Link to="/">Home</Link> <span>/</span>
                    <Link to={`/products?category=${product.category}`}>{product.category}</Link> <span>/</span>
                    {product.name}
                </div>

                <div className="pdp-grid">
                    {/* Gallery */}
                    <div className="pdp-gallery">
                        <div className="pdp-thumbnails">
                            {galleryImages.map((img, i) => (
                                <div
                                    key={i}
                                    className={`pdp-thumb ${selectedImage === img ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt="Thumbnail" />
                                </div>
                            ))}
                        </div>
                        <div className="pdp-main-image">
                            <img src={selectedImage} alt={product.name} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pdp-info">
                        <div className="pdp-info-header">
                            <h1 className="pdp-title">{product.name}</h1>
                            <div className="pdp-price">${product.price.toFixed(2)}</div>
                        </div>

                        <p className="pdp-description-preview">
                            Elevate your wardrobe with this premium {product.name.toLowerCase()}.
                            Designed for modern versatility and crafted from high-quality materials to ensure lasting comfort and style.
                        </p>

                        <div className="pdp-variants">
                            <span className="pdp-section-title">Color: {selectedColor}</span>
                            <div className="color-options">
                                {['black', 'navy', 'beige'].map(c => (
                                    <div
                                        key={c}
                                        className={`color-swatch ${selectedColor === c ? 'active' : ''}`}
                                        style={{ backgroundColor: c === 'navy' ? '#000080' : c === 'beige' ? '#f5f5dc' : '#000' }}
                                        onClick={() => setSelectedColor(c)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pdp-variants">
                            <span className="pdp-section-title">Size: {selectedSize}</span>
                            <div className="size-options">
                                {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                                    <button
                                        key={s}
                                        className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pdp-actions">
                            <button
                                className="add-cart-btn"
                                onClick={() => addToCart({ ...product, selectedColor, selectedSize })}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="pdp-wishlist-btn"
                                style={{ color: wishlist.includes(product.id) ? 'red' : 'inherit' }}
                                onClick={() => toggleWishlist(product.id)}
                            >
                                <FaHeart />
                            </button>
                        </div>

                        <div className="pdp-trust">
                            <div className="trust-item"><FaTruck /> Free Shipping</div>
                            <div className="trust-item"><FaUndo /> 30 Day Returns</div>
                            <div className="trust-item"><FaShieldAlt /> Secure Checkout</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="pdp-tabs">
                    <div className="tab-headers">
                        {['description', 'details', 'delivery'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <p>
                                Experience the perfect blend of style and functionality with the {product.name}.
                                tailored to fit your lifestyle, this piece features premium stitching, durable fabric,
                                and a timeless design that never goes out of fashion. Perfect for casual outings or semi-formal events.
                            </p>
                        )}
                        {activeTab === 'details' && (
                            <ul>
                                <li>Material: 100% Premium Cotton</li>
                                <li>Fit: Regular / Slim Match</li>
                                <li>Care: Machine Wash Cold</li>
                                <li>Origin: Imported</li>
                            </ul>
                        )}
                        {activeTab === 'delivery' && (
                            <p>
                                Free standard shipping on all orders over $100.
                                Orders are processed within 24 hours.
                                Estimated delivery: 3-5 business days.
                            </p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div style={{ marginTop: '80px' }}>
                    <ProductSlider title="You Might Also Like" products={relatedProducts} />
                </div>
            </div>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default ProductDetail;
