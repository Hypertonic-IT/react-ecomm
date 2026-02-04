import React from 'react';
import { FaLock } from 'react-icons/fa';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-layout">
            {/* Left Side - Brand Image */}
            <div className="auth-brand-side">
                <div className="brand-image-container">
                    <img
                        src="https://images.pexels.com/photos/3489129/pexels-photo-3489129.jpeg"
                        alt="Fashion Brand"
                        className="brand-image"
                        style={{ opacity: 1 }}
                    />
                </div>
                <div className="brand-overlay">
                    <h1 className="brand-title" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.7)', fontWeight: '800', color: '#ffffff' }}>HYPERTONIC</h1>
                    <p className="brand-tagline" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.6)', color: '#ffffff' }}>Elevate Your Style</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-side">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2 className="auth-title">{title}</h2>
                        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                    </div>

                    <div className="auth-content">
                        {children}
                    </div>

                    <div className="auth-footer">
                        <div className="trust-indicator">
                            <FaLock />
                            <span>Your information is secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
