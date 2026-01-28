import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useShop } from '../../../../context/ShopContext';
import { useAuth } from '../../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
    const { cart, wishlist, categories, products } = useShop();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const searchInputRef = React.useRef(null);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto';
    };

    const toggleSearch = () => {
        if (activeMenu === 'search') {
            setActiveMenu(null);
        } else {
            setActiveMenu('search');
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUserMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfileClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            setUserMenuOpen(!userMenuOpen);
        }
    };

    // Helper to get sub-categories dynamically from products if not defined in category
    // This is a bit of a hack to "generate" submenus if the category model is simple
    const getSubCategories = (catName) => {
        // If we have manual column data from static file, we might miss it here if we fully switched.
        // For now, let's assume we want to show generic links or dynamic types if available.
        // A simple fallback:
        return [
            { title: 'Shop All', items: ['New Arrivals', 'Best Sellers'] }
        ];
    };

    return (
        <header className="header" onMouseLeave={() => setActiveMenu(null)}>
            <div className="nav-container">
                {/* HAMBURGER (Mobile) */}
                <div className="hamburger" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </div>

                {/* LOGO */}
                <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                    HYPERTONIC
                </Link>

                {/* DESKTOP MENU */}
                <nav className="desktop-menu">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id || cat.id}
                            to={`/products?category=${cat.name || cat.title}`}
                            className={`menu-item ${activeMenu === (cat._id || cat.id) ? 'active' : ''}`}
                            style={{ color: (cat.isHighlight) ? '#e74c3c' : undefined }}
                            onMouseEnter={() => setActiveMenu(cat._id || cat.id)}
                        >
                            {cat.name || cat.title}
                        </Link>
                    ))}
                    <Link to="/about" className="menu-item">About</Link>
                    <Link to="/contact" className="menu-item">Contact</Link>
                </nav>

                {/* ICONS */}
                <div className="nav-icons">
                    <div className="icon-wrap">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: activeMenu === 'search' ? '200px' : 0, opacity: activeMenu === 'search' ? 1 : 0 }}
                                style={{ overflow: 'hidden', marginRight: activeMenu === 'search' ? '10px' : 0 }}
                            >
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            navigate(`/products?search=${e.target.value}`);
                                            setActiveMenu(null);
                                        }
                                    }}
                                    style={{
                                        border: 'none',
                                        borderBottom: '1px solid #000',
                                        padding: '5px',
                                        outline: 'none',
                                        width: '100%',
                                        fontSize: '14px'
                                    }}
                                />
                            </motion.div>
                            <FiSearch
                                onClick={toggleSearch}
                                className="header-icon"
                            />
                        </div>
                    </div>
                    <div className="icon-wrap">
                        <Link to="/wishlist" className="header-icon"><FiHeart /></Link>
                        {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </div>
                    <div className="icon-wrap">
                        <Link to="/cart" className="header-icon"><FiShoppingBag /></Link>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </div>
                    <div className="icon-wrap user-menu-wrapper">
                        <div onClick={handleProfileClick} className="header-icon user-icon" style={{ cursor: 'pointer', color: 'black' }}>
                            <FiUser />
                        </div>

                        {/* User Dropdown Menu */}
                        {isAuthenticated && userMenuOpen && (
                            <div className="user-dropdown">
                                <div className="user-dropdown-header">
                                    <div className="user-dropdown-name">{user?.name}</div>
                                    <div className="user-dropdown-email">{user?.email}</div>
                                </div>
                                <div className="user-dropdown-divider"></div>
                                <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                    My Account
                                </Link>
                                <Link to="/orders" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                    My Orders
                                </Link>
                                <Link to="/wishlist" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                    Wishlist
                                </Link>
                                <div className="user-dropdown-divider"></div>
                                <button onClick={handleLogout} className="user-dropdown-item logout-btn">
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        {categories.map((cat) => (
                            <Link
                                key={cat._id || cat.id}
                                to={`/products?category=${cat.name || cat.title}`}
                                className="mobile-link"
                                onClick={toggleMobileMenu}
                            >
                                {cat.name || cat.title}
                            </Link>
                        ))}
                        <Link to="/about" className="mobile-link" onClick={toggleMobileMenu}>
                            About Us
                        </Link>
                        <Link to="/contact" className="mobile-link" onClick={toggleMobileMenu}>
                            Contact Us
                        </Link>
                        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            {isAuthenticated ? (
                                <>
                                    <div style={{ padding: '0 20px', marginBottom: '16px' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary)' }}>{user?.name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>{user?.email}</div>
                                    </div>
                                    <Link to="/profile" className="mobile-link" onClick={toggleMobileMenu} style={{ fontSize: '16px' }}>
                                        My Account
                                    </Link>
                                    <Link to="/orders" className="mobile-link" onClick={toggleMobileMenu} style={{ fontSize: '16px' }}>
                                        My Orders
                                    </Link>
                                    <button onClick={handleLogout} className="mobile-link" style={{ fontSize: '16px', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="mobile-link" onClick={toggleMobileMenu} style={{ fontSize: '16px' }}>
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
