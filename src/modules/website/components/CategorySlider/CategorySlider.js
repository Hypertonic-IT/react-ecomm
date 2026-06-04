
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../../context/ShopContext';
import './CategorySlider.css';
import { getImageUrl } from 'config';

const CategorySlider = () => {
    const navigate = useNavigate();
    const { categories } = useShop();

    const safeCategories = (categories || []);

    const handleCategoryClick = (categoryTitle) => {
        navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1485230946086-1d932bf52210?w=500&q=80';
    };

    if (safeCategories.length === 0) return null;

    return (
        <section className="category-section">
            <div className="category-container">
                <div className="category-header">
                    <p className="category-eyebrow">Browse our collection</p>
                    <h2 className="category-title">Shop By Category</h2>
                    <div className="category-title-line" />
                </div>

                <div className="category-grid">
                    {safeCategories.map((cat) => (
                        <div
                            key={cat._id || cat.id}
                            className="category-card"
                            onClick={() => handleCategoryClick(cat.name || cat.title)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.name || cat.title)}
                            aria-label={`Shop ${cat.name || cat.title}`}
                        >
                            <div className="category-card-inner">
                                <div className="category-image-wrap">
                                    <img
                                        src={getImageUrl(cat.image || 'https://images.unsplash.com/photo-1485230946086-1d932bf52210?w=500&q=80')}
                                        alt={cat.name || cat.title}
                                        className="category-image"
                                        onError={handleImageError}
                                    />
                                    <div className="category-image-overlay" />
                                </div>
                                <div className="category-card-body">
                                    <p className="category-name">{cat.name || cat.title}</p>
                                    <span className="category-cta">Shop Now →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
