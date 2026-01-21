import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileInfo from './components/ProfileInfo';
import OrdersList from '../Orders/components/OrdersList';
import Wishlist from './components/Wishlist';
import ChangePassword from './components/ChangePassword';
import Overview from './components/Overview';

const ProfilePage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle tab switching logic
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Optional: Update URL without reloading
        // navigate(`/profile?tab=${tabId}`);
    };

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview />;
            case 'profile':
                return <ProfileInfo />;
            case 'orders':
                return (
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ marginBottom: '20px' }}>My Orders</h2>
                        <OrdersList />
                    </div>
                );
            case 'address':
                return (
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h2>My Addresses</h2>
                        <p>Address management coming soon.</p>
                    </div>
                );
            case 'wishlist':
                return <Wishlist />;
            case 'password':
                return <ChangePassword />;
            default:
                return (
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        <p>This section is under development.</p>
                    </div>
                );
        }
    };

    // Quick Hack: If activeTab is 'orders', we might want to actually SHOW the orders.
    // Let's create a simplified Orders List view here if we can.

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <TopBar />
            <Header />

            <div style={{
                maxWidth: '1200px',
                margin: '40px auto',
                padding: '0 20px',
                display: 'flex',
                gap: '30px',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                {/* Left Sidebar */}
                <div style={{ flex: isMobile ? '0 0 100%' : '0 0 300px', maxWidth: '100%', width: '100%' }}>
                    <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} />
                </div>

                {/* Right Content */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    {renderContent()}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProfilePage;
