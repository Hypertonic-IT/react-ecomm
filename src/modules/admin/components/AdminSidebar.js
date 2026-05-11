
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaHome, FaBoxOpen, FaShoppingBag, FaUsers, FaCog, FaSignOutAlt,
    FaList, FaClipboardList, FaTags, FaStar, FaChartLine, FaLayerGroup,
    FaTimes, FaUserShield, FaNewspaper
} from 'react-icons/fa';

import { useAdminAuth } from '../../../context/AdminAuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAdminAuth();

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="admin-sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--primary-color, #2d3748)' }}>KAYAROOP</h3>
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
                <NavLink to="/admin/blogs" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaNewspaper className="admin-nav-icon" />
                    <span>Blog Posts</span>
                </NavLink>

                <div className="nav-section-label">System</div>
                <NavLink to="/admin/reports" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaChartLine className="admin-nav-icon" />
                    <span>Reports & Analytics</span>
                </NavLink>

                <NavLink to="/admin/settings" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <FaCog className="admin-nav-icon" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="admin-sidebar-footer">
                <button
                    onClick={() => {
                        logout();
                        window.location.href = '/admin/login';
                    }}
                    className="admin-nav-item logout-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit' }}
                >
                    <FaSignOutAlt className="admin-nav-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
