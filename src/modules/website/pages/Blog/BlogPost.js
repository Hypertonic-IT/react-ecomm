import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import TopBar from '../../components/TopBar/TopBar';
import { FaCalendar, FaUser, FaFacebook, FaTwitter, FaLinkedin, FaPinterest, FaChevronRight } from 'react-icons/fa';
import DOMPurify from 'dompurify';
const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/blogs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);

                    // Fetch related posts
                    const relatedRes = await fetch(`http://localhost:5001/api/blogs?status=published&limit=3`);
                    if (relatedRes.ok) {
                        const relatedData = await relatedRes.json();
                        setRelatedPosts(relatedData.blogs?.filter(b => b._id !== id).slice(0, 3) || []);
                    }
                } else {
                    console.error("Post not found");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return (
        <div style={{ padding: '100px 20px', textAlign: 'center', color: '#999' }}>
            <TopBar />
            <Header />
            Loading...
        </div>
    );

    if (!post) return (
        <div style={{ padding: '100px 20px', textAlign: 'center', color: '#999' }}>
            <TopBar />
            <Header />
            Blog post not found.
        </div>
    );

    return (
        <div style={{ backgroundColor: '#fff', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
            <TopBar />
            <Header />

            {/* Breadcrumb */}
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px 20px' }}>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>
                    <Link to="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
                    {' > '}
                    <Link to="/blog" style={{ color: '#999', textDecoration: 'none' }}>Blog</Link>
                    {' > '}
                    <span style={{ color: '#333' }}>{post.title}</span>
                </div>
            </div>

            {/* Article Container */}
            <article className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 80px' }}>

                {/* Featured Image */}
                {post.image && (
                    <div style={{ marginBottom: '40px' }}>
                        <img
                            src={post.image}
                            alt={post.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '500px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                )}

                {/* Meta Info */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    fontSize: '0.75rem',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</span>
                    {post.category && <span>• {post.category}</span>}
                    {post.author && <span>• By {post.author}</span>}
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    marginBottom: '30px',
                    color: '#1a1a1a',
                    lineHeight: '1.3',
                    letterSpacing: '0.5px'
                }}>
                    {post.title}
                </h1>

                {/* Article Content */}
                <div
                    style={{
                        color: '#444',
                        fontSize: '1.05rem',
                        lineHeight: '1.8',
                        marginBottom: '50px'
                    }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div style={{
                        padding: '30px 0',
                        borderTop: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: '40px'
                    }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Tags:
                            </span>
                            {post.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '6px 14px',
                                        background: '#f5f5f5',
                                        color: '#666',
                                        fontSize: '0.8rem',
                                        borderRadius: '3px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px'
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Share */}
                <div style={{
                    padding: '30px 0',
                    marginBottom: '40px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Share:
                        </span>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5998', fontSize: '1.2rem' }}>
                            <FaFacebook />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', fontSize: '1.2rem' }}>
                            <FaTwitter />
                        </a>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontSize: '1.2rem' }}>
                            <FaLinkedin />
                        </a>
                        <a href={`https://pinterest.com/pin/create/button/?url=${window.location.href}&description=${post.title}`} target="_blank" rel="noopener noreferrer" style={{ color: '#bd081c', fontSize: '1.2rem' }}>
                            <FaPinterest />
                        </a>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div style={{ marginTop: '60px' }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '300',
                            marginBottom: '30px',
                            color: '#1a1a1a',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Related Articles
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '30px'
                        }}>
                            {relatedPosts.map((article) => (
                                <Link
                                    key={article._id}
                                    to={`/blog/${article._id}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'block'
                                    }}
                                >
                                    <div style={{
                                        width: '100%',
                                        height: '180px',
                                        overflow: 'hidden',
                                        marginBottom: '15px',
                                        background: '#f5f5f5'
                                    }}>
                                        {article.image ? (
                                            <img
                                                src={article.image}
                                                alt={article.title}
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
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#999',
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                                    </div>
                                    <h4 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '400',
                                        color: '#1a1a1a',
                                        lineHeight: '1.4',
                                        marginBottom: '10px'
                                    }}>
                                        {article.title}
                                    </h4>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: '#1a1a1a',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        Read More <FaChevronRight style={{ fontSize: '0.7rem' }} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Blog */}
                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <Link
                        to="/blog"
                        style={{
                            display: 'inline-block',
                            padding: '12px 30px',
                            border: '1px solid #1a1a1a',
                            color: '#1a1a1a',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#1a1a1a';
                            e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#1a1a1a';
                        }}
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPost;
