
import React from 'react';
import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import './TrustSection.css';

const TrustSection = () => {
    const features = [
        { icon: <FaTruck />, title: 'Free Shipping', desc: 'On orders over $99' },
        { icon: <FaUndo />, title: 'Easy Returns', desc: '7-day return policy' },
        { icon: <FaShieldAlt />, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: <FaHeadset />, title: '24/7 Support', desc: 'Dedicated support team' }
    ];

    return (
        <section className="trust-section">
            <div className="trust-container">
                {features.map((f, i) => (
                    <div key={i} className="trust-item">
                        <div className="trust-icon">{f.icon}</div>
                        <div className="trust-title">{f.title}</div>
                        <div className="trust-desc">{f.desc}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrustSection;
