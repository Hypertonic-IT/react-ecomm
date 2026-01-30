import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaChartLine, FaShoppingBag, FaBoxOpen, FaUsers,
    FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import ReportFilter from './components/ReportFilter';
import './Reports.css';

const ReportsDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        productsSold: 0,
        totalCustomers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/reports/dashboard');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dynamic Summary Data
    const summaryData = [
        {
            id: 'sales',
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            trend: '+12.5%', // Trend calculation requires historical data, keeping static for now
            isPositive: true,
            icon: <FaChartLine />,
            colorClass: 'color-sales',
            link: '/admin/reports/sales'
        },
        {
            id: 'orders',
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            trend: '+8.2%',
            isPositive: true,
            icon: <FaShoppingBag />,
            colorClass: 'color-orders',
            link: '/admin/reports/orders'
        },
        {
            id: 'products',
            title: 'Products Sold',
            value: stats.productsSold.toLocaleString(),
            trend: '-2.1%',
            isPositive: false,
            icon: <FaBoxOpen />,
            colorClass: 'color-products',
            link: '/admin/reports/products'
        },
        {
            id: 'customers',
            title: 'Total Customers',
            value: stats.totalCustomers.toLocaleString(),
            trend: '+5.4%',
            isPositive: true,
            icon: <FaUsers />,
            colorClass: 'color-customers',
            link: '/admin/reports/customers'
        }
    ];

    const handleFilterChange = (filters) => {
        console.log('Dashboard Filters Applied:', filters);
        // Future: Fetch stats with date filtering params
    };

    if (loading) {
        return <div className="reports-container"><div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Reports...</div></div>;
    }

    return (
        <div className="reports-container fade-in">
            <div className="reports-header">
                <h1 className="reports-title">Reports & Analytics</h1>
                <p className="reports-subtitle">Track business performance and insights</p>
            </div>

            <ReportFilter onFilterChange={handleFilterChange} showProductFilters={false} />

            <div className="summary-cards-grid">
                {summaryData.map((card) => (
                    <div
                        key={card.id}
                        className={`report-card ${card.colorClass}`}
                        onClick={() => navigate(card.link)}
                    >
                        <div className="card-icon-wrapper">
                            {card.icon}
                        </div>
                        <div className="card-label">{card.title}</div>
                        <div className="card-value">{card.value}</div>
                        <div className={`card-trend ${card.isPositive ? 'trend-up' : 'trend-down'}`}>
                            {card.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                            {card.trend} vs last period
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for a quick chart view if needed later */}
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Revenue Overview (Last 30 Days)</h3>
                </div>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    Select "Sales Reports" for detailed analytics
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
