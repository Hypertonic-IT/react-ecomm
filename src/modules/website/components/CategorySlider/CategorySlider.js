
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../../../context/ShopContext';
import './CategorySlider.css';
import { getImageUrl } from 'config';

const CategorySlider = () => {
    const navigate = useNavigate();
    const { categories } = useShop();
    const scrollRef = React.useRef(null);
    const [isHovered, setIsHovered] = React.useState(false);

    // Show all categories in the slider (both Men and Women)
    const safeCategories = (categories || []);

    // Duplicate categories for the marquee loop effect if needed, but only if we have some data
    // If we have very few categories, we might want to repeat them more times to fill the width
    const repeatCount = safeCategories.length > 0 ? Math.ceil(10 / safeCategories.length) : 0;

    // Create an array that repeats the categories enough times to fill the slider
    const displayCategories = [];
    if (safeCategories.length > 0) {
        for (let i = 0; i < Math.max(2, repeatCount); i++) {
            displayCategories.push(...safeCategories);
        }
    }

    const handleCategoryClick = (categoryTitle) => {
        navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1485230946086-1d932bf52210?w=500&q=80';
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    // Auto-Scroll implementation removed based on user feedback ("slider chlta hua dikhao" -> "moving in a loop is bad")
    // Keep manual scroll and drag
    // React.useEffect(() => { ... }); -> REMOVED

    if (safeCategories.length === 0) return null;

    return (
        <section className="category-section">
            <div className="category-container">
                <div className="category-header">
                    <h2 className="category-title">Shop By Category</h2>
                </div>

                <div
                    className="slider-wrapper"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Continuous Marquee Slider */}
                    <div className="category-scroll">
                        <div className="marquee-content">
                            {/* Double the content to ensure seamless loop */}
                            {[...displayCategories, ...displayCategories].map((cat, index) => (
                                <div
                                    key={`${cat._id || cat.id}-${index}`}
                                    className="category-card"
                                    onClick={() => handleCategoryClick(cat.name || cat.title)}
                                >
                                    <div className="blob-card">
                                        <div className="blob-background"></div>
                                        <img
                                            src={getImageUrl(cat.image || 'https://images.unsplash.com/photo-1485230946086-1d932bf52210?w=500&q=80')}
                                            alt={cat.name || cat.title}
                                            className="category-image"
                                            onError={handleImageError}
                                        />
                                    </div>
                                    <p className="category-name">{cat.name || cat.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
