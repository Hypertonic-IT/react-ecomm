import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { API_BASE_URL } from 'config';
import { FaArrowLeft } from 'react-icons/fa';
import './BusinessApply.css';

const BusinessRegister = () => {
    const navigate = useNavigate();
    const [submittingApp, setSubmittingApp] = useState(false);
    
    const [formData, setFormData] = useState({
        business_name: '',
        contact_person: '',
        email: '',
        phone: '',
        gst_number: '',
        business_address: '',
        business_type: 'Wholesaler',
        city: '',
        state: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setSubmittingApp(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/business/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('Your business account application has been submitted successfully and is awaiting admin approval.');
                navigate('/login');
            } else {
                alert(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting application');
        } finally {
            setSubmittingApp(false);
        }
    };

    return (
        <div className="business-apply-page">
            <Helmet>
                <title>Register for Business Account | Kayaroop</title>
                <meta name="description" content="Join our Business Program and gain access to business-specific features designed for bulk purchasing and commercial customers." />
            </Helmet>

            <TopBar />
            <Header />

            <div className="business-hero">
                <div className="business-hero-content">
                    <h1>Register for Business Account</h1>
                    <p style={{ maxWidth: '700px', margin: '10px auto 0 auto' }}>
                        Join our Business Program and gain access to business-specific features designed for bulk purchasing and commercial customers.
                    </p>
                </div>
            </div>

            <div className="business-container">
                <button className="back-btn" onClick={() => navigate('/business/apply')} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '20px',
                    fontSize: '0.9rem'
                }}>
                    <FaArrowLeft size={12} /> Back to Benefits
                </button>

                <form onSubmit={handleSubmit} className="business-form">
                    <h2>Business Registration Form</h2>
                    <p className="form-desc">Please fill out your business and account credentials below. Our team will review your application.</p>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Business Name*</label>
                            <input 
                                type="text" 
                                name="business_name" 
                                value={formData.business_name} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g. Acme Clothing Inc." 
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Person Name*</label>
                            <input 
                                type="text" 
                                name="contact_person" 
                                value={formData.contact_person} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address*</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number*</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>GST Number</label>
                            <input 
                                type="text" 
                                name="gst_number" 
                                value={formData.gst_number} 
                                onChange={handleChange} 
                                placeholder="e.g. 27AAAAA0000A1Z5" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Business Type*</label>
                            <select name="business_type" value={formData.business_type} onChange={handleChange}>
                                <option value="Wholesaler">Wholesaler</option>
                                <option value="Retailer">Retailer</option>
                                <option value="Boutique / Brand">Boutique / Brand</option>
                                <option value="Corporate Buyer">Corporate Buyer</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>City*</label>
                            <input 
                                type="text" 
                                name="city" 
                                value={formData.city} 
                                onChange={handleChange} 
                                required
                                placeholder="e.g. Mumbai"
                            />
                        </div>
                        <div className="form-group">
                            <label>State*</label>
                            <input 
                                type="text" 
                                name="state" 
                                value={formData.state} 
                                onChange={handleChange} 
                                required
                                placeholder="e.g. Maharashtra"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password*</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password*</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Business Address*</label>
                            <textarea 
                                name="business_address" 
                                value={formData.business_address} 
                                onChange={handleChange} 
                                required 
                                rows="3" 
                                placeholder="Complete billing & delivery address..."
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={submittingApp} className="submit-btn">
                        {submittingApp ? 'Submitting...' : 'Submit Business Application'}
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default BusinessRegister;
