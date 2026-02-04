import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaCalendar, FaUser } from 'react-icons/fa';

// Sample blog data
const blogPosts = [
    {
        id: 1,
        title: 'How Technology is Transforming the Industry',
        excerpt: 'Advanced technology is revolutionizing the fashion industry, from production to retail.',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'
    },
    {
        id: 2,
        title: 'The Future of Fashion: How Technology Transforms the Industry',
        excerpt: 'Discover the ways in which technological fashion industry, from production to...',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'
    },
    {
        id: 3,
        title: 'From Concept to Closet: The Journey of Sustainable Fashion',
        excerpt: 'From initial design concepts to the final products in your wardrobe, and from sourcing eco-friendly materials...',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
    },
    {
        id: 4,
        title: 'Unlocking Style Potential: Personalization in Fashion Retail',
        excerpt: 'Learn how personalized shopping experiences are changing the landscape of online fashion...',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Trending',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'
    },
    {
        id: 5,
        title: 'Fashion Forward: Embracing Diversity and Inclusion in Design',
        excerpt: 'Understand the importance of diversity and inclusion in fashion design and how it is shaping...',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'
    },
    {
        id: 6,
        title: 'The Ultimate Guide: Dressing Stylishly on a Budget',
        excerpt: 'Learn how to look fashionable without breaking the bank with these expert tips.',
        author: 'Themesflat',
        date: '2024-02-28',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'
    }
];

const categories = ['Trending', 'Fashion', 'Sunglasses', 'Accessories', 'Beauty'];
const popularTags = ['t-shirt trends', 'sustainable fashion', 'Green Style', 'Beauty Tips', 'Street Style', 'Vintage fashion', 'Eco-Friendly', 'Fit'];

const BlogList = () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (

        <div style={{ backgroundColor: 'var(--white)', color: 'var(--text-dark)' }}>
            <TopBar />
            <Header />
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '35vh',
                minHeight: '250px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80")',
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
                    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '2.5rem',
                        marginBottom: '12px',
                        fontWeight: '700'
                    }}>
                        Blog Default
                    </h1>
                    <p style={{ fontSize: '0.95rem' }}>
                        Homepage &gt; Blog &gt; <span style={{ color: '#fff' }}>Blog Default</span>
                    </p>
                </div>
            </div>



            {/* Main Content */}
            <div className="container" style={{ padding: '60px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
                    {/* Left Column - Blog Posts */}
                    <div>
                        {blogPosts.map((post) => (
                            <div key={post.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '300px 1fr',
                                gap: '30px',
                                marginBottom: '50px',
                                paddingBottom: '50px',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                {/* Post Image */}
                                <Link to={`/blog/${post.id}`}>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        style={{
                                            width: '100%',
                                            height: '220px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Link>

                                {/* Post Content */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '12px',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-light)'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FaCalendar /> February 24, 2024
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FaUser /> by {post.author}
                                        </span>
                                    </div>

                                    <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '12px',
                                            color: 'var(--primary)',
                                            fontWeight: '700',
                                            lineHeight: '1.3'
                                        }}>
                                            {post.title}
                                        </h3>
                                    </Link>

                                    <p style={{
                                        color: 'var(--text-medium)',
                                        lineHeight: '1.6',
                                        marginBottom: '16px',
                                        fontSize: '0.95rem'
                                    }}>
                                        {post.excerpt}
                                    </p>

                                    <Link to={`/blog/${post.id}`} style={{
                                        color: 'var(--primary)',
                                        textDecoration: 'underline',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}>
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '40px'
                        }}>
                            <button style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--white)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>1</button>
                            <button style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--primary)',
                                color: 'var(--white)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>2</button>
                            <button style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--white)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>3</button>
                            <button style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--white)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>›</button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div>
                        {/* Search */}
                        <div style={{
                            marginBottom: '40px',
                            padding: '30px',
                            background: 'var(--off-white)',
                            borderRadius: '8px'
                        }}>
                            <input
                                type="text"
                                placeholder="Your email address"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    marginBottom: '12px'
                                }}
                            />
                            <button style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--primary)',
                                color: 'var(--white)',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                🔍
                            </button>
                        </div>

                        {/* Related Posts */}
                        <div style={{ marginBottom: '40px' }}>
                            <h4 style={{
                                fontSize: '1.3rem',
                                marginBottom: '20px',
                                color: 'var(--primary)',
                                fontWeight: '700'
                            }}>
                                Related Post
                            </h4>
                            {blogPosts.slice(0, 4).map((post) => (
                                <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px',
                                        marginBottom: '20px',
                                        paddingBottom: '20px',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '6px'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-light)',
                                                marginBottom: '6px'
                                            }}>
                                                <FaCalendar style={{ fontSize: '10px', marginRight: '4px' }} />
                                                February 28, 2024
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-light)',
                                                marginBottom: '8px'
                                            }}>
                                                by {post.author}
                                            </div>
                                            <h5 style={{
                                                fontSize: '0.9rem',
                                                color: 'var(--primary)',
                                                fontWeight: '600',
                                                lineHeight: '1.3'
                                            }}>
                                                {post.title.substring(0, 50)}...
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '40px' }}>
                            <h4 style={{
                                fontSize: '1.3rem',
                                marginBottom: '20px',
                                color: 'var(--primary)',
                                fontWeight: '700'
                            }}>
                                Categories
                            </h4>
                            {categories.map((category, idx) => (
                                <div key={idx} style={{
                                    padding: '12px 0',
                                    borderBottom: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    color: 'var(--text-dark)'
                                }}>
                                    {category}
                                </div>
                            ))}
                        </div>

                        {/* Popular Tags */}
                        <div>
                            <h4 style={{
                                fontSize: '1.3rem',
                                marginBottom: '20px',
                                color: 'var(--primary)',
                                fontWeight: '700'
                            }}>
                                Popular Tag
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {popularTags.map((tag, idx) => (
                                    <span key={idx} style={{
                                        padding: '8px 16px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--primary)';
                                            e.currentTarget.style.color = 'var(--white)';
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-dark)';
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                        }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BlogList;
