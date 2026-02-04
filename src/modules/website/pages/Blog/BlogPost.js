import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaCalendar, FaUser, FaFacebook, FaTwitter, FaLinkedin, FaPinterest, FaInstagram } from 'react-icons/fa';

// Sample blog data
const blogPosts = [
    {
        id: 1,
        title: 'The Future of Fashion: How Technology Transforms the Industry',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
        content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <h2>How to deal with employee quitting</h2>
            
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
            
            <ul>
                <li>Research potential career options and industries that align with your interests and skills</li>
                <li>Update your resume and LinkedIn profile to reflect your current experience and achievements</li>
                <li>Network with professionals in your desired field through events, online communities, and informational interviews</li>
                <li>Consider pursuing additional education or certifications to enhance your qualifications</li>
                <li>Develop a job search strategy and set realistic goals for yourself</li>
            </ul>
            
            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
        `
    },
    {
        id: 2,
        title: 'How Technology is Transforming the Industry',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
        content: '<p>Technology is revolutionizing every aspect of the fashion industry...</p>'
    },
    {
        id: 3,
        title: 'From Concept to Closet: The Journey of Sustainable Fashion',
        author: 'Themesflat',
        date: '2024-02-24',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
        content: '<p>Sustainable fashion is more than just a trend...</p>'
    }
];

const relatedArticles = [
    {
        id: 1,
        title: 'Tips On How To Make Your Outfits Look More Expensive',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80'
    },
    {
        id: 2,
        title: 'The Future of Fashion: How Technology Transforms the Industry',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80'
    },
    {
        id: 3,
        title: 'Your Wardrobe From Day to Night',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80'
    }
];

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === parseInt(id)) || blogPosts[0];
    const [comment, setComment] = useState({ name: '', email: '', message: '' });

    const comments = [
        {
            name: 'Arlene McCoy',
            date: 'February 24, 2024',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            avatar: 'AM'
        },
        {
            name: 'Annette Black',
            date: 'February 24, 2024',
            text: 'Great article! Very informative.',
            avatar: 'AB'
        }
    ];

    return (
        <div style={{ backgroundColor: 'var(--white)', color: 'var(--text-dark)' }}>
            <TopBar />
            <Header />

            {/* Hero Image */}
            <div className="container" style={{ padding: '40px 0' }}>
                <img
                    src={post.image}
                    alt={post.title}
                    style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="container" style={{ padding: '0 0 80px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Article Header */}
                    <div style={{
                        background: 'var(--white)',
                        padding: '40px',
                        borderRadius: '12px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            color: 'var(--text-light)'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaCalendar /> February 24, 2024
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaUser /> by {post.author}
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '2.5rem',
                            marginBottom: '30px',
                            color: 'var(--primary)',
                            fontFamily: 'var(--font-heading)',
                            lineHeight: '1.2',
                            fontWeight: '700'
                        }}>
                            {post.title}
                        </h1>

                        {/* Article Content */}
                        <div
                            style={{
                                color: 'var(--text-dark)',
                                lineHeight: '1.8',
                                fontSize: '1rem'
                            }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                            className="blog-content"
                        />

                        {/* Image Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            margin: '40px 0'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                                alt="Fashion"
                                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <img
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
                                alt="Fashion"
                                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>

                        {/* Tags and Share */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '30px',
                            borderTop: '1px solid var(--border-color)',
                            marginTop: '40px',
                            flexWrap: 'wrap',
                            gap: '20px'
                        }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Tags:</span>
                                {['Fashion', 'Lifestyle', 'Travel'].map((tag, idx) => (
                                    <span key={idx} style={{
                                        padding: '6px 14px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Share:</span>
                                <FaFacebook style={{ fontSize: '18px', cursor: 'pointer', color: 'var(--text-light)' }} />
                                <FaTwitter style={{ fontSize: '18px', cursor: 'pointer', color: 'var(--text-light)' }} />
                                <FaLinkedin style={{ fontSize: '18px', cursor: 'pointer', color: 'var(--text-light)' }} />
                                <FaPinterest style={{ fontSize: '18px', cursor: 'pointer', color: 'var(--text-light)' }} />
                                <FaInstagram style={{ fontSize: '18px', cursor: 'pointer', color: 'var(--text-light)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Post Navigation */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '60px',
                        gap: '20px'
                    }}>
                        <div style={{ flex: 1, cursor: 'pointer' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '8px' }}>
                                ← PREVIOUS POST
                            </div>
                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                                Eco-Friendly office: Green...
                            </div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right', cursor: 'pointer' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '8px' }}>
                                NEXT POST →
                            </div>
                            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                                Staying productive in a 24/7 work...
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div style={{ marginBottom: '60px' }}>
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '30px',
                            color: 'var(--primary)',
                            fontWeight: '700'
                        }}>
                            03 Comments
                        </h3>

                        {comments.map((comment, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                gap: '20px',
                                marginBottom: '30px',
                                paddingBottom: '30px',
                                borderBottom: idx < comments.length - 1 ? '1px solid var(--border-color)' : 'none'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: 'var(--white)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    flexShrink: 0
                                }}>
                                    {comment.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <h5 style={{
                                            fontSize: '1.1rem',
                                            color: 'var(--primary)',
                                            fontWeight: '700'
                                        }}>
                                            {comment.name}
                                        </h5>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-light)'
                                        }}>
                                            {comment.date}
                                        </span>
                                    </div>
                                    <p style={{
                                        color: 'var(--text-medium)',
                                        lineHeight: '1.6',
                                        marginBottom: '12px'
                                    }}>
                                        {comment.text}
                                    </p>
                                    <button style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Leave Comment Form */}
                    <div style={{
                        background: 'var(--off-white)',
                        padding: '40px',
                        borderRadius: '12px',
                        marginBottom: '60px'
                    }}>
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '30px',
                            color: 'var(--primary)',
                            fontWeight: '700'
                        }}>
                            Leave A Comment
                        </h3>

                        <form>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                marginBottom: '20px'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    style={{
                                        padding: '14px 16px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email *"
                                    style={{
                                        padding: '14px 16px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <textarea
                                placeholder="Your Comment"
                                rows="6"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    marginBottom: '20px',
                                    resize: 'vertical'
                                }}
                            />
                            <button style={{
                                padding: '14px 40px',
                                background: 'var(--primary)',
                                color: 'var(--white)',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.95rem'
                            }}>
                                Submit Comment
                            </button>
                        </form>
                    </div>

                    {/* Related Articles */}
                    <div>
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '30px',
                            color: 'var(--primary)',
                            fontWeight: '700',
                            textAlign: 'center'
                        }}>
                            Related Articles
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '30px'
                        }}>
                            {relatedArticles.map((article) => (
                                <Link key={article.id} to={`/blog/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                        }}>
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                        />
                                        <div style={{ padding: '20px' }}>
                                            <h5 style={{
                                                fontSize: '1rem',
                                                color: 'var(--primary)',
                                                fontWeight: '600',
                                                lineHeight: '1.4'
                                            }}>
                                                {article.title}
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style>{`
                .blog-content h2 {
                    font-size: 1.6rem;
                    color: var(--primary);
                    margin-top: 30px;
                    margin-bottom: 16px;
                    font-weight: 700;
                }
                .blog-content p {
                    margin-bottom: 16px;
                    color: var(--text-medium);
                }
                .blog-content ul {
                    margin: 20px 0;
                    padding-left: 30px;
                }
                .blog-content li {
                    margin-bottom: 10px;
                    color: var(--text-medium);
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
