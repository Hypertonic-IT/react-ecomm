
import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import { motion } from 'framer-motion';
import './ProductSlider.css';

const ProductSlider = ({ title, products }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 320; // card width + gap
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Auto-scroll functionality
    useEffect(() => {
        let interval;
        if (!isHovered) {
            interval = setInterval(() => {
                if (scrollRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                    if (scrollLeft + clientWidth >= scrollWidth - 10) {
                        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scroll('right');
                    }
                }
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <section className="product-slider-section">
            <div className="product-slider-container">
                <div className="product-slider-header">
                    <h2 className="product-slider-title">{title}</h2>
                    <Link to="/products" className="view-all-link">View All</Link>
                </div>

                <div
                    className="slider-wrapper"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        className="slider-arrow left"
                        onClick={() => scroll('left')}
                        aria-label="Previous Products"
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="products-track" ref={scrollRef}>
                        {products.map((product, index) => (
                            <motion.div
                                key={`${product.id}-${index}`}
                                className="product-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(`/product/${product.id}`)} // Make whole card clickable or just the eye
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="product-image-wrapper">
                                    <button
                                        className="wishlist-btn"
                                        style={{ color: wishlist.includes(product.id) ? 'red' : '#333' }}
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                        aria-label="Add to Wishlist"
                                    >
                                        <FaHeart />
                                    </button>

                                    {/* NEW: Quick View / Details Eye Icon */}
                                    <button
                                        className="quick-view-btn"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                                        aria-label="View Details"
                                    >
                                        <FaEye />
                                    </button>

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Image' }}
                                    />
                                </div>
                                <div className="product-info">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-price">${product.price ? product.price.toFixed(2) : '0.00'}</div>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button
                        className="slider-arrow right"
                        onClick={() => scroll('right')}
                        aria-label="Next Products"
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* Additional CSS for the eye icon button */}
            <style>{`
                .quick-view-btn {
                    position: absolute;
                    top: 60px; /* Below wishlist */
                    right: 15px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 16px;
                    cursor: pointer;
                    z-index: 2;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    opacity: 0;
                    transform: translateY(-10px);
                    color: #333;
                }
                
                .product-card:hover .quick-view-btn {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .quick-view-btn:hover {
                    background: #000;
                    color: #fff;
                }
            `}</style>
        </section>
    );
};

export default ProductSlider;
