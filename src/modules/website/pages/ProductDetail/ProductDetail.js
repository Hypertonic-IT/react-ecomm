import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../../../context/ShopContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { authService } from '../../../../services/authService';
import { useAuth } from '../../../../context/AuthContext';
import { FaHeart, FaTruck, FaShieldAlt, FaUndo, FaMinus, FaPlus, FaStar, FaStarHalfAlt, FaRegStar, FaPercentage, FaCheck } from 'react-icons/fa';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import Newsletter from '../../components/Newsletter/Newsletter';
import './ProductDetail.css';
import './Reviews.css';
import AvailableCoupons from '../../components/Coupon/AvailableCoupons';
import { API_BASE_URL, BASE_URL } from 'config';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        addToCart,
        updateQuantity,
        cart,
        toggleWishlist,
        wishlist,
        products,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        showToast
    } = useShop();
    const { formatPrice } = useCurrency();
    const { user, token } = useAuth(); // Get user and token from AuthContext
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('black');
    const [activeTab, setActiveTab] = useState('description');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);

    const checkAndApplyCoupon = async (code) => {
        if (!code) return;

        // Check if item is in cart
        const isInCart = cart.some(item =>
            item.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (!isInCart) {
            // Show warning to user as requested
            showToast("Please add this item to your cart first to apply the coupon.", "warning");
        } else {
            await applyCoupon(code, user?.id);
        }
    };

    const handleApplyCoupon = async () => {
        await checkAndApplyCoupon(couponCode);
    };

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/coupons/active`);
                const result = await response.json();
                if (result.success) {
                    setAvailableCoupons(result.data);
                }
            } catch (err) {
                console.error("Error fetching coupons:", err);
            }
        };
        fetchCoupons();
    }, []);

    useEffect(() => {
        const found = products.find(p => String(p.id) === id);
        if (found) {
            setProduct(found);
            setSelectedImage(found.image);
            // Initial selection based on available options
            if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
            if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);

            // Scroll to top when product changes
            window.scrollTo(0, 0);
        }
    }, [id, products]);

    if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    // Use product images for gallery if available, otherwise mock
    const galleryImages = (product.images && product.images.length > 0)
        ? [product.image, ...product.images]
        : [product.image];

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 5);

    return (
        <div className="pdp-page">
            <TopBar />
            <Header />

            <div className="pdp-container">
                {/* Breadcrumbs */}
                <div className="pdp-breadcrumbs">
                    <Link to="/">Home</Link> <span>/</span>
                    <Link to={`/products?category=${product.category}`}>{product.category}</Link> <span>/</span>
                    {product.name}
                </div>

                <div className="pdp-grid">
                    {/* Gallery */}
                    <div className="pdp-gallery">
                        <div className="pdp-thumbnails">
                            {galleryImages.map((img, i) => (
                                <div
                                    key={i}
                                    className={`pdp-thumb ${selectedImage === img ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img
                                        src={img}
                                        alt="Thumbnail"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="pdp-main-image">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pdp-info">
                        <div className="pdp-info-header">
                            <h1 className="pdp-title">{product.name}</h1>
                            <div className="pdp-price">
                                {appliedCoupon ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '1.8rem', fontWeight: '700', color: '#166534' }}>
                                                {formatPrice(
                                                    appliedCoupon.discountType === 'percentage'
                                                        ? (product.salePrice || product.price) * (1 - appliedCoupon.discountValue / 100)
                                                        : (product.salePrice || product.price) - appliedCoupon.discountValue
                                                )}
                                            </span>
                                            <span style={{
                                                background: '#dcfce7', color: '#166534', fontSize: '0.75rem',
                                                padding: '2px 8px', borderRadius: '12px', fontWeight: '700', border: '1px solid #166534'
                                            }}>
                                                COUPON APPLIED
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1rem' }}>
                                                {formatPrice(product.salePrice || product.price)}
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Original Price</span>
                                        </div>
                                    </div>
                                ) : product.discount > 0 ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '1.5rem' }}>
                                            {formatPrice(product.salePrice)}
                                        </span>
                                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1rem', fontWeight: '400' }}>
                                            {formatPrice(product.price)}
                                        </span>
                                        <span style={{
                                            background: '#fee2e2', color: '#ef4444', fontSize: '0.8rem',
                                            padding: '2px 6px', borderRadius: '4px', fontWeight: '700'
                                        }}>
                                            {product.discount}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    formatPrice(product.price)
                                )}
                            </div>
                        </div>

                        <p className="pdp-description-preview">
                            {product.shortDescription ||
                                "Elevate your wardrobe with this premium item. Designed for modern versatility and crafted from high-quality materials to ensure lasting comfort and style."}
                        </p>

                        <div className="pdp-variants">
                            <span className="pdp-section-title">Color: {selectedColor}</span>
                            <div className="color-options">
                                {(product.colors && product.colors.length > 0 ? product.colors : ['black', 'navy', 'beige']).map(c => (
                                    <div
                                        key={c}
                                        className={`color-swatch ${selectedColor === c ? 'active' : ''}`}
                                        style={{ backgroundColor: c }}
                                        title={c}
                                        onClick={() => setSelectedColor(c)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pdp-variants">
                            <span className="pdp-section-title">Size: {selectedSize}</span>
                            <div className="size-options">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL']).map(s => (
                                    <button
                                        key={s}
                                        className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pdp-stock-info" style={{ marginBottom: '15px', fontWeight: '500', color: product.countInStock > 0 ? (product.countInStock < 5 ? '#eab308' : '#10b981') : '#ef4444' }}>
                            {product.countInStock > 0 ? (
                                product.countInStock < 10
                                    ? `Only ${product.countInStock} Left in Stock!`
                                    : `In Stock (${product.countInStock} available)`
                            ) : (
                                "Out of Stock"
                            )}
                        </div>

                        {/* Attractive Coupon Card */}
                        {/* Attractive Coupon Card */}
                        {(product.salePrice || product.price) > 5999 && (
                            <div className="pdp-coupon-card" style={{
                                margin: '20px 0',
                                padding: '16px',
                                background: '#f8fafc',
                                border: '1px dashed #3b82f6',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease'
                            }}>
                                {!appliedCoupon ? (
                                    <>
                                        <div className="pdp-coupon-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCouponOpen ? '15px' : '0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px',
                                                    background: '#eff6ff', borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6'
                                                }}>
                                                    <FaPercentage size={14} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Offers & Coupons</div>
                                                    {!isCouponOpen && <div style={{ fontSize: '11px', color: '#64748b' }}>Save up to ₹500 on this item</div>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsCouponOpen(!isCouponOpen)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#3b82f6',
                                                    fontWeight: '600',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {isCouponOpen ? 'Close' : 'View All Offers >'}
                                            </button>
                                        </div>

                                        {isCouponOpen && (
                                            <div className="pdp-coupon-content animate-fade-in" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', marginTop: '10px' }}>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter promo code"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value)}
                                                            style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                                                        />
                                                        <button onClick={handleApplyCoupon} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                                                            APPLY
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Use reusable component */}
                                                <AvailableCoupons
                                                    coupons={availableCoupons}
                                                    onApply={(code) => checkAndApplyCoupon(code)}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: '#dcfce7',
                                        border: '1px solid #166534',
                                        borderRadius: '8px',
                                        padding: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '36px', height: '36px',
                                                background: '#166534', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff'
                                            }}>
                                                <FaCheck size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#166534' }}>
                                                    '{appliedCoupon.code}' APPLIED!
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '500' }}>
                                                    Savings of {formatPrice(appliedCoupon.discount)} applied.
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            style={{
                                                background: '#fff',
                                                border: '1px solid #ef4444',
                                                color: '#ef4444',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pdp-actions">
                            {(() => {
                                const cartItem = cart.find(item =>
                                    item.id === product.id &&
                                    item.selectedColor === selectedColor &&
                                    item.selectedSize === selectedSize
                                );

                                const quantityInCart = cartItem ? cartItem.quantity : 0;

                                return quantityInCart > 0 ? (
                                    <div className="pdp-quantity-stepper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => updateQuantity(product.id, selectedColor, selectedSize, -1)}
                                            style={{
                                                width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd',
                                                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <FaMinus size={12} />
                                        </button>
                                        <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                                            {quantityInCart}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(product.id, selectedColor, selectedSize, 1)}
                                            disabled={quantityInCart >= product.countInStock}
                                            style={{
                                                width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd',
                                                background: '#fff', cursor: quantityInCart >= product.countInStock ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: quantityInCart >= product.countInStock ? 0.5 : 1
                                            }}
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="add-cart-btn"
                                        onClick={() => addToCart({ ...product, selectedColor, selectedSize })}
                                        disabled={product.countInStock === 0}
                                        style={{
                                            opacity: product.countInStock === 0 ? 0.5 : 1,
                                            cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                );
                            })()}

                            <button
                                className="buy-now-btn"
                                onClick={() => {
                                    // If not in cart, add it first
                                    const cartItem = cart.find(item =>
                                        item.id === product.id &&
                                        item.selectedColor === selectedColor &&
                                        item.selectedSize === selectedSize
                                    );
                                    if (!cartItem) {
                                        addToCart({ ...product, selectedColor, selectedSize });
                                    }
                                    navigate('/checkout/address');
                                }}
                                disabled={product.countInStock === 0}
                            >
                                Buy Now
                            </button>
                            <button
                                className="pdp-wishlist-btn"
                                style={{ color: wishlist.includes(product.id) ? 'red' : 'inherit' }}
                                onClick={async () => {
                                    toggleWishlist(product.id);
                                    // Also sync with backend
                                    const res = await authService.addToWishlist(product);
                                    if (!res.success) {
                                        alert("Failed to save to wishlist: " + (res.message || "Unknown error"));
                                    }
                                }}
                            >
                                <FaHeart />
                            </button>
                        </div>

                        <div className="pdp-trust">
                            <div className="trust-item"><FaTruck /> Free Shipping</div>
                            <div className="trust-item"><FaUndo /> 30 Day Returns</div>
                            <div className="trust-item"><FaShieldAlt /> Secure Checkout</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="pdp-tabs">
                    <div className="tab-headers">
                        {['description', 'details', 'reviews', 'delivery'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <p style={{ whiteSpace: 'pre-line' }}>
                                {product.description || "No description available."}
                            </p>
                        )}
                        {activeTab === 'details' && (
                            <ul>
                                {product.specifications && product.specifications.length > 0 ? (
                                    product.specifications.map((spec, i) => (
                                        <li key={i}><strong>{spec.name}:</strong> {spec.value}</li>
                                    ))
                                ) : (
                                    <>
                                        <li>Material: Premium Quality</li>
                                        <li>Fit: Standard Size</li>
                                        <li>Care: Follow instructions on label</li>
                                    </>
                                )}
                            </ul>
                        )}
                        {activeTab === 'reviews' && (
                            <ReviewsSection productId={product.id} productName={product.name} />
                        )}
                        {activeTab === 'delivery' && (
                            <p style={{ whiteSpace: 'pre-line' }}>
                                {product.shippingInfo ||
                                    "Free standard shipping on all orders over ₹8,350.\nOrders are processed within 24 hours.\nEstimated delivery: 3-5 business days."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div style={{ marginTop: '80px' }}>
                    <ProductSlider title="You Might Also Like" products={relatedProducts} />
                </div>
            </div>

            <Newsletter />
            <Footer />
        </div>
    );
};

// Reviews Section Component
const ReviewsSection = ({ productId, productName }) => {
    const { user, token, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: '',
        comment: '',
        name: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
            if (response.ok) {
                const data = await response.json();
                // Fix: The API returns { success: true, reviews: [...], stats: ... }
                // We need to set reviews to data.reviews, defaulting to empty array if missing
                setReviews(data.reviews || []);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const headers = { 'Content-Type': 'application/json' };

            // Use token from context or local storage
            const authToken = token || localStorage.getItem('authToken');
            if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

            if (!user) {
                alert("You must be logged in to submit a review.");
                return;
            }

            // Backend middleware expects 'user-id' header with user email currently
            if (user?.email) {
                headers['user-id'] = user.email;
            } else if (user?.emailOrMobile) {
                headers['user-id'] = user.emailOrMobile;
            } else {
                const savedUser = localStorage.getItem('authUser');
                if (savedUser) {
                    try {
                        const parsedUser = JSON.parse(savedUser);
                        if (parsedUser.email) headers['user-id'] = parsedUser.email;
                        else if (parsedUser.emailOrMobile) headers['user-id'] = parsedUser.emailOrMobile;
                    } catch (e) { console.error(e); }
                }
            }

            if (!headers['user-id']) {
                alert("Session invalid. Please log in again.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    ...newReview,
                    product: productId, // Backend expects 'product', not 'productId'
                    // removed productName as it might not be needed by backend schema
                })
            });

            const data = await response.json();

            if (response.ok) {
                setNewReview({ rating: 5, title: '', comment: '', name: '' });
                setShowReviewForm(false);
                // We don't fetch reviews immediately because the new review is 'pending'
                // fetchReviews(); 
                alert('Review submitted successfully!');
            } else {
                alert(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, size = 16) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} size={size} color="#fbbf24" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" size={size} color="#fbbf24" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} size={size} color="#d1d5db" />);
        }
        return stars;
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="reviews-section">
            {/* Reviews Summary */}
            <div className="reviews-summary">
                <div className="rating-overview">
                    <div className="average-rating">
                        <span className="rating-number">{averageRating}</span>
                        <div className="stars">{renderStars(parseFloat(averageRating), 20)}</div>
                        <span className="review-count">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                    </div>
                </div>
                <button
                    className={`write-review-btn ${showReviewForm ? 'cancel-btn-mode' : ''}`}
                    onClick={() => {
                        if (!isAuthenticated) {
                            alert("Please log in to write a review.");
                            return;
                        }
                        setShowReviewForm(!showReviewForm);
                    }}
                >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
                <div className="review-form-container">
                    <h3>Write Your Review</h3>
                    <form onSubmit={handleSubmitReview} className="review-form">
                        <div className="form-group">
                            <label>Your Rating *</label>
                            <div className="star-rating-input">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FaStar
                                        key={star}
                                        size={28}
                                        color={star <= newReview.rating ? '#fbbf24' : '#d1d5db'}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        style={{ cursor: 'pointer', marginRight: '8px' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Review Title *</label>
                            <input
                                type="text"
                                value={newReview.title}
                                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                                required
                                placeholder="Summarize your experience"
                            />
                        </div>

                        <div className="form-group">
                            <label>Your Review *</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                required
                                rows="5"
                                placeholder="Share your thoughts about this product..."
                            />
                        </div>

                        <button type="submit" className="submit-review-btn" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '10px' }}>No reviews yet</p>
                        <p style={{ fontSize: '14px', color: '#9ca3af' }}>Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="reviewer-name">{review.user?.name || 'Anonymous'}</div>
                                        <div className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            {review.title && <h4 className="review-title">{review.title}</h4>}
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
