import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../../../context/AuthContext';
import { API_BASE_URL } from 'config';
import { 
    FaUserCheck, FaBoxes, FaChartLine, FaCogs, FaClipboardList, 
    FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight
} from 'react-icons/fa';
import './BusinessApply.css';

const BENEFITS = [
    {
        icon: <FaUserCheck />,
        title: 'Business Account Access',
        desc: 'Unlock custom business privileges and trade account credentials.'
    },
    {
        icon: <FaBoxes />,
        title: 'Bulk Quantity Ordering',
        desc: 'Order high-volume products directly with instant stock checks.'
    },
    {
        icon: <FaChartLine />,
        title: 'Dedicated Dashboard',
        desc: 'Access your personalised dashboard to track B2B inquiries and quotes.'
    },
    {
        icon: <FaCogs />,
        title: 'Business-Specific Features',
        desc: 'Receive quantity-based discounts and specialised business pricing.'
    },
    {
        icon: <FaClipboardList />,
        title: 'Easy Order Management',
        desc: 'View history, invoices, and reorder standard items in bulk with ease.'
    },
];

const BusinessApply = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('apply');

    const [appStatus, setAppStatus] = useState(null);
    const [appLoading, setAppLoading] = useState(true);

    const [submittingQuote, setSubmittingQuote] = useState(false);
    const [quoteData, setQuoteData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        message: '',
        itemsDescription: ''
    });

    const checkAppStatus = async () => {
        if (!isAuthenticated) { setAppLoading(false); return; }
        try {
            const response = await fetch(`${API_BASE_URL}/business/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.application) {
                    setAppStatus(data.application);
                    if (data.application.status === 'approved' && user && user.accountType !== 'business') {
                        updateProfile({ accountType: 'business' });
                    }
                } else {
                    setAppStatus(null);
                }
            }
        } catch (error) {
            console.error('Error fetching status:', error);
        } finally {
            setAppLoading(false);
        }
    };

    useEffect(() => { checkAppStatus(); }, [isAuthenticated, token]);

    const handleQuoteChange = (e) => setQuoteData({ ...quoteData, [e.target.name]: e.target.value });

    const handleRegisterClick = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/business/register');
        } else {
            navigate('/business/register');
        }
    };

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        setSubmittingQuote(true);
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${API_BASE_URL}/quotes`, {
                method: 'POST',
                headers,
                body: JSON.stringify(quoteData)
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert('Wholesale quote request submitted! Our sales team will be in touch shortly.');
                setQuoteData({ name: user?.name || '', email: user?.email || '', phone: user?.mobile || '', message: '', itemsDescription: '' });
            } else {
                alert(data.message || 'Failed to submit quote request');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting quote request');
        } finally {
            setSubmittingQuote(false);
        }
    };

    return (
        <div className="business-apply-page">
            <Helmet>
                <title>B2B Wholesale &amp; Business Accounts | Kayaroop</title>
                <meta name="description" content="Register your business account to unlock wholesale pricing and bulk order support." />
            </Helmet>

            <TopBar />
            <Header />

            <div className="business-hero">
                <div className="business-hero-content">
                    <h1>Kayaroop B2B Partnership</h1>
                    <p>Unlock premium business pricing, bulk volumes, and tailored wholesale services designed for commercial customers.</p>
                </div>
            </div>

            <div className="business-container">
                {/* Tab switcher */}
                <div className="tabs-header">
                    <button
                        id="tab-apply"
                        className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
                        onClick={() => setActiveTab('apply')}
                    >
                        Business Account Registration
                    </button>
                    <button
                        id="tab-quote"
                        className={`tab-btn ${activeTab === 'quote' ? 'active' : ''}`}
                        onClick={() => setActiveTab('quote')}
                    >
                        Wholesale Quote Request
                    </button>
                </div>

                <div className="tab-content">
                    {/* ── APPLY TAB ─────────────────────────────── */}
                    {activeTab === 'apply' && (
                        <div className="apply-section">
                            {appLoading ? (
                                <div className="business-loading">Checking your application status…</div>
                            ) : appStatus ? (
                                /* Status banners */
                                <div className={`status-banner status-${appStatus.status}`}>
                                    {appStatus.status === 'pending' && (
                                        <div className="status-box pending">
                                            <div className="status-icon" style={{ color: '#374151', fontSize: '3rem', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                                <FaClock />
                                            </div>
                                            <h3>Application Under Review</h3>
                                            <p>Your business registration request has been submitted and is awaiting admin approval.</p>
                                            <p className="status-footer">Applications are typically processed within 24–48 business hours. Thank you for your patience!</p>
                                        </div>
                                    )}
                                    {appStatus.status === 'approved' && (
                                        <div className="status-box approved">
                                            <div className="status-icon" style={{ color: '#000000', fontSize: '3rem', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                                <FaCheckCircle />
                                            </div>
                                            <h3>Congratulations! 🎉</h3>
                                            <p>Your business application for <strong>{appStatus.business_name}</strong> is <strong>Approved</strong>.</p>
                                            <p>B2B pricing is now unlocked. All items will automatically display wholesale business rates.</p>
                                            <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop: '20px' }}>
                                                Browse B2B Catalogue
                                            </button>
                                        </div>
                                    )}
                                    {appStatus.status === 'rejected' && (
                                        <div className="status-box rejected">
                                            <div className="status-icon" style={{ color: '#374151', fontSize: '3rem', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                                <FaTimesCircle />
                                            </div>
                                            <h3>Application Not Approved</h3>
                                            <p>Unfortunately, your application for <strong>{appStatus.business_name}</strong> could not be approved at this time.</p>
                                            <p>If you believe this is an error or have additional information, please re-apply or contact us at <strong>B2B@kayaroop.com</strong>.</p>
                                            <button onClick={() => navigate('/business/register')} className="btn-secondary" style={{ marginTop: '20px' }}>
                                                Re-apply Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Landing: CTA + Benefits */
                                <div className="b2b-landing-wrapper">
                                    {/* Top 2-column panel: intro left, CTA right */}
                                    <div className="b2b-top-panel">
                                        <div className="b2b-intro-pane">
                                            <div className="b2b-intro-eyebrow">
                                                <span></span>
                                                For Business
                                            </div>
                                            <h2>Become a Business Partner</h2>
                                            <p className="b2b-hero-desc">
                                                Join our Business Programme and get access to bulk purchasing, dedicated account support, and a seamless ordering experience designed specifically for commercial customers.
                                            </p>
                                        </div>

                                        <div className="b2b-cta-pane">
                                            <h3>Ready to join?<br />Register your business today.</h3>
                                            <p>No upfront cost. Simply fill in your business details and our team will review your application within 24–48 hours.</p>
                                            <button
                                                id="btn-register-here"
                                                className="register-cta-btn"
                                                onClick={handleRegisterClick}
                                            >
                                                Register Here <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Benefits grid below */}
                                    <div className="b2b-benefits-section">
                                        <h3>Why partner with us?</h3>
                                        <div className="b2b-benefits-grid">
                                            {BENEFITS.map((b, i) => (
                                                <div className="benefit-card" key={i}>
                                                    <div className="benefit-icon">{b.icon}</div>
                                                    <div className="benefit-info">
                                                        <h4>{b.title}</h4>
                                                        <p>{b.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── QUOTE TAB ─────────────────────────────── */}
                    {activeTab === 'quote' && (
                        <div className="quote-section">
                            <form onSubmit={handleQuoteSubmit} className="business-form">
                                <h2>Request a Bulk Quote</h2>
                                <p className="form-desc">Sourcing for a large corporate order or requesting custom garments? Share your specifications and we'll come back to you with the best rates.</p>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Your Name *</label>
                                        <input type="text" name="name" value={quoteData.name} onChange={handleQuoteChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input type="email" name="email" value={quoteData.email} onChange={handleQuoteChange} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Phone Number *</label>
                                        <input type="tel" name="phone" value={quoteData.phone} onChange={handleQuoteChange} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Items &amp; Quantities Requested *</label>
                                        <textarea
                                            name="itemsDescription"
                                            value={quoteData.itemsDescription}
                                            onChange={handleQuoteChange}
                                            required
                                            rows="3"
                                            placeholder="e.g. 500 units of Denim Jackets – Size M (200), L (300) in Navy Blue"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Special Notes / Target Price / Shipping Requirements</label>
                                        <textarea
                                            name="message"
                                            value={quoteData.message}
                                            onChange={handleQuoteChange}
                                            required
                                            rows="4"
                                            placeholder="Target delivery dates, custom labelling, pricing parameters…"
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={submittingQuote} className="submit-btn">
                                    {submittingQuote ? 'Submitting…' : 'Submit Quote Request'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BusinessApply;
