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
    FaHandHoldingHeart,
    FaQuoteLeft,
    FaShippingFast,
    FaShieldAlt,
    FaUsers,
} from 'react-icons/fa';
import './AboutUs.css';

const PILLARS = [
    { icon: <FaTshirt />, title: 'Premium Fabric', desc: 'Hand-selected fibres engineered for breathable comfort and durability across every season.' },
    { icon: <FaAward />, title: 'Timeless Design', desc: 'Modern silhouettes and carefully curated palettes that transcend passing trends.' },
    { icon: <FaCheckCircle />, title: 'Fair Pricing', desc: 'A direct-to-consumer model that eliminates unnecessary agent markups — quality for less.' },
    { icon: <FaHandHoldingHeart />, title: 'Client First', desc: 'Dedicated customer representatives available around the clock for every query.' },
    { icon: <FaShippingFast />, title: 'Swift Delivery', desc: 'Streamlined logistics ensuring your order reaches you quickly and in perfect condition.' },
    { icon: <FaShieldAlt />, title: 'Guaranteed Quality', desc: 'Triple-inspection protocol at every stage before packaging and dispatch.' },
];

const TESTIMONIALS = [
    { quote: 'Kayaroop fabric quality is unmatched. Every piece feels premium from the first touch.', author: 'Riya M., Mumbai' },
    { quote: 'Their B2B programme made bulk sourcing effortless. The dedicated dashboard is a game changer.', author: 'Pradeep K., Delhi' },
    { quote: 'Style, comfort, and fair prices — Kayaroop checks every box. Won\'t shop anywhere else.', author: 'Sneha T., Pune' },
];

const AboutUs = () => {
    return (
        <div className="about-page">
            <Helmet>
                <title>About Us | Kayaroop</title>
                <meta name="description" content="Learn about Kayaroop — your trusted fashion destination for premium clothing, bulk purchasing capabilities, and exceptional style." />
            </Helmet>

            <TopBar />
            <Header />

            {/* ── 1. Hero ─────────────────────────────────────────── */}
            <section className="about-hero">
                <div className="about-hero-bg" />
                <div className="about-hero-content">
                    <p className="about-hero-eyebrow">Our Story</p>
                    <h1>About Us</h1>
                    <div className="about-hero-line" />
                    <p className="about-hero-sub">Crafted for style. Designed for comfort.<br />Tailored for commercial excellence.</p>
                </div>
                <div className="about-hero-scroll-hint">↓</div>
            </section>

            {/* ── 2. Brand Story ──────────────────────────────────── */}
            <section className="about-story-section">
                <div className="about-max-w">
                    <div className="about-story-grid">
                        <div className="about-story-text">
                            <span className="about-section-label">Who We Are</span>
                            <h2>Our Story</h2>
                            <p>
                                Kayaroop was born from a simple belief: everyone deserves to look and feel their best without compromising on quality.
                            </p>
                            <p>
                                We recognised a gap in the market for premium fashion that's both stylish and accessible. Too often, customers were forced to choose between great design and reasonable pricing. We set out to change that narrative.
                            </p>
                            <p>
                                Fashion is about confidence, self-expression, and premium texture. Every piece we create is designed with you in mind — combining modern trends with timeless comfort for the everyday individual and retail business partners alike.
                            </p>
                        </div>
                        <div className="about-story-image-wrap">
                            <div className="about-story-image-decoration" />
                            <img
                                src="https://images.unsplash.com/photo-1551488852-080175b22345?w=800&q=80"
                                alt="Our Brand Story"
                                className="about-story-image"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'; }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. Stats Band ───────────────────────────────────── */}
            <section className="about-stats-band">
                <div className="about-max-w">
                    <div className="about-stats-grid">
                        <div className="about-stat-item">
                            <h3>10k<span>+</span></h3>
                            <p>Happy Customers</p>
                        </div>
                        <div className="about-stat-item">
                            <h3>4.8<span>★</span></h3>
                            <p>Average Rating</p>
                        </div>
                        <div className="about-stat-item">
                            <h3>100<span>%</span></h3>
                            <p>Premium Quality</p>
                        </div>
                        <div className="about-stat-item">
                            <h3>24<span>/7</span></h3>
                            <p>Client Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. Mission & Vision ─────────────────────────────── */}
            <section className="about-mv-section">
                <div className="about-max-w">
                    <div className="about-section-header center">
                        <span className="about-section-label">Our Purpose</span>
                        <h2>Mission &amp; Vision</h2>
                        <div className="about-divider" />
                    </div>
                    <div className="about-mv-grid">
                        <div className="about-mv-card">
                            <div className="about-mv-icon"><FaHeart /></div>
                            <h3>Our Mission</h3>
                            <ul className="about-mv-list">
                                <li><FaCheckCircle /><span>Quality clothing engineered to last</span></li>
                                <li><FaCheckCircle /><span>Accessible premium retail and bulk pricing</span></li>
                                <li><FaCheckCircle /><span>Dedicated support for retail and B2B customers</span></li>
                            </ul>
                        </div>
                        <div className="about-mv-card">
                            <div className="about-mv-icon"><FaStar /></div>
                            <h3>Our Vision</h3>
                            <ul className="about-mv-list">
                                <li><FaCheckCircle /><span>To be the global standard for modern fashion</span></li>
                                <li><FaCheckCircle /><span>Inspiring confidence through flawless fits</span></li>
                                <li><FaCheckCircle /><span>Leading the apparel trade with integrity &amp; innovation</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. Pillars (Why Kayaroop?) ──────────────────────── */}
            <section className="about-pillars-section">
                <div className="about-max-w">
                    <div className="about-section-header center">
                        <span className="about-section-label">Our Edge</span>
                        <h2>Why Choose Kayaroop?</h2>
                        <p className="about-section-sub">We blend artisan attention-to-detail with supply chain intelligence to offer an unmatched experience.</p>
                        <div className="about-divider" />
                    </div>
                    <div className="about-pillars-grid">
                        {PILLARS.map((p, i) => (
                            <div className="about-pillar-card" key={i}>
                                <div className="about-pillar-icon">{p.icon}</div>
                                <h4>{p.title}</h4>
                                <p>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. Quality Promise (split) ──────────────────────── */}
            <section className="about-promise-section">
                <div className="about-promise-grid">
                    <div className="about-promise-image-pane" />
                    <div className="about-promise-content">
                        <span className="about-section-label" style={{ color: '#9ca3af' }}>Our Standard</span>
                        <h2>Quality You Can Feel</h2>
                        <p>
                            We believe quality shouldn't be a luxury — it should be a standard. From the first stitch to the final fold, every detail meets our uncompromising benchmark.
                        </p>
                        <div className="about-promise-items">
                            <div className="about-promise-item">
                                <h4>Material Selection</h4>
                                <p>Sourced from the finest mills for superior texture, strength, and longevity.</p>
                            </div>
                            <div className="about-promise-item">
                                <h4>Precision Tailoring</h4>
                                <p>Expert craftsmanship ensuring a consistent and comfortable fit for all silhouettes.</p>
                            </div>
                            <div className="about-promise-item">
                                <h4>Rigorous Quality Audit</h4>
                                <p>Triple-inspection protocol before packaging and dispatching to every customer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. Testimonials ─────────────────────────────────── */}
            <section className="about-testimonials-section">
                <div className="about-max-w">
                    <div className="about-section-header center">
                        <span className="about-section-label">What They Say</span>
                        <h2>Customer Stories</h2>
                        <div className="about-divider" />
                    </div>
                    <div className="about-testimonials-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <div className="about-testimonial-card" key={i}>
                                <FaQuoteLeft className="testimonial-quote-icon" />
                                <p className="testimonial-text">"{t.quote}"</p>
                                <p className="testimonial-author">— {t.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. Responsible Fashion ──────────────────────────── */}
            <section className="about-responsibility-section">
                <div className="about-responsibility-inner">
                    <div className="about-responsibility-icon"><FaLeaf /></div>
                    <div className="about-responsibility-text">
                        <span className="about-section-label" style={{ color: '#6b7280' }}>Sustainability</span>
                        <h2>Responsible Fashion</h2>
                        <p>
                            We are deeply committed to sustainable and ethical production. We partner exclusively with apparel manufacturers who champion safe working conditions, fair wages, and minimal environmental footprints.
                        </p>
                        <ul className="about-resp-points">
                            <li><FaCheckCircle /> Ethically sourced materials</li>
                            <li><FaCheckCircle /> Fair wage manufacturing partners</li>
                            <li><FaCheckCircle /> Reduced packaging waste programme</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── 9. Team / Values strip ──────────────────────────── */}
            <section className="about-values-strip">
                <div className="about-max-w">
                    <div className="about-values-grid">
                        <div className="about-value-item">
                            <FaUsers className="about-value-icon" />
                            <h4>Customer Obsessed</h4>
                            <p>Every decision is made with our customers at the centre.</p>
                        </div>
                        <div className="about-value-item">
                            <FaAward className="about-value-icon" />
                            <h4>Excellence Always</h4>
                            <p>We hold ourselves to the highest standard in everything we do.</p>
                        </div>
                        <div className="about-value-item">
                            <FaLeaf className="about-value-icon" />
                            <h4>Sustainably Minded</h4>
                            <p>Conscious choices today for a better planet tomorrow.</p>
                        </div>
                        <div className="about-value-item">
                            <FaHandHoldingHeart className="about-value-icon" />
                            <h4>Community First</h4>
                            <p>We grow by lifting everyone in our supply chain with us.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 10. CTA ─────────────────────────────────────────── */}
            <section className="about-cta-section">
                <div className="about-cta-inner">
                    <span className="about-section-label" style={{ color: '#9ca3af', marginBottom: '16px', display: 'block' }}>Ready to explore?</span>
                    <h2>Refine Your Wardrobe</h2>
                    <p>Discover the latest seasonal drops and premium wardrobe essentials.</p>
                    <div className="about-cta-actions">
                        <Link to="/products" className="about-cta-btn primary">
                            Explore Collection
                        </Link>
                        <Link to="/business" className="about-cta-btn secondary">
                            B2B Partnership
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;
