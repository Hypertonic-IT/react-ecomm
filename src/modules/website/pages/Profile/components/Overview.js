import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaSpinner, FaTimesCircle, FaHeart, FaStar, FaEye } from 'react-icons/fa';
import { orderService } from '../../../../../services/orderService';
import { authService } from '../../../../../services/authService';

const Overview = () => {
    const [orders, setOrders] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders
                const ordersRes = await orderService.getMyOrders();
                if (ordersRes.success) {
                    setOrders(ordersRes.orders);
                }

                // Fetch Wishlist
                const wishlist = await authService.getWishlist();
                setWishlistCount(wishlist.length);
            } catch (error) {
                console.error("Error fetching overview data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

    // Calculate Stats
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.isDelivered).length;
    const pendingOrders = orders.filter(o => !o.isDelivered && !o.isPaid).length; // Assuming unpaid and undelivered is pending
    const canceledOrders = 0; // Backend doesn't support 'canceled' status explicitly yet, defaulting 0
    // Mock reviews count for now
    const totalReviews = 0;

    const stats = [
        { id: 1, label: 'Total Order', value: totalOrders, icon: <FaClipboardList />, color: '#2ecc71', bg: '#e8f8f5' },
        { id: 2, label: 'Completed Order', value: completedOrders, icon: <FaCheckCircle />, color: '#3498db', bg: '#eaf2f8' },
        { id: 3, label: 'Pending Order', value: pendingOrders, icon: <FaSpinner />, color: '#f39c12', bg: '#fef9e7' },
        { id: 4, label: 'Canceled Order', value: canceledOrders, icon: <FaTimesCircle />, color: '#e74c3c', bg: '#fdedec' },
        { id: 5, label: 'Total Wishlist', value: wishlistCount, icon: <FaHeart />, color: '#8e44ad', bg: '#f4ecf7' },
        { id: 6, label: 'Total Reviews', value: totalReviews, icon: <FaStar />, color: '#795548', bg: '#efebe9' },
    ];

    // Recent Orders (Top 5)
    const recentOrders = orders.slice(0, 5);

    // Mock Data for Recent Reviews (Since review system doesn't exist yet)
    const recentReviews = [
        // Keeping it empty or static as per request "real data". If no real data, show empty/0.
        // User said: "jo user ka nhi hai use 0 dikha do". So if no reviews, show empty.
    ];

    const getStatusColor = (order) => {
        if (order.isDelivered) return '#2ecc71';
        if (order.isPaid) return '#3498db';
        return '#f39c12'; // Pending
    };

    const getStatusText = (order) => {
        if (order.isDelivered) return 'Delivered';
        if (order.isPaid) return 'Paid / Processing';
        return 'Pending';
    };

    return (
        <div>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {stats.map(stat => (
                    <div key={stat.id} style={{
                        background: '#fff', borderRadius: '8px', padding: '20px',
                        display: 'flex', alignItems: 'center', gap: '15px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '8px',
                            background: stat.color, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                {/* Recent Orders */}
                <div style={{ flex: '1 1 500px', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Your Recent Order</h3>
                    {recentOrders.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', background: '#f8f9fa' }}>
                                        <th style={{ padding: '12px', fontSize: '14px', color: '#333' }}>Order ID</th>
                                        <th style={{ padding: '12px', fontSize: '14px', color: '#333' }}>Date</th>
                                        <th style={{ padding: '12px', fontSize: '14px', color: '#333' }}>Status</th>
                                        <th style={{ padding: '12px', fontSize: '14px', color: '#333' }}>Amount</th>
                                        <th style={{ padding: '12px', fontSize: '14px', color: '#333' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px', color: '#555', fontWeight: '500' }}>#{order._id.substring(0, 8)}...</td>
                                            <td style={{ padding: '12px', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '12px', color: getStatusColor(order), fontWeight: 'bold' }}>{getStatusText(order)}</td>
                                            <td style={{ padding: '12px', color: '#333', fontWeight: 'bold' }}>${order.totalPrice}</td>
                                            <td style={{ padding: '12px' }}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                                                    <FaEye /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#666' }}>No orders found.</p>
                    )}
                </div>

                {/* Recent Reviews */}
                <div style={{ flex: '1 1 300px', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Your Recent Reviews</h3>
                    {recentReviews.length > 0 ? (
                        <div>
                            {recentReviews.map(review => (
                                <div key={review.id} style={{ marginBottom: '20px', borderBottom: '1px dashed #eee', paddingBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{review.product}</h4>
                                        <div style={{ color: '#f39c12', fontSize: '12px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} style={{ color: i < review.rating ? '#f39c12' : '#eee' }} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px' }}>{review.date}</p>
                                    <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#666' }}>No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
