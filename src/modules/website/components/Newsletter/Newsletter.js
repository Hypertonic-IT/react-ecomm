
import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <h2 className="newsletter-title">Join The Club</h2>
                <p className="newsletter-desc">
                    Subscribe to our newsletter and unlock exclusive access to new arrivals,
                    insider sales, and 10% OFF your first order.
                </p>
                <div className="newsletter-form-wrapper">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="newsletter-email-input"
                    />
                    <button className="newsletter-submit-btn">SUBSCRIBE</button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
