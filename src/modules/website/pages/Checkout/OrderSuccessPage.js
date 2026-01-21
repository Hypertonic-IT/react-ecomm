
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AddressPage.css'; // Reuse styles

const OrderSuccessPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="address-page">
            <TopBar />
            <Header />

            <div className="checkout-container" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }}>
                    <FaCheckCircle style={{ fontSize: '60px', color: '#27ae60', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Order Placed Successfully!</h1>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                        Thank you for your purchase. Your order has been placed.
                    </p>
                    <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '30px', display: 'inline-block' }}>
                        <strong>Order ID:</strong> <span style={{ fontFamily: 'monospace' }}>{id}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/orders')} className="proceed-btn" style={{ width: 'auto', padding: '0 30px' }}>
                            <FaShoppingBag style={{ marginRight: '8px' }} /> View Orders
                        </button>
                        <button onClick={() => navigate('/')} className="proceed-btn" style={{ width: 'auto', padding: '0 30px', background: '#333' }}>
                            <FaHome style={{ marginRight: '8px' }} /> Return Home
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderSuccessPage;
