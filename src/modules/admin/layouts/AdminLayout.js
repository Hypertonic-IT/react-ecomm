
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { FaBars, FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import '../admin.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Helper to get formatted page title
    const getPageTitle = () => {
        const path = location.pathname.split('/')[2];
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    // Helper to get breadcrumb
    const getBreadcrumb = () => {
        const path = location.pathname.split('/')[2];
        if (!path) return null;
        const pageName = path.charAt(0).toUpperCase() + path.slice(1);
        return `Dashboard > ${pageName}`;
    };

    return (
        <div className="admin-container">
            {/* Overlay for mobile sidebar */}
            <div
                className={`admin-overlay ${isSidebarOpen ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FaBars />
                        </button>
                        {/* Breadcrumb instead of heading */}
                        {getBreadcrumb() && (
                            <div style={{
                                fontSize: '0.85rem',
                                color: 'var(--admin-text-secondary)',
                                fontWeight: 500
                            }}>
                                {getBreadcrumb()}
                            </div>
                        )}
                    </div>

                    <div className="header-center">
                        <div className="admin-search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search orders, products, users..."
                                className="admin-search-input"
                            />
                        </div>
                    </div>

                    <div className="header-right">
                        {/* Notifications */}
                        <div className="notification-wrapper">
                            <div className="notification-badge">3</div>
                            <FaBell className="header-icon" size={20} />
                        </div>

                        {/* Profile Dropdown */}
                        <div className="profile-wrapper">
                            <div className="profile-info">
                                <div className="profile-name">Admin User</div>
                                <div className="profile-role">Super Admin</div>
                            </div>
                            <div className="profile-avatar">A</div>
                            <FaChevronDown className="chevron-icon" />
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
