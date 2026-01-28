import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../../../services/orderService';
import { FaBoxOpen, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const OrdersList = () => {
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

    if (loading) return <p>Loading your orders...</p>;

    if (orders.length === 0) {
        return (
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
        );
    }

    return (
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
                                    src={item.image}
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
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            backgroundColor:
                                order.isDelivered ? '#d1e7dd' :
                                    order.status === 'Cancelled' ? '#f8d7da' :
                                        '#fff3cd',
                            color:
                                order.isDelivered ? '#0f5132' :
                                    order.status === 'Cancelled' ? '#842029' :
                                        '#664d03',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <FaClock />
                            {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                        </span>
                        <div style={{ fontSize: '14px', color: '#555' }}>
                            <FaMoneyBillWave style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                            Method: <strong>{order.paymentMethod}</strong>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersList;
