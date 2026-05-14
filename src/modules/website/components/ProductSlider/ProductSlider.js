
import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { motion } from 'framer-motion';
import './ProductSlider.css';
import { getImageUrl } from '../../../../../config';

const ProductSlider = ({ title, products }) => {
    const { addToCart, toggleWishlist, wishlist } = useShop();
    const { formatPrice } = useCurrency();
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showArrows, setShowArrows] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
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

    // Check if arrows should be shown and update scroll state
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const hasOverflow = scrollWidth > clientWidth;
            setShowArrows(hasOverflow);
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Check on mount and when products change
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [products]);

    // Auto-scroll functionality
    useEffect(() => {
        let interval;
        if (!isHovered && showArrows) {
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
    }, [isHovered, showArrows]);

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
                    {showArrows && canScrollLeft && (
                        <button
                            className="slider-arrow left"
                            onClick={() => scroll('left')}
                            aria-label="Previous Products"
                        >
                            <FaArrowLeft />
                        </button>
                    )}

                    <div className="products-track" ref={scrollRef} onScroll={checkScroll}>
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

                                    {/* Discount Badge */}
                                    {product.discount > 0 && (
                                        <div className="slider-discount-badge">
                                            {product.discount}% OFF
                                        </div>
                                    )}

                                    {/* NEW: Quick View / Details Eye Icon */}
                                    <button
                                        className="quick-view-btn"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                                        aria-label="View Details"
                                    >
                                        <FaEye />
                                    </button>

                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' }}
                                    />
                                </div>
                                <div className="product-info">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-meta-row">
                                        <div className="product-price">
                                            {product.discount > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontWeight: '700', color: '#ef4444', fontSize: '14px' }}>
                                                        {formatPrice(product.salePrice)}
                                                    </span>
                                                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px' }}>
                                                        {formatPrice(product.price)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '14px' }}>{formatPrice(product.price)}</span>
                                            )}
                                        </div>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {showArrows && canScrollRight && (
                        <button
                            className="slider-arrow right"
                            onClick={() => scroll('right')}
                            aria-label="Next Products"
                        >
                            <FaArrowRight />
                        </button>
                    )}
                </div>
            </div>


        </section>
    );
};

export default ProductSlider;
