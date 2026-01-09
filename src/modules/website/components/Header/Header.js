
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import { categories } from '../../../../data/fashionData';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
    const { cart, wishlist } = useShop();
    const [activeMenu, setActiveMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto';
    };

    return (
        <header className="header" onMouseLeave={() => setActiveMenu(null)}>
            <div className="nav-container">
                {/* HAMBURGER (Mobile) */}
                <div className="hamburger" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                {/* LOGO */}
                <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                    HYPERTONIC
                </Link>

                {/* DESKTOP MENU */}
                <nav className="desktop-menu">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.title === 'New Arrivals' || cat.title === 'Sale' ? '' : cat.title}`}
                            className={`menu-item ${activeMenu === cat.id ? 'active' : ''}`}
                            style={{ color: cat.isHighlight ? '#e74c3c' : undefined }}
                            onMouseEnter={() => setActiveMenu(cat.id)}
                        >
                            {cat.title}
                        </Link>
                    ))}
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
                                    type="text"
                                    placeholder="Search..."
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
                            <FaSearch
                                onClick={() => setActiveMenu(activeMenu === 'search' ? null : 'search')}
                                className="header-icon"
                            />
                        </div>
                    </div>
                    <div className="icon-wrap">
                        <Link to="/wishlist" className="header-icon"><FaHeart /></Link>
                        {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </div>
                    <div className="icon-wrap">
                        <Link to="/cart" className="header-icon"><FaShoppingBag /></Link>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </div>
                    <div className="icon-wrap">
                        <Link to="/profile" className="header-icon"><FaUser /></Link>
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
                                key={cat.id}
                                to={`/products?category=${cat.title === 'New Arrivals' || cat.title === 'Sale' ? '' : cat.title}`}
                                className="mobile-link"
                                onClick={toggleMobileMenu}
                            >
                                {cat.title}
                            </Link>
                        ))}
                        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <Link to="/profile" className="mobile-link" onClick={toggleMobileMenu} style={{ fontSize: '16px' }}>
                                My Account
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MEGA MENU (Desktop Only) */}
            <AnimatePresence>
                {activeMenu && activeMenu !== 'search' && categories.find(c => c.id === activeMenu)?.columns && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mega-menu"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="mega-grid">
                            {categories.find(c => c.id === activeMenu).columns.map((col, idx) => (
                                <div key={idx}>
                                    <span className="column-title">{col.title}</span>
                                    {col.items.map((item, i) => (
                                        <Link key={i} to={`/products?search=${item}`} className="link-item">
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                            <div>
                                <img
                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80"
                                    alt="Feature"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
