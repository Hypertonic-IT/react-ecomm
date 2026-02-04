import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaUndo, FaShippingFast, FaHeadset, FaGift, FaLinkedin, FaTwitter, FaInstagram, FaStar } from 'react-icons/fa';

const AboutUs = () => {
    const features = [
        {
            icon: <FaUndo />,
            title: '14-Day Returns',
            description: 'Risk-free shopping with easy returns'
        },
        {
            icon: <FaShippingFast />,
            title: 'Free Shipping',
            description: 'No worries, just hit the road'
        },
        {
            icon: <FaHeadset />,
            title: '24/7 Support',
            description: '24/7 support, always here just for you'
        },
        {
            icon: <FaGift />,
            title: 'Member Discounts',
            description: 'Special offers for our loyal customers'
        }
    ];

    const team = [
        {
            name: 'Annette Black',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
        },
        {
            name: 'Jane Cooper',
            role: 'Head Designer',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
        },
        {
            name: 'Brooklyn Simmons',
            role: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80'
        },
        {
            name: 'Theresa Webb',
            role: 'Product Manager',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
        }
    ];

    const brands = [
        { name: 'Vanfaba', style: { fontFamily: 'serif', fontWeight: '700' } },
        { name: 'Anvouge', style: { fontFamily: 'sans-serif', fontWeight: '600' } },
        { name: 'Carolin', style: { fontFamily: 'cursive', fontWeight: '400' } },
        { name: 'Shangui', style: { fontFamily: 'sans-serif', fontWeight: '700' } },
        { name: 'Ecomtle', style: { fontFamily: 'serif', fontWeight: '500' } },
        { name: 'Cheryl', style: { fontFamily: 'cursive', fontWeight: '400' } }
    ];

    const reviews = [
        {
            name: 'Sarah M.',
            rating: 5,
            title: 'Great Quality!',
            text: 'I am extremely satisfied with my purchase. The quality is top-notch and the customer service is wonderful. I highly recommend this store!'
        },
        {
            name: 'James Wilson',
            rating: 5,
            title: 'Quality of Clothing',
            text: 'I love shopping at this store. The products are high-quality and the customer service is excellent. I always have a wonderful experience!'
        },
        {
            name: 'Emily R.',
            rating: 5,
            title: 'Excellent Service!',
            text: 'Outstanding quality and fast delivery! I am so happy with my purchase and will definitely order again. They have great taste!'
        }
    ];

    return (
        <div style={{ backgroundColor: 'var(--white)', color: 'var(--text-dark)' }}>
            <TopBar />
            <Header />

            {/* Breadcrumb */}
            <div className="container" style={{ padding: '20px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                Homepage &gt; Pages &gt; <span style={{ color: 'var(--text-dark)' }}>About Our Store</span>
            </div>

            {/* Hero Section */}
            <div className="container" style={{ padding: '40px 0 80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', alignItems: 'center' }}>
                    {/* Left Image */}
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                            alt="Fashion Model"
                            style={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>

                    {/* Right Content */}
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            marginBottom: '30px',
                            fontFamily: 'var(--font-heading)',
                            color: 'var(--primary)',
                            fontWeight: '700'
                        }}>
                            Hypertonic – Offering rare and beautiful items worldwide
                        </h1>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '30px',
                            marginBottom: '30px',
                            borderBottom: '2px solid var(--border-color)',
                            paddingBottom: '10px'
                        }}>
                            <span style={{
                                fontWeight: '700',
                                color: 'var(--primary)',
                                borderBottom: '3px solid var(--primary)',
                                paddingBottom: '10px',
                                marginBottom: '-12px',
                                cursor: 'pointer'
                            }}>Introduction</span>
                            <span style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Our Vision</span>
                            <span style={{ color: 'var(--text-light)', cursor: 'pointer' }}>What Sets Us Apart</span>
                            <span style={{ color: 'var(--text-light)', cursor: 'pointer' }}>Our Commitment</span>
                        </div>

                        <p style={{
                            color: 'var(--text-medium)',
                            lineHeight: '1.8',
                            marginBottom: '20px',
                            fontSize: '1rem'
                        }}>
                            Welcome to our store! We are dedicated to offering the finest selection of rare and beautiful items from around the world. Our mission is to bring you the elegance and sophistication you deserve. From timeless classics to modern elegance, discover the perfect addition to your wardrobe at Hypertonic Store.
                        </p>

                        <button style={{
                            padding: '14px 32px',
                            background: 'var(--primary)',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}>
                            Read More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ background: 'var(--off-white)', padding: '60px 0' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '40px'
                    }}>
                        {features.map((feature, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    color: 'var(--primary)',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {feature.icon}
                                </div>
                                <h4 style={{
                                    fontSize: '1.1rem',
                                    marginBottom: '8px',
                                    color: 'var(--primary)',
                                    fontWeight: '700'
                                }}>
                                    {feature.title}
                                </h4>
                                <p style={{
                                    color: 'var(--text-medium)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Meet Our Teams */}
            <div className="container" style={{ padding: '80px 0' }}>
                <h2 style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                    marginBottom: '16px',
                    color: 'var(--primary)',
                    fontWeight: '700'
                }}>
                    Meet Our Teams
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-medium)',
                    marginBottom: '50px',
                    fontSize: '1rem'
                }}>
                    Discover exceptional experiences with passionate, dedicated, and talented team members
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px'
                }}>
                    {team.map((member, idx) => (
                        <div key={idx} style={{
                            background: 'var(--white)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                            }}>
                            <img
                                src={member.image}
                                alt={member.name}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{ padding: '20px' }}>
                                <h4 style={{
                                    fontSize: '1.1rem',
                                    marginBottom: '6px',
                                    color: 'var(--primary)',
                                    fontWeight: '700'
                                }}>
                                    {member.name}
                                </h4>
                                <p style={{
                                    color: 'var(--text-light)',
                                    fontSize: '0.9rem',
                                    marginBottom: '12px'
                                }}>
                                    {member.role}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    color: 'var(--text-light)'
                                }}>
                                    <FaLinkedin style={{ cursor: 'pointer', fontSize: '18px' }} />
                                    <FaTwitter style={{ cursor: 'pointer', fontSize: '18px' }} />
                                    <FaInstagram style={{ cursor: 'pointer', fontSize: '18px' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brand Logos */}
            <div style={{ background: 'var(--off-white)', padding: '50px 0' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '30px'
                    }}>
                        {brands.map((brand, idx) => (
                            <div key={idx} style={{
                                fontSize: '1.5rem',
                                color: 'var(--text-dark)',
                                opacity: 0.7,
                                transition: 'opacity 0.3s',
                                cursor: 'pointer',
                                ...brand.style
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
                                {brand.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="container" style={{ padding: '80px 0' }}>
                <h2 style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                    marginBottom: '50px',
                    color: 'var(--primary)',
                    fontWeight: '700'
                }}>
                    Customer Review
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {reviews.map((review, idx) => (
                        <div key={idx} style={{
                            background: 'var(--white)',
                            padding: '30px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                color: 'var(--white)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                marginBottom: '16px'
                            }}>
                                {review.name.charAt(0)}
                            </div>
                            <h5 style={{
                                fontSize: '1rem',
                                marginBottom: '8px',
                                color: 'var(--primary)',
                                fontWeight: '700'
                            }}>
                                {review.title}
                            </h5>
                            <p style={{
                                color: 'var(--text-medium)',
                                lineHeight: '1.6',
                                marginBottom: '16px',
                                fontSize: '0.9rem'
                            }}>
                                {review.text}
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{
                                    fontWeight: '600',
                                    color: 'var(--primary)',
                                    fontSize: '0.9rem'
                                }}>
                                    {review.name}
                                </span>
                                <div style={{ display: 'flex', gap: '4px', color: '#fbbf24' }}>
                                    {[...Array(review.rating)].map((_, i) => (
                                        <FaStar key={i} style={{ fontSize: '14px' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '40px'
                }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--primary)'
                    }} />
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--border-color)'
                    }} />
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--border-color)'
                    }} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
