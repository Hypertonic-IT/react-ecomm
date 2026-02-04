import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaShippingFast, FaUndo, FaBox, FaClock, FaGlobe, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';

const ShippingReturns = () => {
    return (
        <div style={{ backgroundColor: 'var(--white)', color: 'var(--text-dark)' }}>
            <TopBar />
            <Header />

            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '50vh',
                minHeight: '400px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                textAlign: 'center'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        color: '#ffffff',
                        textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                        fontWeight: '700'
                    }}>
                        Shipping & Returns
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        maxWidth: '700px',
                        margin: '0 auto',
                        color: '#ffffff',
                        textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                    }}>
                        Fast, reliable shipping and hassle-free returns for your peace of mind
                    </p>
                </div>
            </div>

            {/* Shipping Information Section */}
            <div className="container section-padding">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h4 style={{
                        color: 'var(--accent)',
                        fontWeight: '600',
                        letterSpacing: '2px',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        fontSize: '14px'
                    }}>Delivery Options</h4>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--primary)' }}>Shipping Information</h2>
                    <p style={{ color: 'var(--text-medium)', fontSize: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                        We offer multiple shipping options to ensure your order arrives when you need it
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                    {[
                        {
                            icon: <FaShippingFast />,
                            title: 'Standard Shipping',
                            time: '5-7 Business Days',
                            price: 'Free on orders over ₹2,500',
                            description: 'Our standard shipping option is reliable and cost-effective for most orders.',
                            color: '#3498db'
                        },
                        {
                            icon: <FaClock />,
                            title: 'Express Shipping',
                            time: '2-3 Business Days',
                            price: '₹399',
                            description: 'Need it faster? Choose express shipping for quicker delivery.',
                            color: '#e74c3c'
                        },
                        {
                            icon: <FaGlobe />,
                            title: 'International Shipping',
                            time: '10-15 Business Days',
                            price: 'Calculated at checkout',
                            description: 'We ship worldwide! Customs fees may apply based on your location.',
                            color: '#27ae60'
                        }
                    ].map((option, idx) => (
                        <div key={idx} style={{
                            padding: '40px 30px',
                            background: 'var(--white)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                            }}>
                            <div style={{
                                fontSize: '48px',
                                color: option.color,
                                marginBottom: '20px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {option.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--primary)', fontWeight: '700' }}>{option.title}</h3>
                            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: option.color, marginBottom: '8px' }}>{option.time}</p>
                            <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '15px' }}>{option.price}</p>
                            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6', fontSize: '0.9rem' }}>{option.description}</p>
                        </div>
                    ))}
                </div>

                {/* Shipping Details */}
                <div style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    padding: '50px 40px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '30px', color: 'var(--primary)', textAlign: 'center' }}>Shipping Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {[
                            'Orders are processed within 1-2 business days',
                            'You will receive a tracking number once your order ships',
                            'Shipping times exclude weekends and holidays',
                            'P.O. Box addresses are accepted for standard shipping only',
                            'Signature may be required for orders over ₹12,500',
                            'Free shipping applies to standard shipping only within India'
                        ].map((detail, idx) => (
                            <div key={idx} style={{
                                padding: '16px 20px',
                                background: 'var(--white)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <FaCheckCircle style={{ color: 'var(--accent)', fontSize: '20px', flexShrink: 0 }} />
                                <span style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: '1.5' }}>{detail}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Returns Section */}
            <div style={{ background: 'var(--off-white)', padding: '80px 20px' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h4 style={{
                            color: 'var(--accent)',
                            fontWeight: '600',
                            letterSpacing: '2px',
                            marginBottom: '10px',
                            textTransform: 'uppercase',
                            fontSize: '14px'
                        }}>Easy Returns</h4>
                        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--primary)' }}>Returns & Exchanges</h2>
                        <p style={{ color: 'var(--text-medium)', fontSize: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                            Not completely satisfied? We offer a 30-day return policy on all items
                        </p>
                    </div>

                    {/* Return Process Steps */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                        {[
                            {
                                step: '1',
                                title: 'Initiate Return',
                                description: 'Log into your account and select the order you wish to return'
                            },
                            {
                                step: '2',
                                title: 'Pack Your Items',
                                description: 'Pack items securely in original packaging with all tags attached'
                            },
                            {
                                step: '3',
                                title: 'Ship It Back',
                                description: 'Use the prepaid return label and drop off at any carrier location'
                            }
                        ].map((item, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                    color: 'var(--white)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    margin: '0 auto 24px',
                                    fontWeight: '700',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                }}>{item.step}</div>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--primary)', fontWeight: '700' }}>{item.title}</h4>
                                <p style={{ color: 'var(--text-medium)', lineHeight: '1.7', fontSize: '1rem' }}>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Return Policy Grid */}
                    <div style={{
                        background: 'var(--white)',
                        padding: '50px 40px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '40px', color: 'var(--primary)', textAlign: 'center' }}>Return Policy</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                            {[
                                {
                                    title: 'Eligible Items',
                                    description: 'Items must be unworn, unwashed, and in original condition with all tags attached',
                                    icon: <FaCheckCircle />
                                },
                                {
                                    title: 'Return Window',
                                    description: 'Returns must be initiated within 30 days of delivery date',
                                    icon: <FaClock />
                                },
                                {
                                    title: 'Refund Processing',
                                    description: 'Refunds are processed within 5-7 business days of receiving your return',
                                    icon: <FaUndo />
                                },
                                {
                                    title: 'Final Sale Items',
                                    description: 'Items marked as "Final Sale" are not eligible for return or exchange',
                                    icon: <FaBox />
                                }
                            ].map((policy, idx) => (
                                <div key={idx} style={{ textAlign: 'center', padding: '20px' }}>
                                    <div style={{
                                        fontSize: '40px',
                                        color: 'var(--accent)',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        {policy.icon}
                                    </div>
                                    <h5 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--primary)', fontWeight: '700' }}>{policy.title}</h5>
                                    <p style={{ color: 'var(--text-medium)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                        {policy.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial Section */}
            <div style={{ backgroundColor: 'var(--white)', padding: '100px 20px', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <FaQuoteLeft style={{ fontSize: '48px', color: 'var(--accent)', marginBottom: '40px', opacity: 0.5 }} />
                    <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        lineHeight: '1.5',
                        fontStyle: 'italic',
                        color: 'var(--primary)',
                        marginBottom: '40px'
                    }}>
                        "The return process was incredibly smooth! I received my refund within a week, and the customer service team was very helpful throughout."
                    </p>
                    <h5 style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>Priya Sharma</h5>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Customer</p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="container section-padding" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>Need Help?</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '1rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
                    Our customer service team is here to assist you with any shipping or return questions
                </p>
                <a href="/contact" style={{
                    display: 'inline-block',
                    padding: '16px 48px',
                    background: 'var(--primary)',
                    color: 'var(--white)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--primary)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}>
                    Contact Support
                </a>
            </div>

            <Footer />
        </div>
    );
};

export default ShippingReturns;
