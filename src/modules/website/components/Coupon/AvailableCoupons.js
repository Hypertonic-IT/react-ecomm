import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { API_BASE_URL, BASE_URL } from '../../../../../config';

const AvailableCoupons = ({ onApply, coupons: propCoupons }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (propCoupons) {
            setCoupons(propCoupons);
            setLoading(false);
            return;
        }

        const fetchCoupons = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/coupons/active`);
                if (res.ok) {
                    const data = await res.json();
                    setCoupons(data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch coupons", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, [propCoupons]);

    if (loading) return <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>Loading offers...</div>;
    if (coupons.length === 0) return null;

    const visibleCoupons = showAll ? coupons : coupons.slice(0, 2);

    return (
        <div className="available-offers-container">
            <h5 className="offers-title">Available Offers</h5>
            <div className="offers-list">
                {visibleCoupons.map(coupon => (
                    <div key={coupon._id} className="offer-card">
                        <div className="offer-row-top">
                            <span className="offer-code-badge">{coupon.code}</span>
                            <button className="offer-apply-btn" onClick={() => onApply(coupon.code)}>APPLY</button>
                        </div>
                        <div className="offer-desc">
                            {coupon.name}
                        </div>
                        <div className="offer-subtext">
                            {coupon.description || `Get ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue} OFF`}
                        </div>
                    </div>
                ))}
            </div>
            {coupons.length > 2 && (
                <button className="view-all-offers-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : `View All Offers >`}
                </button>
            )}
        </div>
    );
};

export default AvailableCoupons;
