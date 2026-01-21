import React, { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa';
import './AuthLayout.css';

const brandImages = [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    'https://images.unsplash.com/photo-1490481651871-646860529625?w=800&q=80'
];

const AuthLayout = ({ children, title, subtitle }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Rotate images every 5 seconds
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % brandImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="auth-layout">
            {/* Left Side - Brand Image */}
            <div className="auth-brand-side">
                <div className="brand-image-container">
                    {brandImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="Fashion Brand"
                            className={`brand-image ${index === currentImageIndex ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <div className="brand-overlay">
                    <h1 className="brand-title">HYPERTONIC</h1>
                    <p className="brand-tagline">Elevate Your Style</p>
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
