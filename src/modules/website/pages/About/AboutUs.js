import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import {
    FaStar,
    FaTshirt,
    FaCheckCircle,
    FaHeart,
    FaLeaf,
    FaAward,
    FaHandHoldingHeart
} from 'react-icons/fa';

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About Us - Hypertonic</title>
                <meta name="description" content="Learn about Hypertonic - your trusted fashion destination for quality clothing and exceptional style." />
            </Helmet>

            <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#1a1a1a', backgroundColor: '#ffffff' }}>
                <TopBar />
                <Header />

                {/* 1. HERO / INTRO SECTION - Clean & Monochromatic */}
                <div style={{
                    position: 'relative',
                    height: '50vh',
                    minHeight: '400px',
                    backgroundColor: '#111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center'
                }}>
                    {/* Optional: Subtle Background Image with high opacity overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.4
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 2, padding: '0 20px', maxWidth: '800px' }}>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '600',
                            marginBottom: '16px',
                            letterSpacing: '1px'
                        }}>
                            ABOUT US
                        </h1>
                        <div style={{ width: '60px', height: '3px', background: '#fff', margin: '0 auto 24px' }}></div>
                        <p style={{
                            fontSize: '1.25rem',
                            fontWeight: '300',
                            color: '#e0e0e0',
                            letterSpacing: '0.5px'
                        }}>
                            Crafted for style. Designed for comfort.
                        </p>
                    </div>
                </div>

                {/* 2. BRAND STORY SECTION - Clean Text Layout */}
                <div style={{ padding: '100px 20px', background: '#fff' }}>
                    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                            {/* Left: Text */}
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px', color: '#111', letterSpacing: '-0.5px' }}>
                                    Our Story
                                </h2>
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                                    Hypertonic was born from a simple belief: everyone deserves to look and feel their best without compromising on quality.
                                </p>
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                                    We recognized a gap in the market for quality fashion that's both stylish and accessible. Too often, the choice was between great design and reasonable prices. We set out to change that narrative.
                                </p>
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555' }}>
                                    Fashion is about confidence and self-expression. Every piece we create is designed with you in mind—combining modern trends with timeless comfort for the everyday individual.
                                </p>
                            </div>

                            {/* Right: Image - Minimalist */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-15px',
                                    left: '-15px',
                                    width: '100%',
                                    height: '100%',
                                    border: '1px solid #ddd',
                                    zIndex: 0
                                }}></div>
                                <img
                                    src="https://images.unsplash.com/photo-1551488852-080175b22345?w=800&q=80"
                                    alt="Our Brand Story"
                                    style={{
                                        width: '100%',
                                        height: '500px',
                                        objectFit: 'cover',
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'block'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MISSION & VISION SECTION - Clean Cards */}
                <div style={{ padding: '80px 20px', background: '#f9f9f9', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            {/* Mission Card */}
                            <div style={{
                                background: '#fff',
                                padding: '50px 40px',
                                border: '1px solid #eee',
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
                                    <FaHeart />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Our Mission
                                </h3>
                                <ul style={{ fontSize: '1rem', lineHeight: '2', listStyle: 'none', padding: 0, color: '#555' }}>
                                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaCheckCircle style={{ color: '#333', fontSize: '14px' }} /> Quality clothing that lasts
                                    </li>
                                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaCheckCircle style={{ color: '#333', fontSize: '14px' }} /> Accessible premium fashion
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaCheckCircle style={{ color: '#333', fontSize: '14px' }} /> Exceptional customer service
                                    </li>
                                </ul>
                            </div>

                            {/* Vision Card */}
                            <div style={{
                                background: '#fff',
                                padding: '50px 40px',
                                border: '1px solid #eee',
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
                                    <FaStar />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Our Vision
                                </h3>
                                <ul style={{ fontSize: '1rem', lineHeight: '2', listStyle: 'none', padding: 0, color: '#555' }}>
                                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaCheckCircle style={{ color: '#333', fontSize: '14px' }} /> To be a trusted fashion destination
                                    </li>
                                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaCheckCircle style={{ color: '#333', fontSize: '14px' }} /> Inspire confidence through style
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaCheckCircle style={{ color: '#333', fontSize: '14px' }} /> Leading with integrity & innovation
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. WHAT MAKES US DIFFERENT - Minimalist Icons */}
                <div style={{ padding: '100px 20px', background: '#fff' }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '15px', color: '#111', letterSpacing: '-0.5px' }}>
                                Why Choose Hypertonic?
                            </h2>
                            <div style={{ width: '40px', height: '2px', background: '#111', margin: '0 auto' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                            {/* Items */}
                            {[
                                { icon: <FaTshirt />, title: "Premium Fabric", text: "Selected for comfort & durability" },
                                { icon: <FaAward />, title: "Timeless Design", text: "Styles that transcend seasons" },
                                { icon: <FaCheckCircle />, title: "Fair Pricing", text: "Quality without the markup" },
                                { icon: <FaHandHoldingHeart />, title: "Customer First", text: "Dedicated to your satisfaction" }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    textAlign: 'center',
                                    padding: '30px 20px',
                                }}>
                                    <div style={{ fontSize: '2.5rem', color: '#111', marginBottom: '20px', opacity: 0.8 }}>
                                        {item.icon}
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {item.title}
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. QUALITY PROMISE - Split Layout */}
                <div style={{ padding: '0', background: '#f5f5f5' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        {/* Left: Image (Full height) */}
                        <div style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '500px'
                        }}></div>

                        {/* Right: Content */}
                        <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px', color: '#111' }}>
                                Quality You Can Feel
                            </h2>
                            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '30px' }}>
                                We believe quality shouldn't be a luxury. It should be a standard. From the first stitch to the final fold, we ensure every detail meets our uncompromising standards.
                            </p>

                            <div style={{ marginTop: '20px' }}>
                                <div style={{ marginBottom: '25px', paddingLeft: '20px', borderLeft: '3px solid #111' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
                                        Material Selection
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', color: '#666' }}>Sourced from the finest mills for superior texture and longevity.</p>
                                </div>
                                <div style={{ marginBottom: '25px', paddingLeft: '20px', borderLeft: '3px solid #111' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
                                        Precision Tailoring
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', color: '#666' }}>Expert craftsmanship ensuring a perfect fit for every body type.</p>
                                </div>
                                <div style={{ paddingLeft: '20px', borderLeft: '3px solid #111' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
                                        Final Inspection
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', color: '#666' }}>Rigorous quality control process before packaging and shipping.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. STATS SECTION - Minimalist Band */}
                <div style={{ padding: '80px 20px', background: '#111', color: '#fff' }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
                            {[
                                { num: "10k+", label: "Customers" },
                                { num: "4.8", label: "Avg. Rating" },
                                { num: "India", label: "Delivery" },
                                { num: "24/7", label: "Support" }
                            ].map((stat, index) => (
                                <div key={index}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px' }}>{stat.num}</div>
                                    <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 7. RESPONSIBLE FASHION */}
                <div style={{ padding: '100px 20px', background: '#fff' }}>
                    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <FaLeaf style={{ fontSize: '30px', color: '#111', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: '#111' }}>
                            Responsible Fashion
                        </h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '40px' }}>
                            We are committed to ethical practices. We partner with manufacturers who value safe working conditions and fair wages. We are also constantly exploring ways to make our packaging more sustainable.
                        </p>
                    </div>
                </div>

                {/* 8. CTA - Clean & Direct */}
                <div style={{
                    padding: '100px 20px',
                    background: '#f9f9f9',
                    textAlign: 'center',
                    borderTop: '1px solid #eee'
                }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '600', marginBottom: '20px', color: '#111' }}>
                        Refine Your Wardrobe
                    </h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#666' }}>
                        Discover the latest essentials designed for your lifestyle.
                    </p>
                    <div>
                        <Link to="/products" style={{
                            padding: '16px 50px',
                            background: '#111',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1rem',
                            display: 'inline-block',
                            transition: 'all 0.3s',
                            letterSpacing: '0.5px'
                        }}>
                            SHOP COLLECTION
                        </Link>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default AboutUs;
