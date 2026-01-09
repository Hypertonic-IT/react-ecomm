
import React, { useState } from 'react';
import { FaCheck, FaLock, FaUndo, FaTruck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CartSummary = ({ cart }) => {
    const [couponCode, setCouponCode] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% off dummy logic
    const total = subtotal + shipping - discount;

    const handleApplyCoupon = () => {
        if (couponCode.toLowerCase() === 'save10') {
            setAppliedCoupon('SAVE10');
            // Show success animation/toast here ideally
        }
    };

    return (
        <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "highlight-green" : ""}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
            </div>

            {appliedCoupon && (
                <div className="summary-row highlight-green">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                </div>
            )}

            <div className="summary-row total">
                <span>Total Payable</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn">
                Proceed to Checkout
            </button>

            <div className="coupon-section">
                {!isCouponOpen ? (
                    <div className="coupon-toggle" onClick={() => setIsCouponOpen(true)}>
                        Have a coupon?
                    </div>
                ) : (
                    <div className="coupon-form">
                        <input
                            type="text"
                            className="coupon-input"
                            placeholder="Enter code (Try SAVE10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="coupon-apply" onClick={handleApplyCoupon}>Apply</button>
                    </div>
                )}
                {appliedCoupon && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#27ae60', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaCheck /> Coupon applied successfully!
                    </div>
                )}
            </div>

            <div className="trust-signals">
                <div className="trust-badge">
                    <FaLock />
                    <span>Secure</span>
                </div>
                <div className="trust-badge">
                    <FaUndo />
                    <span>Returns</span>
                </div>
                <div className="trust-badge">
                    <FaTruck />
                    <span>Fast Del.</span>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
