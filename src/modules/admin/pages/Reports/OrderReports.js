import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUndo, FaSearch } from 'react-icons/fa';
import ReportFilter from './components/ReportFilter';
import './Reports.css';
import { API_BASE_URL, BASE_URL } from '../../../../../config';

const OrderReports = () => {
    const [stats, setStats] = useState({
        delivered: 0,
        cancelled: 0,
        returned: 0
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderStats();
    }, []);

    const fetchOrderStats = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/reports/orders`);
            const data = await response.json();
            if (data.success) {
                setStats(data.data.stats);
                setOrders(data.data.orders);
            }
        } catch (error) {
            console.error('Error fetching order stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const summaryCards = [
        {
            title: 'Delivered Orders',
            value: stats.delivered,
            icon: <FaCheckCircle />,
            colorClass: 'color-orders', // Green
            trend: 'Completed'
        },
        {
            title: 'Cancelled Orders',
            value: stats.cancelled,
            icon: <FaTimesCircle />,
            colorClass: 'color-danger', // Red
            trend: 'Rate: ' + ((stats.cancelled / (stats.total || 1)) * 100).toFixed(1) + '%'
        },
        {
            title: 'Returned Orders',
            value: stats.returned,
            icon: <FaUndo />,
            colorClass: 'color-products', // Orange
            trend: 'Processing'
        }
    ];

    if (loading) {
        return <div className="reports-container"><div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Order Reports...</div></div>;
    }

    return (
        <div className="reports-container fade-in">
            <div className="reports-header">
                <h1 className="reports-title">Order Reports</h1>
                <p className="reports-subtitle">Track order status, cancellations, and returns</p>
            </div>

            <ReportFilter />

            {/* Application has specific styles for grid, reusing them */}
            <div className="summary-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {summaryCards.map((card, index) => (
                    <div key={index} className={`report-card ${card.colorClass}`}>
                        <div className="card-icon-wrapper">
                            {card.icon}
                        </div>
                        <div className="card-label">{card.title}</div>
                        <div className="card-value">{card.value}</div>
                        <div className="card-trend">{card.trend}</div>
                    </div>
                ))}
            </div>

            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Recent Orders</h3>
                    {/* Optional Search */}
                </div>
                <div className="report-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontWeight: '600', color: '#3b82f6' }}>#{order._id.substring(0, 8).toUpperCase()}</td>
                                    <td>
                                        <div>{order.user?.name || 'Guest'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.user?.email || order.email}</div>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{order.orderItems.length} items</td>
                                    <td style={{ fontWeight: '700' }}>₹{order.totalPrice.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderReports;
