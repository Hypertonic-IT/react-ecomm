
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaPen, FaEllipsisH } from 'react-icons/fa';

const RecentOrders = () => {
    const orders = [
        { id: '#ORD-001', customer: 'Alex Johnson', product: 'Oversized Hoodie', amount: '$85.00', status: 'Pending', date: '2 min ago', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random' },
        { id: '#ORD-002', customer: 'Sarah Smith', product: 'Vintage Cargo Pants', amount: '$120.00', status: 'Processing', date: '15 min ago', avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=random' },
        { id: '#ORD-003', customer: 'Michael Brown', product: 'Graphic Tee', amount: '$45.00', status: 'Shipped', date: '1 hour ago', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=random' },
        { id: '#ORD-004', customer: 'Emily Davis', product: 'Denim Jacket', amount: '$95.00', status: 'Delivered', date: '3 hours ago', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random' },
        { id: '#ORD-005', customer: 'Chris Wilson', product: 'Sneakers Pro', amount: '$150.00', status: 'Cancelled', date: '5 hours ago', avatar: 'https://ui-avatars.com/api/?name=Chris+Wilson&background=random' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5' };
            case 'Processing': return { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' };
            case 'Shipped': return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' };
            case 'Delivered': return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' };
            case 'Cancelled': return { bg: '#fef2f2', text: '#b91c1c', border: '#fee2e2' };
            default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
        }
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
                        {orders.map(order => {
                            const statusStyle = getStatusStyle(order.status);
                            return (
                                <tr key={order.id}>
                                    <td style={{ paddingLeft: '24px', fontWeight: '600', color: 'var(--admin-primary)' }}>{order.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={order.avatar} alt="av" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                            <div>
                                                <div style={{ fontWeight: '500', color: 'var(--admin-text)' }}>{order.customer}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{order.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>{order.product}</td>
                                    <td style={{ fontWeight: '600', color: 'var(--admin-text)' }}>{order.amount}</td>
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
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                        <button className="admin-btn-icon" title="Actions">
                                            <FaEllipsisH />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
