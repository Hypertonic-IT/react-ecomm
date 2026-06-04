import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
    FaSearch, FaEnvelope, FaCheckCircle, FaClock,
    FaTimesCircle, FaFileInvoiceDollar, FaCalendarAlt,
    FaSyncAlt, FaBoxOpen, FaChevronDown, FaChevronUp,
    FaCommentDots
} from 'react-icons/fa';
import { API_BASE_URL } from 'config';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const STATUS_MAP = {
    responded: {
        label: 'Replied',
        icon: <FaCheckCircle />,
        color: '#16a34a',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        dot: '#16a34a'
    },
    pending: {
        label: 'Pending Review',
        icon: <FaClock />,
        color: '#92400e',
        bg: '#fffbeb',
        border: '#fcd34d',
        dot: '#f59e0b'
    }
};

const statusInfo = (status) =>
    STATUS_MAP[status] || {
        label: status,
        icon: <FaClock />,
        color: '#6b7280',
        bg: '#f9fafb',
        border: '#e5e7eb',
        dot: '#6b7280'
    };

/* ─────────────────────────────────────────────
   Single Quote Card
───────────────────────────────────────────── */
const QuoteCard = ({ quote, index }) => {
    const [expanded, setExpanded] = useState(index === 0); // first card open by default
    const s = statusInfo(quote.status);

    return (
        <div style={{
            background: '#fff',
            border: `1px solid ${expanded ? '#000' : '#e5e7eb'}`,
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: expanded ? '0 6px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.3s ease',
            marginBottom: '16px'
        }}>
            {/* Card Header — always visible */}
            <button
                onClick={() => setExpanded(e => !e)}
                style={{
                    width: '100%', border: 'none', background: 'none',
                    cursor: 'pointer', padding: '20px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '12px', textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    {/* Status dot */}
                    <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: s.dot, flexShrink: 0,
                        boxShadow: `0 0 0 3px ${s.bg}`
                    }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
                                #{String(quote._id).slice(-8).toUpperCase()}
                            </span>
                            <span style={{
                                background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                                padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                            }}>
                                {s.icon} {s.label}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaCalendarAlt size={10} /> Submitted {formatDate(quote.createdAt)}
                            </span>
                            {quote.updatedAt !== quote.createdAt && quote.status === 'responded' && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FaSyncAlt size={10} /> Replied {formatDate(quote.updatedAt)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{
                    color: '#9ca3af', fontSize: '0.9rem', transition: 'transform 0.3s',
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0
                }}>
                    <FaChevronDown />
                </div>
            </button>

            {/* Expandable body */}
            {expanded && (
                <div style={{ borderTop: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Request Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                        {[
                            { label: 'Contact Name', value: quote.name },
                            { label: 'Phone', value: quote.phone },
                            { label: 'Submitted On', value: formatDate(quote.createdAt) },
                            { label: 'Last Updated', value: formatDate(quote.updatedAt) },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px 14px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 4px' }}>{label}</p>
                                <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '0.9rem' }}>{value || '—'}</p>
                            </div>
                        ))}
                    </div>

                    {/* Items Description */}
                    {quote.itemsDescription && (
                        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaBoxOpen size={10} /> Items Requested
                            </p>
                            <p style={{ color: '#374151', lineHeight: 1.65, margin: 0, fontSize: '0.93rem' }}>{quote.itemsDescription}</p>
                        </div>
                    )}

                    {/* Notes */}
                    {quote.message && (
                        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 8px' }}>
                                Your Notes
                            </p>
                            <p style={{ color: '#374151', lineHeight: 1.65, margin: 0, fontSize: '0.93rem' }}>{quote.message}</p>
                        </div>
                    )}

                    {/* Admin Response */}
                    {quote.adminResponse ? (
                        <div style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderLeft: '4px solid #16a34a', borderRadius: '10px',
                            padding: '20px 20px 20px 22px'
                        }}>
                            <p style={{
                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '1.2px', color: '#16a34a', margin: '0 0 10px',
                                display: 'flex', alignItems: 'center', gap: '7px'
                            }}>
                                <FaCommentDots /> Admin Response
                            </p>
                            <p style={{ color: '#166534', lineHeight: 1.7, margin: 0, fontSize: '0.96rem' }}>
                                {quote.adminResponse}
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            background: '#fffbeb', border: '1px solid #fcd34d',
                            borderLeft: '4px solid #f59e0b', borderRadius: '10px',
                            padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px'
                        }}>
                            <FaClock style={{ color: '#f59e0b', fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <p style={{ fontWeight: 700, color: '#92400e', margin: '0 0 4px', fontSize: '0.9rem' }}>
                                    Awaiting Response
                                </p>
                                <p style={{ color: '#78350f', fontSize: '0.84rem', margin: 0, lineHeight: 1.6 }}>
                                    Our sales team is reviewing your request. We typically respond within 24–48 business hours.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const TrackQuote = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quotes, setQuotes] = useState(null); // null = not searched yet

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setQuotes(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/quotes/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setQuotes(data.quotes);
            } else {
                setError(data.message || 'No quote requests found for this email.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f9f9f9', minHeight: '100vh' }}>
            <Helmet>
                <title>Track Wholesale Quote | Kayaroop</title>
                <meta name="description" content="Track the status of your wholesale quote request. Enter your email to view the latest status and admin response." />
            </Helmet>

            <TopBar />
            <Header />

            {/* Hero */}
            <div style={{
                background: '#000', padding: '56px 20px 52px',
                textAlign: 'center', color: '#fff'
            }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)', marginBottom: '20px'
                }}>
                    <FaFileInvoiceDollar style={{ fontSize: '1.6rem', color: '#fff' }} />
                </div>
                <h1 style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 900,
                    letterSpacing: '-1px', textTransform: 'uppercase', margin: '0 0 12px'
                }}>
                    Track Quote Request
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
                    Enter the email address you used when submitting your wholesale quote request to view all your requests and admin responses.
                </p>
            </div>

            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '44px 20px 80px' }}>

                {/* Search Card */}
                <div style={{
                    background: '#fff', borderRadius: '16px', padding: '36px 40px',
                    border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    marginBottom: '36px'
                }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
                        Find Your Requests
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '0 0 24px' }}>
                        We'll show all wholesale quote requests associated with your email.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label style={{
                            display: 'block', fontSize: '0.78rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '1.2px', color: '#374151', marginBottom: '8px'
                        }}>
                            Email Address *
                        </label>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: '1 1 240px' }}>
                                <FaEnvelope style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.9rem'
                                }} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={{
                                        width: '100%', padding: '13px 14px 13px 42px',
                                        border: '1.5px solid #d1d5db', borderRadius: '8px',
                                        fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit',
                                        outline: 'none', transition: 'border-color 0.2s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#000'}
                                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '13px 28px', background: loading ? '#d1d5db' : '#000',
                                    color: loading ? '#9ca3af' : '#fff', border: '2px solid #000',
                                    borderRadius: '8px', fontSize: '0.95rem', fontWeight: 800,
                                    cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                    transition: 'all 0.2s ease', flexShrink: 0
                                }}
                            >
                                <FaSearch size={13} /> {loading ? 'Searching…' : 'Track'}
                            </button>
                        </div>

                        {error && (
                            <div style={{
                                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                                padding: '12px 16px', marginTop: '16px', display: 'flex',
                                alignItems: 'center', gap: '10px', color: '#dc2626', fontSize: '0.9rem'
                            }}>
                                <FaTimesCircle style={{ flexShrink: 0 }} />
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                {/* Results */}
                {quotes !== null && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                                {quotes.length} Quote Request{quotes.length !== 1 ? 's' : ''} Found
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280' }}>
                                Showing results for <strong>{email}</strong>
                            </p>
                        </div>

                        {quotes.map((quote, i) => (
                            <QuoteCard key={quote._id} quote={quote} index={i} />
                        ))}

                        {/* CTA to submit new request */}
                        <div style={{
                            marginTop: '28px', background: '#fff', border: '1px solid #e5e7eb',
                            borderRadius: '12px', padding: '20px 24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: '16px', flexWrap: 'wrap'
                        }}>
                            <div>
                                <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 4px', fontSize: '0.95rem' }}>
                                    Need to submit a new request?
                                </p>
                                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.84rem' }}>
                                    Log in with your business account to submit a wholesale quote.
                                </p>
                            </div>
                            <Link
                                to="/business/apply"
                                style={{
                                    padding: '10px 20px', background: '#000', color: '#fff',
                                    borderRadius: '8px', textDecoration: 'none', fontWeight: 700,
                                    fontSize: '0.88rem', whiteSpace: 'nowrap', letterSpacing: '0.3px'
                                }}
                            >
                                For Business →
                            </Link>
                        </div>
                    </>
                )}

                {/* Empty state */}
                {quotes === null && !loading && !error && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                        <FaFileInvoiceDollar style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }} />
                        <p style={{ fontSize: '0.95rem', margin: 0 }}>
                            Enter your email above to view your wholesale quote requests.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default TrackQuote;
