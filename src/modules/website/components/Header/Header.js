
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag, FaBars } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import { categories } from '../../../../data/fashionData';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { cart, wishlist } = useShop();
    const [activeMenu, setActiveMenu] = useState(null);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Styles (Inline for simplicity in this artifact, usually in CSS Modules)
    const styles = {
        header: {
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        },
        navContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '80px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
        },
        logo: {
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#000',
            textDecoration: 'none'
        },
        menu: {
            display: 'flex',
            gap: '30px',
            height: '100%',
            alignItems: 'center'
        },
        menuItem: {
            cursor: 'pointer',
            fontWeight: '500',
            textTransform: 'uppercase',
            fontSize: '14px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            textDecoration: 'none'
        },
        icons: {
            display: 'flex',
            gap: '20px',
            fontSize: '18px'
        },
        iconWrap: {
            position: 'relative',
            cursor: 'pointer'
        },
        badge: {
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        megaMenu: {
            position: 'absolute',
            top: '80px',
            left: 0,
            width: '100%',
            backgroundColor: '#fff',
            borderTop: '1px solid #eee',
            padding: '40px 0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        },
        megaGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            gap: '40px'
        },
        columnTitle: {
            fontWeight: 'bold',
            marginBottom: '15px',
            display: 'block',
            fontSize: '14px'
        },
        linkItem: {
            display: 'block',
            color: '#666',
            marginBottom: '10px',
            fontSize: '14px',
            transition: 'color 0.2s',
            textDecoration: 'none'
        }
    };

    return (
        <header style={styles.header} onMouseLeave={() => setActiveMenu(null)}>
            <div style={styles.navContainer}>
                {/* LOGO */}
                <Link to="/" style={styles.logo}>
                    HYPERTONIC
                </Link>

                {/* MEGA MENU */}
                <nav style={styles.menu}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.title === 'New Arrivals' || cat.title === 'Sale' ? '' : cat.title}`}
                            style={{ ...styles.menuItem, color: cat.isHighlight ? '#e74c3c' : '#333' }}
                            onMouseEnter={() => setActiveMenu(cat.id)}
                        >
                            {cat.title}
                        </Link>
                    ))}
                </nav>

                {/* ICONS */}
                <div style={styles.icons}>
                    <div style={styles.iconWrap}>
                        {/* Expandable Search */}
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
                            <FaSearch onClick={() => setActiveMenu(activeMenu === 'search' ? null : 'search')} />
                        </div>
                    </div>
                    <div style={styles.iconWrap}>
                        <Link to="/wishlist" style={{ color: 'inherit' }}><FaHeart /></Link>
                        {wishlist.length > 0 && <span style={styles.badge}>{wishlist.length}</span>}
                    </div>
                    <div style={styles.iconWrap}>
                        <Link to="/cart" style={{ color: 'inherit' }}><FaShoppingBag /></Link>
                        {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                    </div>
                    <div style={styles.iconWrap}><Link to="/profile" style={{ color: 'inherit' }}><FaUser /></Link></div>
                </div>
            </div>

            {/* DROPDOWN CONTENT */}
            <AnimatePresence>
                {activeMenu && categories.find(c => c.id === activeMenu)?.columns && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={styles.megaMenu}
                        onMouseEnter={() => setActiveMenu(activeMenu)} // Keep menu open when hovering dropdown
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div style={styles.megaGrid}>
                            {categories.find(c => c.id === activeMenu).columns.map((col, idx) => (
                                <div key={idx}>
                                    <span style={styles.columnTitle}>{col.title}</span>
                                    {col.items.map((item, i) => (
                                        <Link key={i} to={`/products?search=${item}`} style={styles.linkItem}>
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                            {/* Featured Image in Mega Menu */}
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
