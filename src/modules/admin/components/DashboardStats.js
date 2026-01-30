
import React from 'react';
import { FaDollarSign, FaShoppingBag, FaUsers, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';

/**
 * Updated for Light Theme Compatibility
 * Removed hardcoded 'white' texts where unnecessary.
 */
const StatCard = ({ title, value, change, isPositive, icon: Icon, color }) => {
    return (
        <div className="stat-card-premium" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="stat-header">
                <div>
                    <h3 className="stat-label">{title}</h3>
                    <div className="stat-value">{value}</div>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
                    <Icon />
                </div>
            </div>

            <div className="stat-trend" style={{ opacity: 0.9 }}>
                {isPositive ? (
                    <span className="trend-up" style={{ color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '0.85rem' }}>
                        <FaArrowUp size={10} /> {change}%
                    </span>
                ) : (
                    <span className="trend-down" style={{ color: 'var(--admin-danger)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '0.85rem' }}>
                        <FaArrowDown size={10} /> {change}%
                    </span>
                )}
                <span style={{ color: 'var(--admin-text-muted)', marginLeft: '6px', fontSize: '0.8rem' }}>vs last month</span>
            </div>
        </div>
    );
};

const DashboardStats = ({ stats }) => {
    // Default values if no stats provided
    const data = stats || {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0
    };

    return (
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '30px' }}>
            <StatCard
                title="Total Revenue"
                value={`₹${data.totalRevenue?.toFixed(2) || '0.00'}`}
                change="12.5"
                isPositive={true}
                icon={FaDollarSign}
                color="#10b981"
            />
            <StatCard
                title="Total Orders"
                value={data.totalOrders}
                change="8.2"
                isPositive={true}
                icon={FaShoppingBag}
                color="#3b82f6"
            />
            <StatCard
                title="Total Customers"
                value={data.totalCustomers}
                change="2.4"
                isPositive={true}
                icon={FaUsers}
                color="#8b5cf6"
            />
            <StatCard
                title="Total Products"
                value={data.totalProducts || 0}
                change="4.1"
                isPositive={true}
                icon={FaChartLine}
                color="#f59e0b"
            />
        </div>
    );
};

export default DashboardStats;
