import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { orderService } from '../../../../services/orderService';
import { useCurrency } from '../../../../context/CurrencyContext';
import { FaArrowLeft, FaClock, FaCreditCard, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import { getImageUrl } from 'config';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await orderService.getOrderById(id);
                if (res.success) {
                    setOrder(res.order);
                } else {
                    setError(res.message || 'Order not found');
                }
            } catch (err) {
                console.error("Error loading order details:", err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return (
            <div>
                <TopBar />
                <Header />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b' }}>
                    Loading order details...
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div>
                <TopBar />
                <Header />
                <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
                    <h3 style={{ color: '#ef4444', marginBottom: '20px' }}>{error || 'Order not found'}</h3>
                    <button
                        onClick={() => navigate('/orders')}
                        style={{
                            background: '#000000',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '700'
                        }}
                    >
                        Back to Orders
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <TopBar />
            <Header />

            <div style={{ padding: '50px 20px', background: '#fafafa', minHeight: '70vh' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/orders')} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontWeight: '700',
                            marginBottom: '30px',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaArrowLeft size={12} /> Back to Orders
                    </button>

                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                        overflow: 'hidden'
                    }}>
                        {/* Header Details */}
                        <div style={{
                            padding: '24px 30px',
                            borderBottom: '1px solid #e5e7eb',
                            background: '#000000',
                            color: '#ffffff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '15px'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: '0.8' }}>Order Placement</span>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '4px 0 0 0' }}>Order ID: {order._id}</h2>
                                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginTop: '4px' }}>
                                    Date: {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: '0.8' }}>Status</span>
                                <div style={{
                                    fontSize: '1rem',
                                    fontWeight: '800',
                                    marginTop: '4px',
                                    textTransform: 'uppercase',
                                    color: '#ffffff'
                                }}>
                                    {order.status || (order.isDelivered ? 'Delivered' : 'Pending')}
                                </div>
                            </div>
                        </div>

                        {/* Order info details */}
                        <div style={{
                            padding: '30px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '30px',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            {/* Shipping Information */}
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', textTransform: 'uppercase' }}>
                                    <FaMapMarkerAlt /> Shipping Address
                                </h3>
                                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    <strong>{order.shippingAddress?.fullName || 'N/A'}</strong><br />
                                    {order.shippingAddress?.addressLine1 || order.shippingAddress?.address}<br />
                                    {order.shippingAddress?.addressLine2 && <>{order.shippingAddress?.addressLine2}<br /></>}
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                                    Phone: {order.shippingAddress?.phone || 'N/A'}
                                </p>
                            </div>

                            {/* Payment details */}
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', textTransform: 'uppercase' }}>
                                    <FaCreditCard /> Payment Status
                                </h3>
                                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Method: <strong>{order.paymentMethod || 'Credit/Debit Card'}</strong><br />
                                    Status: <strong style={{
                                        color: order.isPaid ? '#16a34a' : '#ef4444'
                                    }}>
                                        {order.isPaid ? 'Paid' : 'Pending Payment'}
                                    </strong>
                                    {order.paidAt && <><br /><span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Paid on: {new Date(order.paidAt).toLocaleDateString()}</span></>}
                                </p>
                            </div>

                            {/* Summary Metadata */}
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', textTransform: 'uppercase' }}>
                                    <FaFileAlt /> Order Summary
                                </h3>
                                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Total items: {order.orderItems?.reduce((acc, item) => acc + item.qty, 0) || 0}<br />
                                    Logistics Status: <strong style={{ textTransform: 'uppercase' }}>{order.status || 'Pending'}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Items Details */}
                        <div style={{ padding: '30px', borderBottom: '1px solid #e5e7eb' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px', textTransform: 'uppercase' }}>Items Ordered</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {order.orderItems?.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        flexWrap: 'wrap',
                                        borderBottom: index < order.orderItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        paddingBottom: index < order.orderItems.length - 1 ? '20px' : '0'
                                    }}>
                                        <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' }}
                                            />
                                        </div>
                                        <div style={{ flex: '1 1 200px' }}>
                                            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0 0 6px 0' }}>
                                                <Link to={`/product/${item.product || item.id}`} style={{ color: '#000000', textDecoration: 'none' }}>
                                                    {item.name}
                                                </Link>
                                            </h4>
                                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#6b7280' }}>
                                                {item.color && <span>Color: <strong>{item.color}</strong></span>}
                                                {item.size && <span>Size: <strong>{item.size}</strong></span>}
                                                <span>Qty: <strong>{item.qty}</strong></span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', fontWeight: '800', fontSize: '1.05rem' }}>
                                            {formatPrice(item.price)} x {item.qty} = {formatPrice(item.price * item.qty)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Calculations */}
                        <div style={{ padding: '30px', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563' }}>
                                    <span>Subtotal</span>
                                    <span style={{ fontWeight: '600' }}>{formatPrice(order.itemsPrice || (order.totalPrice - order.shippingPrice))}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563' }}>
                                    <span>Shipping</span>
                                    <span style={{ fontWeight: '600' }}>{formatPrice(order.shippingPrice || 0)}</span>
                                </div>
                                {order.discountPrice > 0 && (
                                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#16a34a', fontWeight: '500' }}>
                                         <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                                         <span>-{formatPrice(order.discountPrice)}</span>
                                     </div>
                                 )}
                                {order.taxPrice > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563' }}>
                                        <span>Tax</span>
                                        <span style={{ fontWeight: '600' }}>{formatPrice(order.taxPrice)}</span>
                                    </div>
                                )}
                                <div style={{ height: '1px', background: '#e5e7eb', margin: '6px 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900', color: '#000000' }}>
                                    <span>Grand Total</span>
                                    <span>{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderDetailPage;
