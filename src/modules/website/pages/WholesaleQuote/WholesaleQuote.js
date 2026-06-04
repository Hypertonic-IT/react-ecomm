import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../../../context/AuthContext';
import { useShop } from '../../../../context/ShopContext';
import { API_BASE_URL } from 'config';
import { FaArrowLeft, FaFileInvoiceDollar, FaCheckCircle } from 'react-icons/fa';
import '../Business/BusinessApply.css';

const WholesaleQuote = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, isAuthenticated, loading } = useAuth();
    const { products } = useShop();

    // Query parameters parsing
    const query = new URLSearchParams(location.search);
    const productId = query.get('productId') || '';
    const qty = query.get('qty') || '100';
    const color = query.get('color') || '';
    const size = query.get('size') || '';

    // Find the product
    const product = products.find(p => String(p.id) === String(productId) || String(p._id) === String(productId));

    const [formData, setFormData] = useState({
        productName: product ? product.name : 'Loading...',
        requestedQuantity: qty,
        businessName: '',
        contactPerson: user?.name || '',
        email: user?.email || user?.emailOrMobile || '',
        mobileNumber: user?.phone || user?.emailOrMobile || '',
        additionalNotes: ''
    });

    const [submitting, setSubmitting] = useState(false);

    // Guard route: Only allow approved Business accounts
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                const redirectUrl = `${location.pathname}${location.search}`;
                navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
            } else if (user?.accountType !== 'business') {
                alert("Only business accounts can request wholesale quotes.");
                navigate('/business/apply', { replace: true });
            }
        }
    }, [isAuthenticated, user, loading, navigate, location]);

    // Update product name when product data loads
    useEffect(() => {
        if (product) {
            setFormData(prev => ({ ...prev, productName: product.name }));
        }
    }, [product]);

    // Fetch business profile details to prefill business name and contacts
    useEffect(() => {
        const fetchBusinessProfile = async () => {
            if (!token || user?.accountType !== 'business') return;
            try {
                const response = await fetch(`${API_BASE_URL}/business/status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.application) {
                        setFormData(prev => ({
                            ...prev,
                            businessName: data.application.business_name || prev.businessName,
                            contactPerson: data.application.contact_person || prev.contactPerson,
                            email: data.application.email || prev.email,
                            mobileNumber: data.application.phone || prev.mobileNumber
                        }));
                    }
                }
            } catch (error) {
                console.error("Error prefilling business details:", error);
            }
        };
        fetchBusinessProfile();
    }, [token, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                name: formData.contactPerson,
                email: formData.email,
                phone: formData.mobileNumber,
                itemsDescription: `Product: ${formData.productName} (ID: ${productId}) | Size: ${size} | Color: ${color} | Qty: ${formData.requestedQuantity}`,
                message: `Business Name: ${formData.businessName}\nNotes: ${formData.additionalNotes}`
            };

            const response = await fetch(`${API_BASE_URL}/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('Wholesale quote request submitted successfully! Our sales team will get back to you soon.');
                navigate('/products');
            } else {
                alert(data.message || 'Failed to submit quote request');
            }
        } catch (error) {
            console.error("Error submitting quote:", error);
            alert('Error submitting quote request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !isAuthenticated || user?.accountType !== 'business') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#64748b' }}>
                Verifying Business Credentials...
            </div>
        );
    }

    return (
        <div className="business-apply-page">
            <Helmet>
                <title>Wholesale Quote Request | Kayaroop</title>
                <meta name="description" content="Submit a bulk wholesale quote request for premium rates and bulk volumes." />
            </Helmet>

            <TopBar />
            <Header />

            <div className="business-hero" style={{ padding: '80px 20px' }}>
                <div className="business-hero-content">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#ffffff' }}>
                        <FaFileInvoiceDollar size={42} />
                    </div>
                    <h1>Wholesale Quote Request</h1>
                    <p style={{ maxWidth: '650px', margin: '10px auto 0 auto' }}>
                        Request custom pricing and check bulk availability for quantities exceeding our standard retail stock limits.
                    </p>
                </div>
            </div>

            <div className="business-container">
                <button className="back-btn" onClick={() => navigate(-1)} style={{
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
                    <FaArrowLeft size={12} /> Back to Product
                </button>

                <form onSubmit={handleSubmit} className="business-form">
                    <h2>Submit Bulk Requirement</h2>
                    <p className="form-desc">Fill out the details below and we will analyze custom logistics, pricing, and availability parameters for your organization.</p>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input 
                                type="text" 
                                name="productName" 
                                value={formData.productName} 
                                readOnly
                                style={{ background: '#e2e8f0', color: '#475569', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Requested Quantity*</label>
                            <input 
                                type="number" 
                                name="requestedQuantity" 
                                value={formData.requestedQuantity} 
                                onChange={handleChange}
                                required 
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Business Name*</label>
                            <input 
                                type="text" 
                                name="businessName" 
                                value={formData.businessName} 
                                onChange={handleChange}
                                required 
                                placeholder="Your registered entity name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Person*</label>
                            <input 
                                type="text" 
                                name="contactPerson" 
                                value={formData.contactPerson} 
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
                                name="mobileNumber" 
                                value={formData.mobileNumber} 
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Additional Notes & Specifications</label>
                            <textarea 
                                name="additionalNotes" 
                                value={formData.additionalNotes} 
                                onChange={handleChange}
                                rows="4" 
                                placeholder="Target delivery dates, target price, customization requirements, shipping details..."
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} className="submit-btn" style={{
                        background: '#0f172a',
                        fontWeight: '800'
                    }}>
                        {submitting ? 'Submitting Request...' : 'Submit Request'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                            Already submitted a quote?{' '}
                            <Link to="/track-quote" style={{ color: '#000', fontWeight: 700, textDecoration: 'underline' }}>
                                Track your quote request →
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <Footer />

        </div>
    );
};

export default WholesaleQuote;
