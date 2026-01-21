import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import {
    FaUser, FaShoppingBag,
    FaMapMarkerAlt, FaHeart, FaStar, FaKey, FaSignOutAlt
} from 'react-icons/fa';

const ProfileSidebar = ({ activeTab, onTabChange }) => {
    const { user, logout } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fallback user data provided in image logic
    // Image shows: "Mr. Smith Jhon", "smithjhon@example.com"
    // We use real user data if available
    const userName = user?.name || "Guest User";
    const userEmail = user?.email || "guest@example.com";

    const menuItems = [
        { id: 'dashboard', label: 'DASHBOARD', isHeader: true },
        { id: 'overview', label: 'Overview', icon: <FaUser /> },
        { id: 'orders', label: 'Order', icon: <FaShoppingBag /> },

        { id: 'account', label: 'ACCOUNT SETTINGS', isHeader: true },
        { id: 'profile', label: 'Personal Info', icon: <FaUser /> },
        { id: 'address', label: 'Address', icon: <FaMapMarkerAlt /> },
        { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
        { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
        { id: 'password', label: 'Change Password', icon: <FaKey /> },
    ];

    const themeColor = '#000000'; // Black/White Theme

    return (
        <div style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba0,0,0,0.05)',
            overflow: 'hidden',
            display: isMobile ? 'flex' : 'block',
            flexDirection: 'column',
            width: '100%'
        }}>
            {/* Profile Header */}
            <div style={{
                textAlign: 'center',
                padding: isMobile ? '20px 10px' : '30px 20px',
                borderBottom: '1px solid #eee',
                background: isMobile ? '#fff' : 'transparent'
            }}>
                <div style={{
                    width: isMobile ? '60px' : '80px',
                    height: isMobile ? '60px' : '80px',
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    margin: '0 auto 10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Placeholder image logic */}
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80"
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <h3 style={{ margin: '0 0 5px', fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold' }}>{userName}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{userEmail}</p>
            </div>

            {/* Menu Items */}
            <div style={{
                padding: isMobile ? '0' : '10px 0',
                display: isMobile ? 'flex' : 'block',
                overflowX: isMobile ? 'auto' : 'visible',
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                background: '#fff',
                borderBottom: isMobile ? '1px solid #eee' : 'none',
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                msOverflowStyle: 'none',  // Hide scrollbar for IE/Edge
            }}>
                {/* Hide horizontal scrollbar for Webkit */}
                {isMobile && <style>{`div::-webkit-scrollbar { display: none; }`}</style>}

                {menuItems.map((item, idx) => {
                    // Skip headers on mobile to save space
                    if (isMobile && item.isHeader) return null;

                    if (item.isHeader) {
                        return (
                            <div key={idx} style={{
                                padding: '15px 20px 10px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: themeColor,
                                textTransform: 'uppercase'
                            }}>
                                {item.label}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            style={{
                                padding: isMobile ? '15px 20px' : '12px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                color: activeTab === item.id ? themeColor : '#555',
                                background: activeTab === item.id ? (isMobile ? 'transparent' : '#f4f4f4') : 'transparent',
                                borderLeft: !isMobile ? (activeTab === item.id ? `3px solid ${themeColor}` : '3px solid transparent') : 'none',
                                borderBottom: isMobile ? (activeTab === item.id ? `2px solid ${themeColor}` : '2px solid transparent') : 'none',
                                transition: 'all 0.2s',
                                fontWeight: activeTab === item.id ? 'bold' : 'normal'
                            }}
                        >
                            {!isMobile && <span style={{ fontSize: '16px' }}>{item.icon}</span>}
                            <span style={{ fontSize: '14px' }}>{item.label}</span>
                        </div>
                    );
                })}

                {/* Logout Button */}
                {!isMobile && (
                    <div
                        onClick={logout}
                        style={{
                            padding: '12px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            cursor: 'pointer',
                            color: '#d32f2f',
                            borderLeft: '3px solid transparent'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}><FaSignOutAlt /></span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Logout</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSidebar;
