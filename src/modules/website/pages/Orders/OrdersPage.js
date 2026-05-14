import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { orderService } from '../../../../services/orderService';
import { FaBoxOpen, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { getImageUrl } from 'config';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getMyOrders();
            if (res.success) {
                setOrders(res.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <TopBar />
            <Header />
            <div style={{ padding: '40px 20px', background: '#f8f9fa', minHeight: '60vh' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '30px', fontWeight: 'bold' }}>My Orders</h1>

                    {loading ? (
                        <p>Loading your orders...</p>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px' }}>
                            <FaBoxOpen style={{ fontSize: '50px', color: '#ccc', marginBottom: '15px' }} />
                            <h3>No orders found</h3>
                            <p style={{ color: '#666', marginBottom: '20px' }}>Looks like you haven't placed any orders yet.</p>
                            <button
                                onClick={() => navigate('/')}
                                style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {orders.map(order => (
                                <div key={order._id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                        <div>
                                            <span style={{ fontWeight: 'bold', color: '#333' }}>Order #{order._id.slice(-6).toUpperCase()}</span>
                                            <div style={{ fontSize: '12px', color: '#888' }}>
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{order.totalPrice}</div>
                                            <span style={{
                                                background: order.isPaid ? '#d4edda' : '#fff3cd',
                                                color: order.isPaid ? '#155724' : '#856404',
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                                            }}>
                                                {order.isPaid ? 'Paid' : 'Pending Payment'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} style={{ position: 'relative', flex: '0 0 60px' }}>
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                                                    title={`${item.name} (x${item.qty})`}
                                                />
                                                <span style={{
                                                    position: 'absolute', bottom: '-8px', right: '-8px',
                                                    background: '#333', color: '#fff', borderRadius: '50%',
                                                    width: '20px', height: '20px', fontSize: '10px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {item.qty}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                                        <div style={{ fontSize: '14px', color: '#555' }}>
                                            <FaClock style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                            Status:
                                            <strong style={{
                                                marginLeft: '8px',
                                                color: order.status === 'Delivered' ? '#10b981' : '#f59e0b',
                                                textTransform: 'uppercase',
                                                fontSize: '12px'
                                            }}>
                                                {order.status || (order.isDelivered ? 'Delivered' : 'Pending')}
                                            </strong>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#555' }}>
                                            <FaMoneyBillWave style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                            Method: <strong>{order.paymentMethod}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrdersPage;
