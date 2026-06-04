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
    const isBusiness = user && user.accountType === 'business';
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('black');
    const [activeTab, setActiveTab] = useState('description');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);

    // B2B States
    const [b2bQty, setB2bQty] = useState(10);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [quoteQty, setQuoteQty] = useState(100);
    const [targetPrice, setTargetPrice] = useState('');
    const [quoteNotes, setQuoteNotes] = useState('');
    const [quoteSubmitting, setQuoteSubmitting] = useState(false);
    const [b2bStockError, setB2bStockError] = useState('');

    // Get current cart item quantity
    const cartItem = product ? cart.find(item =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    ) : null;
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Sync B2B Qty with Cart Item Quantity
    useEffect(() => {
        if (isBusiness) {
            setB2bQty(quantityInCart > 0 ? quantityInCart : 10);
        }
    }, [quantityInCart, isBusiness]);

    useEffect(() => {
        if (product && b2bQty <= product.countInStock) {
            setB2bStockError('');
        }
    }, [b2bQty, product]);

    const handleB2bQtyChange = (e) => {
        const val = parseInt(e.target.value);
        const qty = isNaN(val) ? 1 : Math.max(1, val);
        setB2bQty(qty);
        if (product && qty <= product.countInStock) {
            setB2bStockError('');
        }
    };

    const handleB2bAddToCart = () => {
        if (!product) return;
        if (b2bQty > product.countInStock) {
            setB2bStockError('The requested quantity exceeds current available stock.');
            showToast('The requested quantity exceeds current available stock.', 'error');
            return;
        }
        setB2bStockError('');
        if (quantityInCart > 0) {
            const delta = b2bQty - quantityInCart;
            updateQuantity(product.id, selectedColor, selectedSize, delta);
        } else {
            addToCart({ ...product, selectedColor, selectedSize });
            if (b2bQty > 1) {
                setTimeout(() => {
                    updateQuantity(product.id, selectedColor, selectedSize, b2bQty - 1);
                }, 50);
            }
        }
        showToast(`Updated cart quantity to ${b2bQty}!`, "success");
    };

    const handleB2bBuyNow = () => {
        if (!product) return;
        if (b2bQty > product.countInStock) {
            setB2bStockError('The requested quantity exceeds current available stock.');
            showToast('The requested quantity exceeds current available stock.', 'error');
            return;
        }
        setB2bStockError('');
        if (quantityInCart > 0) {
            const delta = b2bQty - quantityInCart;
            updateQuantity(product.id, selectedColor, selectedSize, delta);
        } else {
            addToCart({ ...product, selectedColor, selectedSize });
            if (b2bQty > 1) {
                updateQuantity(product.id, selectedColor, selectedSize, b2bQty - 1);
            }
        }
        navigate('/checkout/address');
    };

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        setQuoteSubmitting(true);

        try {
            const headers = { 'Content-Type': 'application/json' };
            const authToken = token || localStorage.getItem('authToken');
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            const payload = {
                name: user?.name || "B2B Partner",
                email: user?.email || user?.emailOrMobile || "business@kayaroop.com",
                phone: user?.phone || user?.emailOrMobile || "0000000000",
                message: `Target Price requested: ${targetPrice ? ('₹' + targetPrice) : 'N/A'}. Additional comments: ${quoteNotes}`,
                itemsDescription: `Product: "${product.name}" (ID: ${product.id}), Quantity: ${quoteQty}, Color: ${selectedColor}, Size: ${selectedSize}`
            };

            const response = await fetch(`${API_BASE_URL}/quotes`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                showToast("Wholesale quote request submitted successfully!", "success");
                setIsQuoteOpen(false);
                setTargetPrice('');
                setQuoteNotes('');
                setQuoteQty(100);
            } else {
                alert(result.message || "Failed to submit quote request.");
            }
        } catch (err) {
            console.error("Quote Request Error:", err);
            alert("Error submitting quote request. Please try again.");
        } finally {
            setQuoteSubmitting(false);
        }
    };

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
                                {isBusiness ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ color: '#166534', fontWeight: '800', fontSize: '1.8rem' }}>
                                                {formatPrice(product.price)}
                                            </span>
                                            <span style={{
                                                background: '#dcfce7', color: '#166534', fontSize: '0.75rem',
                                                padding: '2px 8px', borderRadius: '12px', fontWeight: '700', border: '1px solid #166534'
                                            }}>
                                                BUSINESS PRICE
                                            </span>
                                        </div>
                                        {product.retailPrice && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.1rem' }}>
                                                    {formatPrice(product.retailSalePrice || product.retailPrice)}
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                                                    Regular Retail Price (Save {formatPrice((product.retailSalePrice || product.retailPrice) - product.price)})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : appliedCoupon ? (
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

                        {isBusiness ? (
                            <div className="b2b-bulk-controls" style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '20px',
                                marginTop: '15px',
                                marginBottom: '20px',
                                width: '100%'
                            }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    💼 B2B Wholesale Order Panel
                                </div>
                                
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '20px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Direct Quantity:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={b2bQty}
                                            onChange={handleB2bQtyChange}
                                            style={{
                                                width: '120px',
                                                padding: '10px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: '700',
                                                textAlign: 'center',
                                                outline: 'none',
                                                background: '#fff'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Quick Increase:</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {[10, 50, 100].map(amount => (
                                                <button
                                                    key={amount}
                                                    type="button"
                                                    onClick={() => setB2bQty(prev => prev + amount)}
                                                    style={{
                                                        padding: '10px 14px',
                                                        background: '#fff',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: '8px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        color: '#1e293b'
                                                    }}
                                                    onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#94a3b8'; }}
                                                    onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#cbd5e1'; }}
                                                >
                                                    +{amount}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setB2bQty(quantityInCart > 0 ? quantityInCart : 10)}
                                                style={{
                                                    padding: '10px 14px',
                                                    background: '#fee2e2',
                                                    border: '1px solid #fecaca',
                                                    color: '#ef4444',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {b2bStockError && (
                                    <div style={{
                                        background: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        alignItems: 'flex-start',
                                        width: '100%'
                                    }}>
                                        <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600', textAlign: 'left' }}>
                                            ⚠️ {b2bStockError}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/wholesale-quote?productId=${product.id}&qty=${b2bQty}&color=${selectedColor}&size=${selectedSize}`)}
                                            style={{
                                                background: '#ef4444',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px 16px',
                                                fontSize: '0.85rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = '#dc2626'}
                                            onMouseOut={(e) => e.target.style.background = '#ef4444'}
                                        >
                                            Wholesale Quote Request
                                        </button>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={handleB2bAddToCart}
                                        style={{
                                            flex: 2,
                                            padding: '14px 20px',
                                            background: '#0f172a',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#1e293b'}
                                        onMouseOut={(e) => e.target.style.background = '#0f172a'}
                                    >
                                        {quantityInCart > 0 ? 'Update Cart Quantity' : 'Add Bulk to Cart'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleB2bBuyNow}
                                        style={{
                                            flex: 2,
                                            padding: '14px 20px',
                                            background: '#000000',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#1e293b'}
                                        onMouseOut={(e) => e.target.style.background = '#000000'}
                                    >
                                        Buy Now
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsQuoteOpen(true)}
                                        style={{
                                            flex: 1,
                                            padding: '14px 20px',
                                            background: '#fff',
                                            border: '2px solid #0f172a',
                                            color: '#0f172a',
                                            borderRadius: '8px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => { e.target.style.background = '#0f172a'; e.target.style.color = '#fff'; }}
                                        onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#0f172a'; }}
                                    >
                                        Request Quote
                                    </button>

                                    <button
                                        className="pdp-wishlist-btn"
                                        style={{ color: wishlist.includes(product.id) ? 'red' : 'inherit', height: '48px', width: '48px', minWidth: '48px', margin: 0 }}
                                        onClick={async () => {
                                            toggleWishlist(product.id);
                                            const res = await authService.addToWishlist(product);
                                            if (!res.success) {
                                                alert("Failed to save to wishlist: " + (res.message || "Unknown error"));
                                            }
                                        }}
                                    >
                                        <FaHeart />
                                    </button>
                                </div>
                            </div>
                        ) : (
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
                                                disabled={!isBusiness && quantityInCart >= product.countInStock}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ddd',
                                                    background: '#fff', cursor: (!isBusiness && quantityInCart >= product.countInStock) ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: (!isBusiness && quantityInCart >= product.countInStock) ? 0.5 : 1
                                                }}
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="add-cart-btn"
                                            onClick={() => addToCart({ ...product, selectedColor, selectedSize })}
                                            disabled={!isBusiness && product.countInStock === 0}
                                            style={{
                                                opacity: (!isBusiness && product.countInStock === 0) ? 0.5 : 1,
                                                cursor: (!isBusiness && product.countInStock === 0) ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {(!isBusiness && product.countInStock === 0) ? 'Out of Stock' : 'Add to Cart'}
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
                                    disabled={!isBusiness && product.countInStock === 0}
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
                        )}

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

            {isQuoteOpen && (
                <div className="quote-modal-backdrop" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div className="quote-modal-content" style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative'
                    }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '15px' }}>
                            📋 Request Wholesale Quote
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                            Submit a bulk quote request for <strong>{product?.name}</strong>. Our team will review and respond with a custom pricing offer.
                        </p>

                        <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Quantity Required *</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={quoteQty}
                                    onChange={(e) => setQuoteQty(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Target Price per Unit (₹, Optional)</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Enter your target price"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(e.target.value)}
                                    style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Special Notes / Custom Requirements</label>
                                <textarea
                                    rows="4"
                                    placeholder="Tell us about color/size distributions, branding, custom packaging, or shipping preferences..."
                                    value={quoteNotes}
                                    onChange={(e) => setQuoteNotes(e.target.value)}
                                    style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '95%', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsQuoteOpen(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: '#f1f5f9',
                                        color: '#334155',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={quoteSubmitting}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: '#0f172a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        cursor: quoteSubmitting ? 'not-allowed' : 'pointer',
                                        opacity: quoteSubmitting ? 0.7 : 1
                                    }}
                                >
                                    {quoteSubmitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
