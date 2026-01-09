
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../../../../data/fashionData';
import './CategorySlider.css';

const CategorySlider = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryTitle) => {
        navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/500x300?text=Category';
    };

    return (
        <section className="category-section">
            <div className="category-container">
                <div className="category-header">
                    <h2 className="category-title">Shop By Category</h2>
                    <Link to="/products" className="category-link">View All Categories</Link>
                </div>
                <div className="category-scroll">
                    {categories.filter(c => !c.isLink).map((cat) => (
                        <div
                            key={cat.id}
                            className="category-card"
                            onClick={() => handleCategoryClick(cat.title)}
                        >
                            {cat.image && (
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="category-bg-image"
                                    onError={handleImageError}
                                />
                            )}
                            <div className="category-overlay"></div>
                            <p className="category-name">{cat.title}</p>
                        </div>
                    ))}
                    {/* Additional Static Categories */}
                    <div className="category-card" onClick={() => handleCategoryClick('Accessories')}>
                        <img
                            src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80"
                            alt="Accessories"
                            className="category-bg-image"
                            onError={handleImageError}
                        />
                        <div className="category-overlay"></div>
                        <p className="category-name">Accessories</p>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Footwear')}>
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
                            alt="Footwear"
                            className="category-bg-image"
                            onError={handleImageError}
                        />
                        <div className="category-overlay"></div>
                        <p className="category-name">Footwear</p>
                    </div>
                    <div className="category-card sale-card" onClick={() => navigate('/products?filter=sale')}>
                        <p className="category-name">Sale</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
