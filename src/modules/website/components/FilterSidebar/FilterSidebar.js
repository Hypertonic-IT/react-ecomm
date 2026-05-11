import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, setFilters, categories }) => {
    // Separate categories by top-level (Gender) vs detailed
    const genderCategories = categories.filter(c => c.showInHeader || c.name === 'Men' || c.name === 'Women');
    const productCategories = categories.filter(c => !c.showInHeader && c.name !== 'Men' && c.name !== 'Women');

    const [collapsed, setCollapsed] = useState({
        genders: false,
        categories: false,
        price: false,
        sort: false
    });

    const toggleSection = (section) => {
        setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleGenderChange = (gender) => {
        const newGenders = filters.genders.includes(gender)
            ? filters.genders.filter(g => g !== gender)
            : [...filters.genders, gender];

        setFilters({ ...filters, genders: newGenders });
    };

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
            {/* Genders / Top Level */}
            {genderCategories.length > 0 && (
                <div className="filter-group">
                    <h3 className="filter-title" onClick={() => toggleSection('genders')}>
                        Gender
                        {collapsed.genders ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </h3>
                    {!collapsed.genders && (
                        <div className="filter-options">
                            {genderCategories.map((cat) => (
                                <label key={cat._id || cat.id} className="filter-option">
                                    <input
                                        type="checkbox"
                                        className="filter-checkbox"
                                        checked={filters.genders.includes(cat.name)}
                                        onChange={() => handleGenderChange(cat.name)}
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Product Types / Subcategories */}
            {productCategories.length > 0 && (
                <div className="filter-group">
                    <h3 className="filter-title" onClick={() => toggleSection('categories')}>
                        Product Type
                        {collapsed.categories ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </h3>
                    {!collapsed.categories && (
                        <div className="filter-options">
                            {productCategories.map((cat) => (
                                <label key={cat._id || cat.id} className="filter-option">
                                    <input
                                        type="checkbox"
                                        className="filter-checkbox"
                                        checked={filters.categories.includes(cat.name)}
                                        onChange={() => handleCategoryChange(cat.name)}
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="filter-group">
                <h3 className="filter-title" onClick={() => toggleSection('price')}>
                    Price Range
                    {collapsed.price ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                </h3>
                {!collapsed.price && (
                    <div className="price-inputs" style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>₹</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.priceRange.min}
                                onChange={(e) => handlePriceChange(e, 'min')}
                                className="price-input"
                            />
                        </div>
                        <span style={{ color: '#999' }}>-</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>₹</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceChange(e, 'max')}
                                className="price-input"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-group">
                <h3 className="filter-title" onClick={() => toggleSection('sort')}>
                    Sort By
                    {collapsed.sort ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                </h3>
                {!collapsed.sort && (
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
                )}
            </div>

            <button 
                onClick={() => setFilters({ genders: [], categories: [], priceRange: { min: 0, max: 10000 }, sortBy: 'newest', search: '' })}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '20px',
                    transition: 'all 0.2s'
                }}
            >
                Clear All Filters
            </button>
        </aside>
    );
};

export default FilterSidebar;
