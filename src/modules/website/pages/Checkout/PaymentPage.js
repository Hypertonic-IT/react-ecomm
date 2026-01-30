import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../../context/ShopContext';
import { orderService } from '../../../../services/orderService';
import { addressService } from '../../../../services/addressService';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaCheckCircle, FaMapMarkerAlt, FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import './AddressPage.css'; // Reuse CSS

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart, appliedCoupon } = useShop();
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        const selectedAddressId = localStorage.getItem('selectedAddress');

        // Robust Address Fetching
        let shippingAddress = null;
        try {
            const addrRes = await addressService.getAllAddresses();
            if (addrRes.success) {
                const found = addrRes.addresses.find(a => a.id === selectedAddressId);
                if (found) {
                    shippingAddress = {
                        address: found.street,
                        city: found.city,
                        postalCode: found.zip,
                        country: 'India',
                        mobile: found.mobile
                    };
                }
            }
        } catch (e) {
            console.error("Failed to fetch address details", e);
        }

        // Fallback for demo if address fetch failed but we want to allow order (or block it)
        // Blocking if no address is found is safer
        if (!shippingAddress) {
            alert('Error: Could not retrieve shipping address. Please select an address again.');
            setLoading(false);
            navigate('/checkout/address');
            return;
        }

        const subtotal = getCartTotal();
        const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
        const totalPrice = subtotal - discountAmount;

        const orderData = {
            orderItems: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item.id
            })),
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: 0,
            discountPrice: discountAmount,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            totalPrice: totalPrice
        };

        try {
            const res = await orderService.createOrder(orderData);
            if (res.success) {
                clearCart();
                navigate(`/order-success/${res.order._id}`);
            } else {
                alert('Order creation failed: ' + res.message);
            }
        } catch (error) {
            console.error("Order creation error:", error);
            alert('Something went wrong while placing the order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="address-page">
            <TopBar />
            <Header />

            <div className="checkout-container">
                <div className="cart-header">
                    <div className="cart-title">Checkout</div>
                    <div className="cart-stepper">
                        <div className="step visited">
                            <div className="step-icon"><FaShoppingCart /></div>
                            <span>Cart</span>
                        </div>
                        <div className="step visited">
                            <div className="step-icon"><FaMapMarkerAlt /></div>
                            <span>Address</span>
                        </div>
                        <div className="step active">
                            <div className="step-icon"><FaCreditCard /></div>
                            <span>Payment</span>
                        </div>
                        <div className="step">
                            <div className="step-icon"><FaCheckCircle /></div>
                            <span>Done</span>
                        </div>
                    </div>
                </div>

                <div className="payment-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* LEFT COLUMN: Payment Options */}
                    <div className="payment-left" style={{ flex: '1', minWidth: '300px' }}>
                        <div className="section-title" style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Payment Method</div>
                        <div className="payment-content" style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
                            <div className="payment-options">
                                <div
                                    className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('COD')}
                                    style={{
                                        border: paymentMethod === 'COD' ? '2px solid #27ae60' : '1px solid #ddd',
                                        padding: '15px', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    <input type="radio" checked={paymentMethod === 'COD'} readOnly />
                                    <strong>Cash on Delivery</strong>
                                </div>

                                <div
                                    className={`payment-card ${paymentMethod === 'Card' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Card')}
                                    style={{
                                        border: paymentMethod === 'Card' ? '2px solid #27ae60' : '1px solid #ddd',
                                        padding: '15px', borderRadius: '8px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    <input type="radio" checked={paymentMethod === 'Card'} readOnly />
                                    <strong>Credit/Debit Card</strong>
                                </div>
                            </div>

                            <div style={{ marginTop: '30px' }}>
                                <button
                                    className="proceed-btn"
                                    onClick={handlePayment}
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="payment-right" style={{ flex: '0 0 350px', maxWidth: '100%' }}>
                        <div className="section-title" style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Order Summary</div>
                        <div className="order-summary-box" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div className="summary-items" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                                {cart.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity} x ₹{item.price}</div>
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals" style={{ borderTop: '2px solid #f0f0f0', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#27ae60', fontWeight: '500' }}>
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>-₹{appliedCoupon.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Delivery</span>
                                    <span style={{ color: '#27ae60' }}>Free</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span>₹{(getCartTotal() - (appliedCoupon ? appliedCoupon.discount : 0)).toLocaleString()}</span>
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

export default PaymentPage;
