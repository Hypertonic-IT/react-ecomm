import React, { useState, useEffect } from 'react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination'; // Added
import '../../admin.css';
import { API_BASE_URL, BASE_URL } from 'config';

const OrderList = () => {
    const { user } = useAdminAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${user ? localStorage.getItem('adminAuthToken') : ''}`,
                    'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '')
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
            const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user ? localStorage.getItem('adminAuthToken') : ''}`,
                    'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '')
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

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
        <div className="admin-page-container fade-in">
            <div className="table-container">
                {/* Standardized Toolbar */}
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <AdminSelect
                            options={[
                                { value: 10, label: '10' },
                                { value: 25, label: '25' },
                                { value: 50, label: '50' }
                            ]}
                            value={entriesPerPage}
                            onChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
                            styles={{
                                control: (base) => ({ ...base, minHeight: '32px', width: '70px', fontSize: '12px' })
                            }}
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <div style={{ width: '200px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'All', label: 'All Statuses' },
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Processing', label: 'Processing (Accepted)' },
                                    { value: 'Packed', label: 'Packed' },
                                    { value: 'Shipped', label: 'Shipped' },
                                    { value: 'Out for Delivery', label: 'Out For Delivery' },
                                    { value: 'Delivered', label: 'Completed (Delivered)' },
                                    { value: 'Cancelled', label: 'Cancelled' }
                                ]}
                                value={filterStatus}
                                onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
                                placeholder="Filter Status"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading orders...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.length > 0 ? currentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>
                                            <Link to={`/admin/orders/${order._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                #{order._id.substring(0, 8)}
                                            </Link>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '600', color: 'var(--admin-text)' }}>{order.shippingAddress?.fullName || order.user?.name || 'Guest'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{order.user?.emailOrMobile}</div>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ fontWeight: '700', color: 'var(--admin-text)' }}>
                                            ₹{order.totalPrice?.toFixed(2)}
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
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
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

                                                <div style={{ width: '160px' }}>
                                                    <AdminSelect
                                                        options={[
                                                            { value: 'Pending', label: 'Pending' },
                                                            { value: 'Processing', label: 'Processing' },
                                                            { value: 'Packed', label: 'Packed' },
                                                            { value: 'Shipped', label: 'Shipped' },
                                                            { value: 'Out for Delivery', label: 'Out for Delivery' },
                                                            { value: 'Delivered', label: 'Delivered' },
                                                            { value: 'Cancelled', label: 'Cancelled' }
                                                        ]}
                                                        value={order.status || 'Pending'}
                                                        onChange={(val) => handleStatusChange(order._id, val)}
                                                        placeholder="Status..."
                                                        styles={{
                                                            control: (base) => ({ ...base, fontSize: '11px', minHeight: '30px', padding: '0 4px' })
                                                        }}
                                                        isSearchable={false}
                                                    />
                                                </div>
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
                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredOrders.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderList;
