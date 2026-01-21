
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../../../../data/fashionData';
import './CategorySlider.css';

const CategorySlider = () => {
    const navigate = useNavigate();
    const scrollRef = React.useRef(null);
    const [isHovered, setIsHovered] = React.useState(false);

    // Duplicate categories to create a longer list ("categories bdha do")
    const extendedCategories = [...categories, ...categories, ...categories, ...categories];
    // Additional manual categories to ensure variety
    const manualCategories = [
        { id: 'm1', title: 'Streetwear', image: 'https://images.unsplash.com/photo-1523396876543-d737d9941329?w=500&q=80' },
        { id: 'm2', title: 'Vintage', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80' },
        { id: 'm3', title: 'Formal', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80' },
        { id: 'm4', title: 'Denim', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&q=80' },
        { id: 'm5', title: 'Jackets', image: 'https://images.unsplash.com/photo-1551028919-383718addcb4?w=500&q=80' },
    ];

    const allCategories = [...extendedCategories, ...manualCategories];

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

    // Auto-Scroll Implementation ("slider chlta hua dikhao")
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current && !isHovered) {
                const { current } = scrollRef;
                // If we reached the end, snap back to start (optional, or just keep scrolling if loop)
                // For simple auto-scroll:
                if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 1) {
                    current.scrollLeft = 0; // Reset to start
                } else {
                    current.scrollLeft += 2; // Smooth slow scroll speed
                }
            }
        }, 20); // Run every 20ms for smooth framing

        return () => clearInterval(interval);
    }, [isHovered]);

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
                    <button className="nav-btn prev-btn" onClick={() => scroll('left')}>&#8592;</button>
                    <div className="category-scroll" ref={scrollRef}>
                        {allCategories.filter(c => !c.isLink).map((cat, index) => (
                            <div
                                key={`${cat.id}-${index}`}
                                className="category-card"
                                onClick={() => handleCategoryClick(cat.title)}
                            >
                                <div className="blob-card">
                                    <div className="blob-background"></div>
                                    {cat.image && (
                                        <img
                                            src={cat.image}
                                            alt={cat.title}
                                            className="category-image"
                                            onError={handleImageError}
                                        />
                                    )}
                                </div>
                                <p className="category-name">{cat.title}</p>
                            </div>
                        ))}
                    </div>
                    <button className="nav-btn next-btn" onClick={() => scroll('right')}>&#8594;</button>
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
