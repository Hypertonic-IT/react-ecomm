
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaBox, FaUserPlus, FaFileAlt, FaArrowRight } from 'react-icons/fa';
import DashboardStats from '../../components/DashboardStats';
import RecentOrders from '../../components/RecentOrders';
import AdminSelect from '../../components/AdminSelect';
import { useAdminAuth } from '../../../../context/AdminAuthContext';

const Dashboard = () => {
    const [chartRange, setChartRange] = useState('This Week'); // Added state
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        statusStats: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        }
    });

    const { user } = useAdminAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminAuthToken');
                const response = await fetch('http://localhost:5001/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '')
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, [user]);

    return (
        <div className="admin-dashboard animate-fade-in">
            {/* 1. Header Section */}
            <div style={{ marginBottom: '32px' }}>
                <h2 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Overview</h2>
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '1rem' }}>Welcome back, here's what's happening with your store today.</p>
            </div>

            {/* 2. Key Metrics Cards (Top Row) */}
            <DashboardStats stats={stats} />

            {/* 3. Main Content Grid (Chart + Side Panel) */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '30px' }}>

                {/* Left: Sales Chart / Primary Content */}
                <div className="stat-card-premium" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
                    <div className="stat-header" style={{ marginBottom: '32px' }}>
                        <div>
                            <h3 className="stat-label" style={{ fontSize: '1.1rem', color: 'var(--admin-text)', marginBottom: '4px' }}>Sales Analytics</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>Revenue trends for the past 7 days</p>
                        </div>
                        <div style={{ width: '130px' }}>
                            <AdminSelect
                                options={[{ value: 'This Week', label: 'This Week' }, { value: 'This Month', label: 'This Month' }]}
                                value={chartRange}
                                onChange={setChartRange}
                                styles={{ control: (base) => ({ ...base, minHeight: '32px', fontSize: '13px' }) }}
                                isSearchable={false}
                            />
                        </div>
                    </div>
                    {/* Clean Chart Placeholder */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px' }}>
                        {[35, 55, 40, 70, 50, 85, 65].map((h, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '10%' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${h * 3.2}px`,
                                    backgroundColor: i === 6 ? 'var(--admin-primary)' : '#e2e8f0',
                                    borderRadius: '8px', /* Rounded bars */
                                    transition: 'height 0.5s ease',
                                    opacity: i === 6 ? 1 : 0.7
                                }}></div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Order Status "Donut" Summary */}
                <div className="stat-card-premium" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="stat-label" style={{ fontSize: '1.1rem', color: 'var(--admin-text)', marginBottom: '24px' }}>Order Status</h3>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <StatusRow label="Pending" count={stats.statusStats.pending} color="var(--admin-warning)" />
                        <StatusRow label="Processing" count={stats.statusStats.processing} color="var(--admin-primary)" />
                        <StatusRow label="Shipped" count={stats.statusStats.shipped} color="#8b5cf6" />
                        <StatusRow label="Delivered" count={stats.statusStats.delivered} color="var(--admin-success)" />
                        <StatusRow label="Cancelled" count={stats.statusStats.cancelled} color="var(--admin-danger)" />
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--admin-border)' }}>
                        <Link to="/admin/orders" className="admin-link">
                            Go to Orders <FaArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4. Recent Orders Table (Full Width) */}
            <div style={{ marginBottom: '30px' }}>
                <RecentOrders />
            </div>

            {/* 5. Quick Actions - Cleaner Row */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <QuickActionCard icon={FaPlus} label="Add Product" link="/admin/products/new" color="#2563eb" />
                <QuickActionCard icon={FaBox} label="Manage Orders" link="/admin/orders" color="#8b5cf6" />
                <QuickActionCard icon={FaUserPlus} label="Add Customer" link="/admin/users" color="#10b981" />
                <QuickActionCard icon={FaFileAlt} label="Reports" link="/admin/reports" color="#f59e0b" />
            </div>
        </div>
    );
};

// Helper Components
const StatusRow = ({ label, count, color }) => (
    <div className="status-list-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 0 2px ${color}20` }}></span>
            <span style={{ color: 'var(--admin-text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>{label}</span>
        </div>
        <span style={{ fontWeight: '700', color: 'var(--admin-text)' }}>{count}</span>
    </div>
);

const QuickActionCard = ({ icon: Icon, label, link, color }) => (
    <a href={link} className="stat-card-premium" style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        cursor: 'pointer',
        justifyContent: 'flex-start'
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            transition: 'transform 0.2s'
        }}>
            <Icon />
        </div>
        <span style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '1rem' }}>{label}</span>
    </a>
);

export default Dashboard;
