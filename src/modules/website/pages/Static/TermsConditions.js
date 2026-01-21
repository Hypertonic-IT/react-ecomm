import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';

const TermsConditions = () => {
    return (
        <div style={{ fontFamily: '"Helvetica Neue", sans-serif', color: '#333' }}>
            <TopBar />
            <Header />

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', lineHeight: '1.8' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>Terms & Conditions</h1>

                <p style={{ marginBottom: '20px' }}>Last Updated: January 1, 2024</p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>1. Agreement to Terms</h3>
                <p style={{ marginBottom: '15px' }}>
                    These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Hypertonic (“we,” “us” or “our”), concerning your access to and use of our website.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>2. Intellectual Property Rights</h3>
                <p style={{ marginBottom: '15px' }}>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>3. User Representations</h3>
                <p style={{ marginBottom: '15px' }}>
                    By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>4. Products</h3>
                <p style={{ marginBottom: '15px' }}>
                    We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>5. Purchases and Payment</h3>
                <p style={{ marginBottom: '15px' }}>
                    We accept the following forms of payment: Visa, Mastercard, American Express, PayPal. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.
                </p>

                <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        If you have any questions about these Terms, please contact us at legal@hypertonic.com
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsConditions;
