
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaHome, FaBoxOpen, FaShoppingBag, FaUsers, FaCog, FaSignOutAlt,
    FaList, FaClipboardList, FaTags, FaStar, FaChartLine, FaLayerGroup,
    FaTimes
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="admin-sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/img/hyperlogo.png" alt="Hypertonic Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </div>
                {/* Mobile Close Button */}
                <button className="mobile-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <nav className="admin-nav">
                <div className="nav-section-label">Main Menu</div>
                <NavLink to="/admin/dashboard" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaHome className="admin-nav-icon" />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/orders" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaShoppingBag className="admin-nav-icon" />
                    <span>Orders</span>
                </NavLink>
                <NavLink to="/admin/products" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaBoxOpen className="admin-nav-icon" />
                    <span>Products</span>
                </NavLink>
                <NavLink to="/admin/categories" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaList className="admin-nav-icon" />
                    <span>Categories</span>
                </NavLink>
                <NavLink to="/admin/users" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaUsers className="admin-nav-icon" />
                    <span>Customers</span>
                </NavLink>

                <div className="nav-section-label">Management</div>
                <NavLink to="/admin/inventory" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaClipboardList className="admin-nav-icon" />
                    <span>Inventory</span>
                </NavLink>
                <NavLink to="/admin/coupons" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaTags className="admin-nav-icon" />
                    <span>Coupons & Offers</span>
                </NavLink>
                <NavLink to="/admin/reviews" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaStar className="admin-nav-icon" />
                    <span>Reviews</span>
                </NavLink>

                <div className="nav-section-label">System</div>
                <NavLink to="/admin/analytics" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaChartLine className="admin-nav-icon" />
                    <span>Reports</span>
                </NavLink>
                <NavLink to="/admin/content" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaLayerGroup className="admin-nav-icon" />
                    <span>Content (CMS)</span>
                </NavLink>
                <NavLink to="/admin/settings" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaCog className="admin-nav-icon" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="admin-sidebar-footer">
                <a href="/" className="admin-nav-item logout-item">
                    <FaSignOutAlt className="admin-nav-icon" />
                    <span>Exit Admin</span>
                </a>
            </div>
        </aside>
    );
};

export default AdminSidebar;
