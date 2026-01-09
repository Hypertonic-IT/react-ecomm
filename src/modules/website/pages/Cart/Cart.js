
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Newsletter from '../../components/Newsletter/Newsletter';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import { useShop } from '../../../../context/ShopContext';
import { FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const { cart, products } = useShop();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate "Soft fade-in" loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="cart-page">
                <TopBar />
                <Header />
                <div className="loading-screen">
                    <div className="loader"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cart-page">
            <TopBar />
            <Header />

            <div className="cart-container">
                <div className="cart-header">
                    <div className="cart-title">Your Cart</div>
                    {/* Stepper */}
                    <div className="cart-stepper">
                        <div className="step active">
                            <div className="step-icon"><FaShoppingCart /></div>
                            <span>Cart</span>
                        </div>
                        <div className="step">
                            <div className="step-icon"><FaMapMarkerAlt /></div>
                            <span>Address</span>
                        </div>
                        <div className="step">
                            <div className="step-icon"><FaCreditCard /></div>
                            <span>Payment</span>
                        </div>
                        <div className="step">
                            <div className="step-icon"><FaCheckCircle /></div>
                            <span>Done</span>
                        </div>
                    </div>
                </div>

                {cart.length > 0 ? (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <CartItem key={`${item.id}-${index}`} item={item} />
                            ))}
                        </div>

                        <div className="cart-sidebar">
                            <CartSummary cart={cart} />
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <div className="empty-icon"><FaShoppingBag /></div>
                        <h2 className="empty-title">Your cart is feeling lonely</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            Explore our latest collections and add some style to your wardrobe.
                        </p>
                        <Link to="/products" className="start-shopping-btn">
                            Start Shopping
                        </Link>
                    </div>
                )}


                {/* Recommended Products Slider */}
                <div style={{ marginTop: '60px' }}>
                    <ProductSlider
                        title="You May Also Like"
                        products={products.slice(0, 5)}
                    />
                </div>
            </div>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default Cart;
