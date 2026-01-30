
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaPen, FaEllipsisH } from 'react-icons/fa';

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/orders');
            if (response.ok) {
                const data = await response.json();
                // Get the 5 most recent orders
                const recentOrders = data.slice(0, 5);
                setOrders(recentOrders);
            }
        } catch (error) {
            console.error("Error fetching recent orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5' };
            case 'Processing': return { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' };
            case 'Packed': return { bg: '#f0f9ff', text: '#0369a1', border: '#e0f2fe' };
            case 'Shipped': return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' };
            case 'Out for Delivery': return { bg: '#fefce8', text: '#a16207', border: '#fef9c3' };
            case 'Delivered': return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' };
            case 'Cancelled': return { bg: '#fef2f2', text: '#b91c1c', border: '#fee2e2' };
            default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const orderDate = new Date(date);
        const diffMs = now - orderDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getFirstProductName = (orderItems) => {
        if (!orderItems || orderItems.length === 0) return 'N/A';
        const firstItem = orderItems[0];
        if (orderItems.length > 1) {
            return `${firstItem.name} +${orderItems.length - 1} more`;
        }
        return firstItem.name;
    };

    return (
        <div className="stat-card-premium" style={{ height: 'auto', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="stat-label" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--admin-text)' }}>Recent Orders</h3>
                <Link to="/admin/orders" className="admin-link" style={{ fontSize: '0.85rem' }}>View All Orders</Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ paddingLeft: '24px' }}>Order ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                                    Loading orders...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                                    No orders yet
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => {
                                const statusStyle = getStatusStyle(order.status || 'Pending');
                                const customerName = order.shippingAddress?.fullName || order.user?.name || 'Guest';
                                const customerEmail = order.user?.email || '';

                                return (
                                    <tr key={order._id}>
                                        <td style={{ paddingLeft: '24px', fontWeight: '600', color: 'var(--admin-primary)' }}>
                                            <Link to={`/admin/orders/${order._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                #{order._id.substring(0, 8)}
                                            </Link>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=random`}
                                                    alt="avatar"
                                                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: '500', color: 'var(--admin-text)' }}>{customerName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                                                        {getTimeAgo(order.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {getFirstProductName(order.orderItems)}
                                        </td>
                                        <td style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                                            ${order.totalPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td>
                                            <span style={{
                                                background: statusStyle.bg,
                                                color: statusStyle.text,
                                                border: `1px solid ${statusStyle.border}`,
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                display: 'inline-block'
                                            }}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="admin-btn-icon"
                                                title="View Order"
                                            >
                                                <FaEye />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
