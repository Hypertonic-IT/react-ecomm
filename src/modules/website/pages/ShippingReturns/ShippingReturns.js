import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';

const ShippingReturns = () => {
    return (
        <div style={{ fontFamily: '"Helvetica Neue", sans-serif', color: '#333' }}>
            <TopBar />
            <Header />

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', lineHeight: '1.8' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>Shipping & Returns</h1>

                <p style={{ marginBottom: '20px' }}>Last Updated: January 1, 2024</p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>1. Shipping Information</h3>
                <p style={{ marginBottom: '15px' }}>
                    We offer multiple shipping options to ensure your order arrives when you need it. Orders are processed within 1-2 business days and you will receive a tracking number once your order ships.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '25px', marginBottom: '12px' }}>Standard Shipping</h4>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Delivery Time:</strong> 5-7 Business Days<br />
                    <strong>Cost:</strong> Free on orders over ₹2,500<br />
                    Our standard shipping option is reliable and cost-effective for most orders.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '25px', marginBottom: '12px' }}>Express Shipping</h4>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Delivery Time:</strong> 2-3 Business Days<br />
                    <strong>Cost:</strong> ₹399<br />
                    Need it faster? Choose express shipping for quicker delivery.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '25px', marginBottom: '12px' }}>International Shipping</h4>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Delivery Time:</strong> 10-15 Business Days<br />
                    <strong>Cost:</strong> Calculated at checkout<br />
                    We ship worldwide! Customs fees may apply based on your location.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>2. Shipping Details</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '8px' }}>Orders are processed within 1-2 business days</li>
                    <li style={{ marginBottom: '8px' }}>You will receive a tracking number once your order ships</li>
                    <li style={{ marginBottom: '8px' }}>Shipping times exclude weekends and holidays</li>
                    <li style={{ marginBottom: '8px' }}>P.O. Box addresses are accepted for standard shipping only</li>
                    <li style={{ marginBottom: '8px' }}>Signature may be required for orders over ₹12,500</li>
                    <li style={{ marginBottom: '8px' }}>Free shipping applies to standard shipping only within India</li>
                </ul>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>3. Returns & Exchanges</h3>
                <p style={{ marginBottom: '15px' }}>
                    Not completely satisfied? We offer a 30-day return policy on all items. Returns must be initiated within 30 days of delivery date.
                </p>

                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '25px', marginBottom: '12px' }}>Return Process</h4>
                <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Initiate Return:</strong> Log into your account and select the order you wish to return</li>
                    <li style={{ marginBottom: '8px' }}><strong>Pack Your Items:</strong> Pack items securely in original packaging with all tags attached</li>
                    <li style={{ marginBottom: '8px' }}><strong>Ship It Back:</strong> Use the prepaid return label and drop off at any carrier location</li>
                </ol>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>4. Return Policy</h3>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Eligible Items:</strong> Items must be unworn, unwashed, and in original condition with all tags attached.
                </p>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Return Window:</strong> Returns must be initiated within 30 days of delivery date.
                </p>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Refund Processing:</strong> Refunds are processed within 5-7 business days of receiving your return.
                </p>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Final Sale Items:</strong> Items marked as "Final Sale" are not eligible for return or exchange.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>5. Exchanges</h3>
                <p style={{ marginBottom: '15px' }}>
                    We gladly accept exchanges for different sizes or colors. To exchange an item, please initiate a return and place a new order for the desired item.
                </p>

                <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        If you have any questions about shipping or returns, please contact us at support@hypertonic.com
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ShippingReturns;
