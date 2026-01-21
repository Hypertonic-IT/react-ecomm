import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';

const PrivacyPolicy = () => {
    return (
        <div style={{ fontFamily: '"Helvetica Neue", sans-serif', color: '#333' }}>
            <TopBar />
            <Header />

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', lineHeight: '1.8' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>Privacy Policy</h1>

                <p style={{ marginBottom: '20px' }}>Last Updated: January 1, 2024</p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>1. Introduction</h3>
                <p style={{ marginBottom: '15px' }}>
                    Welcome to Hypertonic. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                    (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                </p>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>2. Data We Collect</h3>
                <p style={{ marginBottom: '15px' }}>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                    <li><strong>Financial Data:</strong> includes bank account and payment card details.</li>
                    <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                </ul>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>3. How We Use Your Data</h3>
                <p style={{ marginBottom: '15px' }}>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                </ul>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>4. Data Security</h3>
                <p style={{ marginBottom: '15px' }}>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                </p>

                <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        If you have any questions about this privacy policy, please contact us at privacy@hypertonic.com
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
