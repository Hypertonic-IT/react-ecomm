import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaLinkedin, FaTwitter, FaInstagram, FaQuoteLeft } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <div style={{ backgroundColor: 'var(--white)', color: 'var(--text-dark)' }}>
            <TopBar />
            <Header />

            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '50vh',
                minHeight: '400px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80")',
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
                    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '3.5rem', 
                        marginBottom: '1rem', 
                        color: 'var(--white)' 
                    }}>
                        Redefining Fashion
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        maxWidth: '700px', 
                        margin: '0 auto', 
                        color: 'rgba(255,255,255,0.9)' 
                    }}>
                        Where timeless style meets modern elegance. Be bold, be you.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="container section-padding" style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px',
                alignItems: 'center'
            }}>
                <div>
                    <h4 style={{ 
                        color: 'var(--accent)', 
                        fontWeight: '600', 
                        letterSpacing: '2px', 
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        fontSize: '14px'
                    }}>Our Philosophy</h4>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Crafting Confidence Through Style</h2>
                    <p style={{ marginBottom: '20px', color: 'var(--text-medium)' }}>
                        At Hypertonic, we believe that fashion is more than just clothing—it's a form of self-expression.
                        Our journey began with a simple mission: to create high-quality, sustainable pieces that empower individuals to look and feel their best.
                    </p>
                    <p style={{ color: 'var(--text-medium)' }}>
                        We are committed to ethical sourcing, premium fabrics, and designs that transcend seasons.
                        Every stitch tells a story of dedication and artistry.
                    </p>
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                        alt="Design Process"
                        style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div style={{ backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '80px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px', textAlign: 'center' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '8px' }}>10k+</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>Happy Customers</p>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '8px' }}>500+</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>Unique Designs</p>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '8px' }}>15+</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>Global Awards</p>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '8px' }}>100%</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>Sustainability</p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="container section-padding text-center">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Meet The Minds</h2>
                <p style={{ color: 'var(--text-medium)', marginBottom: '60px' }}>The creative force behind the brand.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                    {[
                        { name: 'Alex Johnson', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
                        { name: 'Sarah Lee', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
                        { name: 'Michael Chen', role: 'Marketing Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
                        { name: 'Emily Davis', role: 'Lead Stylist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' }
                    ].map((member, idx) => (
                        <div key={idx} style={{ padding: '20px', transition: 'transform 0.3s' }}>
                            <img
                                src={member.img}
                                alt={member.name}
                                style={{ 
                                    width: '180px', 
                                    height: '180px', 
                                    borderRadius: '50%', 
                                    objectFit: 'cover', 
                                    marginBottom: '24px', 
                                    boxShadow: 'var(--shadow-md)',
                                    border: '4px solid var(--white)'
                                }}
                            />
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--primary)' }}>{member.name}</h4>
                            <p style={{ color: 'var(--accent)', fontSize: '14px', marginBottom: '16px', fontWeight: '600', textTransform: 'uppercase' }}>{member.role}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: 'var(--text-light)' }}>
                                <FaLinkedin className="header-icon" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                <FaTwitter className="header-icon" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                <FaInstagram className="header-icon" style={{ cursor: 'pointer', fontSize: '20px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div style={{ backgroundColor: 'var(--off-white)', padding: '100px 0', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <FaQuoteLeft style={{ fontSize: '48px', color: 'var(--accent)', marginBottom: '40px', opacity: 0.5 }} />
                    <p style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2rem', 
                        lineHeight: '1.4', 
                        fontStyle: 'italic', 
                        color: 'var(--primary)', 
                        marginBottom: '40px' 
                    }}>
                        "Hypertonic has completely transformed my wardrobe. The quality is unmatched, and every piece feels like it was made just for me. Absolutely love it!"
                    </p>
                    <h5 style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>Jessica Parker</h5>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loyal Customer</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
