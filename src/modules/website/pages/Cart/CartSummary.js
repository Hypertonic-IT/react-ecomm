
import React, { useState } from 'react';
import { FaCheck, FaLock, FaUndo, FaTruck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../context/AuthContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ cart }) => {
    const [couponCode, setCouponCode] = useState('');
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { formatPrice } = useCurrency();
    const { getCartTotal, appliedCoupon, applyCoupon, removeCoupon } = useShop();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 15;
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal + shipping - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        await applyCoupon(couponCode, user?.id);
    };

    return (
        <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "highlight-green" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
            </div>

            {appliedCoupon && (
                <div className="summary-row highlight-green">
                    <span>Discount ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : 'Flat'})</span>
                    <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
            )}

            <div className="summary-row total">
                <span>Total Payable</span>
                <span>{formatPrice(total)}</span>
            </div>

            <button className="checkout-btn" onClick={() => {
                if (isAuthenticated) {
                    navigate('/checkout/address');
                } else {
                    navigate('/login', { state: { from: '/checkout/address' } });
                }
            }}>
                Proceed to Checkout
            </button>

            <div className="coupon-section">
                {!isCouponOpen && !appliedCoupon ? (
                    <div className="coupon-toggle" onClick={() => setIsCouponOpen(true)}>
                        Have a coupon?
                    </div>
                ) : appliedCoupon ? (
                    <div className="applied-coupon-box" style={{ padding: '10px', background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#276749', fontSize: '14px', fontWeight: 'bold' }}>
                            <FaCheck /> {appliedCoupon.code}
                        </div>
                        <button
                            onClick={removeCoupon}
                            style={{ background: 'transparent', border: 'none', color: '#c53030', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="coupon-form">
                        <input
                            type="text"
                            className="coupon-input"
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="coupon-apply" onClick={handleApplyCoupon}>Apply</button>
                        <button
                            className="coupon-cancel"
                            onClick={() => setIsCouponOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '10px', marginLeft: '5px' }}
                        >
                            Cancel
                        </button>
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
