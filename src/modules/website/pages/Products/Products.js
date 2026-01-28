
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Newsletter from '../../components/Newsletter/Newsletter';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import { useShop } from '../../../../context/ShopContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { FaHeart, FaEye } from 'react-icons/fa';
import './Products.css';

const Products = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, wishlist, products, categories } = useShop();
    const { formatPrice } = useCurrency();

    // Initial Filters State
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'newest'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Increased slightly for better grid

    // Parse query params for initial category & search filter
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        setFilters(prev => ({
            ...prev,
            categories: categoryParam ? [categoryParam] : [],
            search: searchParam || ''
        }));
    }, [location]);

    // Filtering Logic
    const filteredProducts = products.filter(product => {
        // Search Filter
        if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Category Filter
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
            return false;
        }

        // Price Filter
        if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
            return false;
        }

        return true;
    });

    // Sorting Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0;
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="products-page">
            <Helmet>
                <title>Shop All Products | Hypertonic</title>
                <meta name="description" content="Browse our exclusive collection of fashion items." />
            </Helmet>

            <TopBar />
            <Header />

            <div className="products-container">
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories.filter(c => !c.isLink)}
                />

                <div className="products-content">
                    <div className="products-header">
                        <h1>Shop</h1>
                        <span className="products-count">Showing {currentItems.length} of {sortedProducts.length} results</span>
                    </div>

                    {currentItems.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {currentItems.map(product => (
                                    <div
                                        key={product.id}
                                        className="plp-card"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <div className="plp-image-wrap">
                                            {/* Wishlist Button */}
                                            <button
                                                className="plp-action-btn wishlist-btn-plp"
                                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                                title="Add to Wishlist"
                                                style={{ color: wishlist.includes(product.id) ? 'red' : '#333' }}
                                            >
                                                <FaHeart size={14} />
                                            </button>

                                            {/* Quick View Button */}
                                            <button
                                                className="plp-action-btn quick-view-btn-plp"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                                                title="Quick View"
                                            >
                                                <FaEye size={14} />
                                            </button>

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="plp-image"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' }}
                                            />
                                        </div>

                                        <div className="plp-info">
                                            <div className="plp-category">{product.category}</div>
                                            <div className="plp-name">{product.name}</div>

                                            <div className="plp-meta-row">
                                                <div className="plp-price">{formatPrice(product.price)}</div>
                                                <button
                                                    className="plp-add-cart-btn"
                                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="page-btn prev-btn"
                                        style={{ width: 'auto', padding: '0 12px', opacity: currentPage === 1 ? 0.5 : 1 }}
                                    >
                                        &larr; Prev
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="page-btn next-btn"
                                        style={{ width: 'auto', padding: '0 12px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-results">
                            <h3>No products found matching your filters.</h3>
                            <button
                                onClick={() => setFilters({ categories: [], priceRange: { min: 0, max: 1000 }, sortBy: 'newest' })}
                                style={{
                                    marginTop: '20px',
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontWeight: '600'
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default Products;
