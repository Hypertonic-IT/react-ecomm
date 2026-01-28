import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPrint, FaTruck, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAdminAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
                    headers: {
                        'user-id': user?.email
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Handle wrapped response { success: true, order: ... }
                    setOrder(data.order || data);
                } else {
                    console.error("Failed to fetch order details");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id, user]);

    if (loading) return <div className="admin-page-container">Loading...</div>;
    if (!order) return <div className="admin-page-container">Order not found</div>;

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ marginBottom: '20px' }}>
                <Link to="/admin/orders" className="admin-btn-secondary">
                    <FaArrowLeft /> Back to Orders
                </Link>
                <button className="admin-btn-primary" onClick={() => window.print()}>
                    <FaPrint /> Print Order
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Order Items */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
                        <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: '700' }}>Order Items</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.orderItems || []).map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', overflow: 'hidden', borderRadius: '8px',
                                                border: '1px solid var(--admin-border)', flexShrink: 0
                                            }}>
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <Link to={`/admin/products/edit/${item.product}`} style={{ fontWeight: '600', color: 'var(--admin-text)', textDecoration: 'none' }}>
                                                    {item.name}
                                                </Link>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>ID: {item.product}</div>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>${item.price.toFixed(2)}</td>
                                        <td>{item.qty}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '600' }}>${(item.price * item.qty).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', color: 'var(--admin-text-secondary)', paddingTop: '20px' }}>Subtotal:</td>
                                    <td style={{ paddingTop: '20px', textAlign: 'right', fontWeight: '600' }}>${order.itemsPrice?.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', color: 'var(--admin-text-secondary)' }}>Shipping:</td>
                                    <td style={{ textAlign: 'right', fontWeight: '600' }}>${order.shippingPrice?.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', color: 'var(--admin-text-secondary)' }}>Tax:</td>
                                    <td style={{ textAlign: 'right', fontWeight: '600' }}>${order.taxPrice?.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: '700', fontSize: '1.2rem', color: 'var(--admin-text)', paddingTop: '10px' }}>Total Amount:</td>
                                    <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '1.2rem', color: 'var(--admin-primary)', paddingTop: '10px' }}>${order.totalPrice?.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Order Status */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
                        <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: '700' }}>Order Timeline</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '10px' }}>
                            {/* Vertical Line */}
                            <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', position: 'relative', zIndex: 1, paddingBottom: '25px' }}>
                                <div style={{
                                    width: '12px', height: '12px', borderRadius: '50%', background: '#10b981',
                                    boxShadow: '0 0 0 4px #d1fae5', marginTop: '5px'
                                }}></div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Order Placed</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleString()}</div>
                                </div>
                            </div>

                            {order.isPaid && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', position: 'relative', zIndex: 1, paddingBottom: order.isDelivered ? '25px' : '0' }}>
                                    <div style={{
                                        width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6',
                                        boxShadow: '0 0 0 4px #dbeafe', marginTop: '5px'
                                    }}></div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Payment Confirmed</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>{order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Date not recorded'}</div>
                                    </div>
                                </div>
                            )}

                            {order.isDelivered && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: '12px', height: '12px', borderRadius: '50%', background: '#10b981',
                                        boxShadow: '0 0 0 4px #d1fae5', marginTop: '5px'
                                    }}></div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Delivered</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Date not recorded'}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Customer Info */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--admin-border)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)' }}>
                                <FaUser size={18} />
                            </div>
                            <h3 className="card-title" style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Customer</h3>
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{order.user?.name || 'Guest User'}</div>
                            <div style={{ color: 'var(--admin-text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.9rem' }}>{order.user?.email || 'No email provided'}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                                ID: {order.user?._id || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--admin-border)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <FaMapMarkerAlt size={18} />
                            </div>
                            <h3 className="card-title" style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Shipping Address</h3>
                        </div>
                        <address style={{ fontStyle: 'normal', lineHeight: '1.6', color: 'var(--admin-text-secondary)', fontSize: '0.95rem' }}>
                            <strong style={{ color: 'var(--admin-text)', display: 'block', marginBottom: '4px' }}>{order.shippingAddress?.fullName}</strong>
                            {order.shippingAddress?.address}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                            {order.shippingAddress?.country}<br />
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>Tel:</span> {order.shippingAddress?.phoneNumber}
                            </div>
                        </address>
                    </div>

                    {/* Payment Info */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
                        <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '20px', fontWeight: '700' }}>Payment Info</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--admin-text-secondary)' }}>Method</span>
                            <span style={{ fontWeight: '600', background: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{order.paymentMethod}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--admin-text-secondary)' }}>Status</span>
                            <span style={{
                                fontWeight: '700',
                                color: order.isPaid ? '#047857' : '#b91c1c',
                                background: order.isPaid ? '#d1fae5' : '#fecaca',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem'
                            }}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

