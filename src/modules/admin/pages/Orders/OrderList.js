import React, { useState, useEffect } from 'react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';

const OrderList = () => {
    const { user } = useAdminAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/orders', {
                headers: {
                    'user-id': user?.email || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        try {
            const res = await fetch(`http://localhost:5001/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh local state without full reload
                setOrders(prev => prev.map(o => {
                    if (o._id === id) {
                        return {
                            ...o,
                            status: newStatus,
                            isDelivered: newStatus === 'Delivered' ? true : o.isDelivered
                        };
                    }
                    return o;
                }));
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating status');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = (order._id && order._id.includes(searchTerm)) ||
            (order.user && order.user.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.shippingAddress && order.shippingAddress.fullName && order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = filterStatus === 'All' ||
            (order.status === filterStatus) ||
            (filterStatus === 'Pending' && !order.status) || // Handle legacy/empty status as Pending
            (filterStatus === 'Delivered' && order.isDelivered && !order.status); // Handle legacy delivered

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="admin-page-container fade-in">
            <div className="table-container">
                <div className="table-toolbar">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--admin-border)',
                                outline: 'none',
                                background: '#fff',
                                color: 'var(--admin-text)',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing (Accepted)</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out For Delivery</option>
                            <option value="Delivered">Completed (Delivered)</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading orders...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>
                                        <Link to={`/admin/orders/${order._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            #{order._id.substring(0, 8)}
                                        </Link>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600', color: 'var(--admin-text)' }}>{order.shippingAddress?.fullName || order.user?.name || 'Guest'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{order.user?.email}</div>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ fontWeight: '700', color: 'var(--admin-text)' }}>
                                        ${order.totalPrice?.toFixed(2)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className={`stock-indicator stock-${order.isPaid ? 'in' : 'out'}`}></span>
                                            <span className={`status-badge ${order.isPaid ? 'status-success' : 'status-danger'}`}>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className={`stock-indicator stock-${order.status === 'Delivered' ? 'in' :
                                                order.status === 'Cancelled' ? 'out' : 'low'
                                                }`}></span>
                                            <span className={`status-badge ${order.status === 'Delivered' ? 'status-success' :
                                                order.status === 'Shipped' || order.status === 'Out for Delivery' ? 'status-primary' :
                                                    order.status === 'Cancelled' ? 'status-danger' :
                                                        'status-warning'
                                                }`}>
                                                {order.status || (order.isDelivered ? 'Delivered' : 'Pending')}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="admin-btn-icon"
                                                title="View Details"
                                                style={{
                                                    border: '1px solid var(--admin-primary)',
                                                    background: 'rgba(59, 130, 246, 0.05)',
                                                    color: 'var(--admin-primary)',
                                                    padding: '0 12px',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    height: '32px',
                                                    width: 'auto'
                                                }}
                                            >
                                                <FaEye size={14} /> <span>View</span>
                                            </Link>

                                            <select
                                                className="admin-select-action"
                                                style={{
                                                    padding: '6px 10px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'white',
                                                    outline: 'none',
                                                    color: 'var(--admin-text)',
                                                    maxWidth: '130px'
                                                }}
                                                value=""
                                                onChange={(e) => {
                                                    if (e.target.value) handleStatusChange(order._id, e.target.value);
                                                }}
                                            >
                                                <option value="" disabled>Status Actions...</option>

                                                {/* 1. Pending Options */}
                                                {(order.status === 'Pending' || !order.status) && (
                                                    <>
                                                        <option value="Processing">Accept Order</option>
                                                        <option value="On Hold">Put On Hold</option>
                                                        <option value="Cancelled">Cancel Order</option>
                                                    </>
                                                )}

                                                {/* 2. Processing Options */}
                                                {order.status === 'Processing' && (
                                                    <>
                                                        <option value="Packed">Mark as Packed</option>
                                                        <option value="On Hold">Put On Hold</option>
                                                        <option value="Cancelled">Cancel Order</option>
                                                    </>
                                                )}

                                                {/* 3. Packed Options */}
                                                {order.status === 'Packed' && (
                                                    <>
                                                        <option value="Shipped">Ship Order</option>
                                                        <option value="On Hold">Put On Hold</option>
                                                    </>
                                                )}

                                                {/* 4. Shipped Options */}
                                                {order.status === 'Shipped' && (
                                                    <>
                                                        <option value="Out for Delivery">Mark Out for Delivery</option>
                                                        <option value="Delivered">Mark Delivered</option>
                                                    </>
                                                )}

                                                {/* 4.5 Out for Delivery Options */}
                                                {order.status === 'Out for Delivery' && (
                                                    <>
                                                        <option value="Delivered">Mark Delivered</option>
                                                        <option value="On Hold">Delivery Attempt Failed (Hold)</option>
                                                    </>
                                                )}

                                                {/* 5. Delivered Options */}
                                                {order.status === 'Delivered' && (
                                                    <>
                                                        <option value="Return Requested">Initiate Return</option>
                                                        <option value="Refunded">Process Refund</option>
                                                    </>
                                                )}

                                                {/* 6. On Hold Options */}
                                                {order.status === 'On Hold' && (
                                                    <>
                                                        <option value="Processing">Resume Processing</option>
                                                        <option value="Cancelled">Cancel Order</option>
                                                    </>
                                                )}

                                                {/* 7. Return Requested Options */}
                                                {order.status === 'Return Requested' && (
                                                    <>
                                                        <option value="Refunded">Approve & Refund</option>
                                                        <option value="Delivered">Reject Return</option>
                                                    </>
                                                )}

                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-text-muted)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>No orders found</div>
                                        <p>Try changing your search terms or filters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrderList;
