import React, { useState } from 'react';
import { FaTimes, FaSearch, FaBoxOpen, FaTruck, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import apiUrl from '../../../../config/api';
import './TrackOrderDrawer.css';

const TrackOrderDrawer = () => {
    const { isTrackOrderOpen, closeTrackOrder } = useShop();
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isTrackOrderOpen) return null; // Don't render if closed (or keep mounted for animation if preferred, but simpler to conditional render or use CSS class)

    // Better: Always render but toggle class for animation
    // But we need closeTrackOrder.

    return (
        <>
            <div className={`track-overlay ${isTrackOrderOpen ? 'active' : ''}`} onClick={closeTrackOrder}></div>
            <div className={`track-drawer ${isTrackOrderOpen ? 'open' : ''}`}>
                <div className="track-header">
                    <h2>Track Your Order</h2>
                    <button className="close-btn" onClick={closeTrackOrder}><FaTimes /></button>
                </div>

                <div className="track-content">
                    {!trackingResult ? (
                        <>
                            <p className="track-desc">Enter your Order ID and Email to see the current status of your shipment.</p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                setError('');
                                setTrackingResult(null);

                                if (!orderId || !email) {
                                    setError('Please enter both Order ID and Email.');
                                    return;
                                }

                                setIsLoading(true);

                                fetch(apiUrl('/api/orders/track'), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ orderId, email })
                                })
                                .then(async (res) => {
                                    const data = await res.json();
                                    setIsLoading(false);
                                    if (res.ok && data.success) {
                                        setTrackingResult(data.order);
                                    } else {
                                        setError(data.message || 'Failed to track order.');
                                    }
                                })
                                .catch((err) => {
                                    console.error("Tracking Error:", err);
                                    setIsLoading(false);
                                    setError('Network error. Please try again.');
                                });
                            }} className="track-form">
                                <div className="form-group">
                                    <label>Order ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. #ORD-12345"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                {error && <div className="error-msg">{error}</div>}
                                <button type="submit" className="track-submit-btn" disabled={isLoading}>
                                    {isLoading ? 'Tracking...' : 'Track Order'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="track-result">
                            <div className="status-card">
                                <div className="status-icon"><FaBoxOpen /></div>
                                <div>
                                    <h3>{trackingResult.status}</h3>
                                    <p>Est. Delivery: {trackingResult.estimatedDelivery}</p>
                                </div>
                            </div>

                            <div className="timeline">
                                {trackingResult.timeline.map((step, index) => (
                                    <div key={index} className={`timeline-step ${step.active ? 'active' : ''}`}>
                                        <div className="step-marker"></div>
                                        <div className="step-info">
                                            <h4>{step.status}</h4>
                                            <p>{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="current-loc">
                                <FaMapMarkerAlt /> Current: {trackingResult.currentLocation}
                            </div>

                            <button className="reset-btn" onClick={() => setTrackingResult(null)}>Track Another Order</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TrackOrderDrawer;
