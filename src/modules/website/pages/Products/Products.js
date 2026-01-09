
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Helmet } from 'react-helmet';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Newsletter from '../../components/Newsletter/Newsletter';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import { products, categories } from '../../../../data/fashionData';
import { useShop } from '../../../../context/ShopContext';
import { FaHeart, FaEye } from 'react-icons/fa'; // Added FaEye
import './Products.css';

const Products = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook for navigation
    const { addToCart, toggleWishlist, wishlist } = useShop();

    // Initial Filters State
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'newest'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Parse query params for initial category filter
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');

        if (categoryParam) {
            setFilters(prev => ({ ...prev, categories: [categoryParam] }));
        }
    }, [location]);

    // Filtering Logic
    const filteredProducts = products.filter(product => {
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
        if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); // Simple boolean sort
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
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="plp-image-wrap">
                                            <button
                                                className="wishlist-btn"
                                                style={{
                                                    position: 'absolute', top: '10px', right: '10px',
                                                    border: 'none', background: 'white', borderRadius: '50%',
                                                    width: '30px', height: '30px', cursor: 'pointer', zIndex: 2,
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                    color: wishlist.includes(product.id) ? 'red' : '#333',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                            >
                                                <FaHeart />
                                            </button>

                                            {/* NEW: Quick View Eye Icon */}
                                            <button
                                                className="quick-view-plp"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                                                style={{
                                                    position: 'absolute', top: '50px', right: '10px',
                                                    border: 'none', background: 'white', borderRadius: '50%',
                                                    width: '30px', height: '30px', cursor: 'pointer', zIndex: 2,
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                    color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <FaEye />
                                            </button>

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="plp-image"
                                                onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Image' }}
                                            />
                                        </div>
                                        <div className="plp-info">
                                            <div className="plp-category">{product.category}</div>
                                            <div className="plp-name">{product.name}</div>
                                            <div className="plp-price">${product.price.toFixed(2)}</div>
                                            <button
                                                style={{
                                                    marginTop: '10px', width: '100%', padding: '8px',
                                                    background: '#1a1a1a', color: '#fff', border: 'none',
                                                    cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-results">
                            <h3>No products found matching your filters.</h3>
                            <button
                                onClick={() => setFilters({ categories: [], priceRange: { min: 0, max: 1000 }, sortBy: 'newest' })}
                                style={{ marginTop: '20px', padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Newsletter />
            <Footer />

            {/* Hover effect for eye icon in PLP */}
            <style>{`
                .quick-view-plp { opacity: 0; transform: translateX(10px); }
                .plp-card:hover .quick-view-plp { opacity: 1; transform: translateX(0); }
                .quick-view-plp:hover { background: #000 !important; color: #fff !important; }
            `}</style>
        </div>
    );
};

export default Products;
