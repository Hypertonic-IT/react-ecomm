import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaCalendar, FaUser, FaSearch, FaChevronRight, FaChevronLeft, FaHeart, FaComment, FaEnvelope, FaThumbTack } from 'react-icons/fa';
import { API_BASE_URL, BASE_URL, getImageUrl } from '../../../../../config';

const categories = ['Fashion', 'Lifestyle', 'Technology', 'Beauty', 'Accessories'];

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [email, setEmail] = useState('');
    const [popularSlide, setPopularSlide] = useState(0);

    useEffect(() => {
        fetchBlogs();
        fetchPopularBlogs();
    }, [page]);

    useEffect(() => {
        filterBlogs();
    }, [blogs, searchQuery, selectedCategory]);

    // Auto-slide for Most Popular
    useEffect(() => {
        const timer = setInterval(() => {
            if (popularBlogs.length > 0) {
                setPopularSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(popularBlogs.length / 4)));
            }
        }, 4000);
        return () => clearInterval(timer);
    }, [popularBlogs.length]);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/blogs?pageNumber=${page}&status=published`);
            const data = await res.json();
            setBlogs(data.blogs || []);
            setPages(data.pages || 1);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs", error);
            setLoading(false);
        }
    };

    const fetchPopularBlogs = async () => {
        try {
            // Fetch popular blogs specifically
            const res = await fetch(`${API_BASE_URL}/blogs?status=published&isPopular=true`);
            const data = await res.json();
            setPopularBlogs(data.blogs || []);
        } catch (error) {
            console.error("Error fetching popular blogs", error);
        }
    };

    const filterBlogs = () => {
        let filtered = [...blogs];

        if (searchQuery) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(blog =>
                blog.category && blog.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredBlogs(filtered);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        filterBlogs();
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert(`Subscribed with: ${email}`);
        setEmail('');
    };


    const totalSlides = Math.ceil(popularBlogs.length / 4);

    return (
        <div style={{ backgroundColor: '#fff', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
            <TopBar />
            <Header />

            {/* 1. HERO / INTRO SECTION - Blog */}
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
                    backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80")',
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
                        OUR BLOG
                    </h1>
                    <div style={{ width: '60px', height: '3px', background: '#fff', margin: '0 auto 24px' }}></div>
                    <p style={{
                        fontSize: '1.25rem',
                        fontWeight: '300',
                        color: '#e0e0e0',
                        letterSpacing: '0.5px'
                    }}>
                        Latest trends, style tips, and fashion inspiration.
                    </p>
                </div>
            </div>

            {/* Search Bar Container - formerly at Top */}
            <div style={{
                background: '#f9f9f9',
                borderBottom: '1px solid #eee'
            }}>
                <div style={{
                    padding: '30px 20px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <input
                            type="text"
                            placeholder="Search for the latest trends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 50px 14px 20px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '0.95rem',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" style={{
                            position: 'absolute',
                            right: '6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: '#1a1a1a',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#fff',
                            fontSize: '0.85rem',
                            padding: '10px 24px',
                            borderRadius: '3px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            SEARCH
                        </button>
                    </form>
                </div>
            </div>

            {/* Most Popular Section - SLIDER */}
            <div style={{
                padding: '60px 20px 40px',
                maxWidth: '1200px',
                margin: '0 auto',
                borderBottom: '1px solid #f0f0f0',
                position: 'relative'
            }}>
                <h2 style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: '#333'
                }}>
                    Most Popular
                </h2>

                {/* Slider Container */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease',
                        transform: `translateX(-${popularSlide * 100}%)`
                    }}>
                        {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                            <div key={slideIdx} style={{
                                minWidth: '100%',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '20px'
                            }}>
                                {popularBlogs.slice(slideIdx * 4, slideIdx * 4 + 4).map((post) => (
                                    <Link
                                        key={post._id}
                                        to={`/blog/${post._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '160px',
                                            overflow: 'hidden',
                                            marginBottom: '12px',
                                            background: '#f5f5f5'
                                        }}>
                                            {post.image ? (
                                                <img
                                                    src={getImageUrl(post.image)}
                                                    alt={post.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#e0e0e0' }}></div>
                                            )}
                                        </div>
                                        <h4 style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '400',
                                            color: '#333',
                                            lineHeight: '1.4',
                                            textAlign: 'center'
                                        }}>
                                            {post.title}
                                        </h4>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Slider Navigation Arrows */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={() => setPopularSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
                                style={{
                                    position: 'absolute',
                                    left: '-15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={() => setPopularSlide((prev) => (prev + 1) % totalSlides)}
                                style={{
                                    position: 'absolute',
                                    right: '-15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                </div>

                {/* Slider Dots */}
                {totalSlides > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '20px'
                    }}>
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPopularSlide(idx)}
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: popularSlide === idx ? '#1a1a1a' : '#ddd',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>

                    {/* LEFT COLUMN - Blog Posts */}
                    <div>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Loading...</p>
                        ) : filteredBlogs.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '60px', color: '#999' }}>No blog posts found.</p>
                        ) : (
                            <>
                                {/* Blog Posts Grid - 2 columns */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '60px' }}>
                                    {filteredBlogs.map((post) => (
                                        <Link
                                            key={post._id}
                                            to={`/blog/${post._id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div style={{
                                                width: '100%',
                                                height: '200px',
                                                overflow: 'hidden',
                                                marginBottom: '15px',
                                                background: '#f5f5f5'
                                            }}>
                                                {post.image ? (
                                                    <img
                                                        src={getImageUrl(post.image)}
                                                        alt={post.title}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.5s'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', background: '#e0e0e0' }}></div>
                                                )}
                                            </div>

                                            {/* Category Tag */}
                                            {post.category && (
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    color: '#00bcd4',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    marginBottom: '8px',
                                                    fontStyle: 'italic'
                                                }}>
                                                    in {post.category}
                                                </div>
                                            )}

                                            <h3 style={{
                                                fontSize: '1.1rem',
                                                marginBottom: '10px',
                                                color: '#333',
                                                fontWeight: '400',
                                                lineHeight: '1.4'
                                            }}>
                                                {post.title}
                                            </h3>

                                            {/* Date and Comments */}
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#999',
                                                marginBottom: '12px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'} - 3 COMMENTS
                                            </div>

                                            <p style={{
                                                color: '#666',
                                                lineHeight: '1.6',
                                                fontSize: '0.85rem',
                                                marginBottom: '12px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
                                            </p>

                                            {/* Social Icons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '12px',
                                                fontSize: '0.9rem',
                                                color: '#999',
                                                paddingTop: '12px',
                                                borderTop: '1px solid #f0f0f0'
                                            }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <FaHeart /> 40
                                                </span>
                                                <span>📘</span>
                                                <span>🐦</span>
                                                <span>📌</span>
                                                <span>✉️</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        paddingTop: '40px',
                                        borderTop: '1px solid #f0f0f0'
                                    }}>
                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            style={{
                                                padding: '8px 12px',
                                                border: '1px solid #ddd',
                                                background: page === 1 ? '#f5f5f5' : '#fff',
                                                color: page === 1 ? '#ccc' : '#333',
                                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <FaChevronLeft style={{ fontSize: '0.7rem' }} />
                                        </button>

                                        {[...Array(pages).keys()].map(x => (
                                            <button
                                                key={x + 1}
                                                onClick={() => setPage(x + 1)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    border: page === x + 1 ? 'none' : '1px solid #ddd',
                                                    background: page === x + 1 ? '#1a1a1a' : '#fff',
                                                    color: page === x + 1 ? '#fff' : '#333',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {x + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setPage(Math.min(pages, page + 1))}
                                            disabled={page === pages}
                                            style={{
                                                padding: '8px 12px',
                                                border: '1px solid #ddd',
                                                background: page === pages ? '#f5f5f5' : '#fff',
                                                color: page === pages ? '#ccc' : '#333',
                                                cursor: page === pages ? 'not-allowed' : 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <FaChevronRight style={{ fontSize: '0.7rem' }} />
                                        </button>
                                    </div>
                                )}

                                {/* Load More Button */}
                                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                    <button style={{
                                        padding: '12px 40px',
                                        border: '1px solid #ddd',
                                        background: '#fff',
                                        color: '#333',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        LOAD MORE +
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div>
                        {/* About Section */}
                        <div style={{
                            marginBottom: '50px',
                            textAlign: 'center',
                            padding: '30px',
                            background: '#fafafa',
                            borderRadius: '4px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: '#ddd',
                                margin: '0 auto 20px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                                    alt="About"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '15px',
                                color: '#333'
                            }}>
                                ABOUT
                            </h3>
                            <p style={{
                                fontSize: '0.85rem',
                                color: '#666',
                                lineHeight: '1.6'
                            }}>
                                Welcome to our fashion blog! Discover the latest trends, style tips, and fashion inspiration.
                            </p>
                        </div>

                        {/* Newsletter */}
                        <div style={{
                            marginBottom: '50px',
                            padding: '30px',
                            background: '#fafafa',
                            borderRadius: '4px'
                        }}>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '15px',
                                color: '#333',
                                textAlign: 'center'
                            }}>
                                NEWSLETTER
                            </h3>
                            <p style={{
                                fontSize: '0.85rem',
                                color: '#666',
                                lineHeight: '1.6',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                Subscribe to get the latest updates and exclusive offers.
                            </p>
                            <form onSubmit={handleNewsletterSubmit}>
                                <input
                                    type="email"
                                    placeholder="Your email address..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        marginBottom: '10px',
                                        outline: 'none'
                                    }}
                                />
                                <button type="submit" style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#1a1a1a',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    SUBSCRIBE
                                </button>
                            </form>
                        </div>

                        {/* Latest Posts (instead of Instagram) */}
                        <div style={{ marginBottom: '50px' }}>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '20px',
                                color: '#333',
                                textAlign: 'center',
                                padding: '15px',
                                border: '1px solid #ddd'
                            }}>
                                LATEST POSTS
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {blogs.slice(0, 4).map((post) => (
                                    <Link
                                        key={post._id}
                                        to={`/blog/${post._id}`}
                                        style={{
                                            display: 'flex',
                                            gap: '15px',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            paddingBottom: '20px',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            flexShrink: 0,
                                            background: '#f5f5f5',
                                            overflow: 'hidden'
                                        }}>
                                            {post.image ? (
                                                <img
                                                    src={getImageUrl(post.image)}
                                                    alt={post.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#e0e0e0' }}></div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                fontSize: '0.9rem',
                                                fontWeight: '400',
                                                color: '#333',
                                                lineHeight: '1.4',
                                                marginBottom: '8px'
                                            }}>
                                                {post.title}
                                            </h4>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#999',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '50px' }}>
                            <h3 style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '20px',
                                color: '#333'
                            }}>
                                CATEGORIES
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {categories.map((cat, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '12px 0',
                                            borderBottom: '1px solid #f0f0f0',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            color: selectedCategory === cat ? '#1a1a1a' : '#666',
                                            fontWeight: selectedCategory === cat ? '600' : '400',
                                            transition: 'color 0.3s'
                                        }}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div >
    );
};

export default BlogList;
