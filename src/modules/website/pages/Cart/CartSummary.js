
import React, { useState } from 'react';
import { FaCheck, FaLock, FaUndo, FaTruck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../context/AuthContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { useShop } from '../../../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import AvailableCoupons from '../../components/Coupon/AvailableCoupons';

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
    const total = Math.max(0, subtotal + shipping - discount);

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

            <div className="coupon-section-modern">
                <h4 className="coupon-header-title">Offers & Benefits</h4>

                {appliedCoupon ? (
                    <div className="applied-coupon-success">
                        <div className="applied-left">
                            <span className="coupon-tag-applied"><FaCheck size={10} /> {appliedCoupon.code}</span>
                            <span className="saved-amount">Saved {formatPrice(appliedCoupon.discount)}</span>
                        </div>
                        <button className="remove-coupon-btn" onClick={removeCoupon}>
                            <FaUndo size={12} style={{ marginRight: '2px' }} /> Remove
                        </button>
                    </div>
                ) : (
                    <div className="coupon-input-wrapper">
                        <div className="input-icon"><FaCheck size={10} color="#000" /></div>
                        <input
                            type="text"
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        {couponCode && (
                            <button className="apply-text-btn" onClick={handleApplyCoupon}>APPLY</button>
                        )}
                    </div>
                )}

                {/* Available Offers List */}
                <AvailableCoupons onApply={(code) => applyCoupon(code, user?.id)} />
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
