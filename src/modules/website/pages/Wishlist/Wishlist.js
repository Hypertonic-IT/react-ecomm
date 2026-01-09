
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Newsletter from '../../components/Newsletter/Newsletter';
import { useShop } from '../../../../context/ShopContext';
import { FaHeartBroken, FaTrash } from 'react-icons/fa';
import './Wishlist.css';

const WishlistCard = ({ product, onRemove, onMoveToCart }) => {
    const [showSizes, setShowSizes] = useState(false);

    return (
        <div
            className="wishlist-card"
            onMouseLeave={() => setShowSizes(false)}
        >
            <div className="w-image-wrap">
                <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-image" />
                </Link>

                <button
                    className="w-remove-btn"
                    onClick={() => onRemove(product.id)}
                    title="Remove"
                >
                    <FaTrash size={12} />
                </button>

                {/* Boutique Action Overlay */}
                <div className="action-overlay">
                    {product.inStock === false ? (
                        <button className="initial-add-btn" disabled style={{ background: '#eee', color: '#999', border: 'none', cursor: 'not-allowed' }}>
                            Out of Stock
                        </button>
                    ) : (
                        !showSizes ? (
                            <button
                                className="initial-add-btn"
                                onClick={() => setShowSizes(true)}
                            >
                                Quick Add
                            </button>
                        ) : (
                            <div className="size-selection-area">
                                <span className="size-label">Select Size</span>
                                <div className="size-grid">
                                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                        <button
                                            key={size}
                                            className="w-size-btn"
                                            onClick={() => onMoveToCart(product, size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="w-details">
                <div className="w-name">{product.name}</div>
                <div className="w-price">${product.price.toFixed(2)}</div>
            </div>
        </div>
    );
};

const Wishlist = () => {
    const { wishlist, products, toggleWishlist, addToCart } = useShop();

    // Map wishlist IDs to full product objects
    const wishlistItems = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);

    const handleRemove = (id) => {
        toggleWishlist(id);
    };

    const handleMoveToCart = (product, size) => {
        addToCart({
            ...product,
            selectedColor: 'black',
            selectedSize: size
        });
        toggleWishlist(product.id);
    };

    return (
        <div className="wishlist-page">
            <TopBar />
            <Header />

            <div className="wishlist-container">
                <div className="wishlist-header">
                    <div className="wishlist-title">My Wishlist</div>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="wishlist-grid">
                        {wishlistItems.map((item) => (
                            <WishlistCard
                                key={item.id}
                                product={item}
                                onRemove={handleRemove}
                                onMoveToCart={handleMoveToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-wishlist">
                        <h2 className="empty-title">Your wishlist is currently empty.</h2>
                        <Link to="/products" className="start-shop-btn">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default Wishlist;
