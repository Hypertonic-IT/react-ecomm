
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './PromotionalBanner.css';

const PromotionalBanner = () => {
    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/800x600?text=Promo+Banner';
    };

    return (
        <section className="promo-section">
            <div className="promo-container">
                <motion.div
                    className="promo-banner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
                        alt="Men's Collection"
                        className="promo-image"
                        onError={handleImageError}
                    />
                    <div className="promo-content">
                        <div className="promo-title">Men's Collection</div>
                        <div className="promo-subtitle">New Season Essentials - Flat 30% Off</div>
                        <Link to="/products?category=Men">
                            <button className="promo-btn">Shop Men</button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    className="promo-banner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1529139574466-a302d2753a90?w=800&q=80"
                        alt="Women's Collection"
                        className="promo-image"
                        onError={handleImageError}
                    />
                    <div className="promo-content">
                        <div className="promo-title">Women's Favorites</div>
                        <div className="promo-subtitle">Trending Styles & New Arrivals</div>
                        <Link to="/products?category=Women">
                            <button className="promo-btn">Shop Women</button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PromotionalBanner;
