
import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, setFilters, categories }) => {

    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];

        setFilters({ ...filters, categories: newCategories });
    };

    const handlePriceChange = (e, type) => {
        setFilters({
            ...filters,
            priceRange: { ...filters.priceRange, [type]: Number(e.target.value) }
        });
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-group">
                <h3 className="filter-title">Categories</h3>
                <div className="filter-options">
                    {categories.map((cat) => (
                        <label key={cat.id} className="filter-option">
                            <input
                                type="checkbox"
                                className="filter-checkbox"
                                checked={filters.categories.includes(cat.title)}
                                onChange={() => handleCategoryChange(cat.title)}
                            />
                            {cat.title}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h3 className="filter-title">Price Range</h3>
                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="price-input"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="price-input"
                    />
                </div>
            </div>

            {/* Placeholder for other filters like Size, Color */}
            <div className="filter-group">
                <h3 className="filter-title">Sort By</h3>
                <div className="filter-options">
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            className="filter-checkbox"
                            style={{ borderRadius: '50%' }}
                            checked={filters.sortBy === 'newest'}
                            onChange={() => setFilters({ ...filters, sortBy: 'newest' })}
                        />
                        Newest Arrivals
                    </label>
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            className="filter-checkbox"
                            style={{ borderRadius: '50%' }}
                            checked={filters.sortBy === 'price-low'}
                            onChange={() => setFilters({ ...filters, sortBy: 'price-low' })}
                        />
                        Price: Low to High
                    </label>
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            className="filter-checkbox"
                            style={{ borderRadius: '50%' }}
                            checked={filters.sortBy === 'price-high'}
                            onChange={() => setFilters({ ...filters, sortBy: 'price-high' })}
                        />
                        Price: High to Low
                    </label>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
