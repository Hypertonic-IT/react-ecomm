import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaLinkedin, FaTwitter, FaInstagram, FaQuoteLeft } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <div style={{ fontFamily: '"Helvetica Neue", sans-serif', color: '#333' }}>
            <TopBar />
            <Header />

            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '400px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
                    <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '2px' }}>
                        Redefining Fashion
                    </h1>
                    <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto', fontWeight: '300' }}>
                        Where timeless style meets modern elegance. Be bold, be you.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div style={{
                maxWidth: '1200px', margin: '80px auto', padding: '0 20px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px',
                alignItems: 'center'
            }}>
                <div>
                    <h4 style={{ color: '#d4a373', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px' }}>OUR PHILOSOPHY</h4>
                    <h2 style={{ fontSize: '36px', marginBottom: '30px', fontWeight: 'bold' }}>Crafting Confidence Through Style</h2>
                    <p style={{ lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                        At Hypertonic, we believe that fashion is more than just clothing—it's a form of self-expression.
                        Our journey began with a simple mission: to create high-quality, sustainable pieces that empower individuals to look and feel their best.
                    </p>
                    <p style={{ lineHeight: '1.8', color: '#666' }}>
                        We are committed to ethical sourcing, premium fabrics, and designs that transcend seasons.
                        Every stitch tells a story of dedication and artistry.
                    </p>
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                        alt="Design Process"
                        style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: '#d4a373' }}>10k+</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Happy Customers</p>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: '#d4a373' }}>500+</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Unique Designs</p>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: '#d4a373' }}>15+</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Global Awards</p>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: '#d4a373' }}>100%</h3>
                        <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Sustainability</p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: 'bold' }}>Meet The Minds</h2>
                <p style={{ color: '#666', marginBottom: '50px' }}>The creative force behind the brand.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                    {[
                        { name: 'Alex Johnson', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
                        { name: 'Sarah Lee', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
                        { name: 'Michael Chen', role: 'Marketing Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
                        { name: 'Emily Davis', role: 'Lead Stylist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' }
                    ].map((member, idx) => (
                        <div key={idx} style={{ padding: '20px', textAlign: 'center' }}>
                            <img
                                src={member.img}
                                alt={member.name}
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                            />
                            <h4 style={{ fontSize: '20px', marginBottom: '5px', fontWeight: 'bold' }}>{member.name}</h4>
                            <p style={{ color: '#d4a373', fontSize: '14px', marginBottom: '15px', fontWeight: '500' }}>{member.role}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#999' }}>
                                <FaLinkedin style={{ cursor: 'pointer', fontSize: '18px' }} />
                                <FaTwitter style={{ cursor: 'pointer', fontSize: '18px' }} />
                                <FaInstagram style={{ cursor: 'pointer', fontSize: '18px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <FaQuoteLeft style={{ fontSize: '40px', color: '#d4a373', marginBottom: '30px' }} />
                    <p style={{ fontSize: '24px', lineHeight: '1.6', fontStyle: 'italic', color: '#444', marginBottom: '30px' }}>
                        "Hypertonic has completely transformed my wardrobe. The quality is unmatched, and every piece feels like it was made just for me. Absolutely love it!"
                    </p>
                    <h5 style={{ fontWeight: 'bold', fontSize: '18px' }}>Jessica Parker</h5>
                    <p style={{ color: '#777', fontSize: '14px' }}>Loyal Customer</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
