
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import './Footer.css';

const Footer = () => {
    const { openTrackOrder } = useShop();
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Hypertonic</h4>
                        <p className="footer-text">
                            Premium fashion destination for the modern individual. Quality, Style, and Elegance redefined for you.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-icon"><FaFacebook /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Customer Care</h4>
                        <div className="footer-links">
                            <Link to="/contact" className="footer-link">Contact Us</Link>
                            <a href="#" className="footer-link">Shipping & Returns</a>
                            <a href="#" className="footer-link">FAQ</a>
                            <a href="#" className="footer-link">Size Guide</a>
                            <a href="#" className="footer-link">Size Guide</a>
                            <span
                                className="footer-link"
                                onClick={openTrackOrder}
                                style={{ cursor: 'pointer' }}
                            >
                                Track Order
                            </span>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/about" className="footer-link">Our Story</Link>
                            <Link to="/careers" className="footer-link">Careers</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-link">Terms & Conditions</Link>
                            <a href="#" className="footer-link">Editorial Blog</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Newsletter</h4>
                        <p className="newsletter-text">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                            <button className="newsletter-btn">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div>&copy; {new Date().getFullYear()} Hypertonic. All rights reserved.</div>
                    <div className="payment-icons">
                        <FaCcVisa /> <FaCcMastercard /> <FaCcPaypal />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
