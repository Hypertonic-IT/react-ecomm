import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt, FaCheckCircle, FaImage, FaTimes } from 'react-icons/fa';
import './ProductReviews.css';

const ProductReviews = ({ productId, userToken }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [canReview, setCanReview] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
        if (userToken) {
            checkReviewEligibility();
        }
    }, [productId, userToken]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/reviews/product/${productId}`);
            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews);
                setStats(data.stats);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setLoading(false);
        }
    };

    const checkReviewEligibility = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/reviews/can-review/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setCanReview(data.canReview);
            }
        } catch (error) {
            console.error('Error checking review eligibility:', error);
        }
    };

    const renderStars = (rating, size = 16) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} size={size} color="#fbbf24" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" size={size} color="#fbbf24" />);
        }
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} size={size} color="#d1d5db" />);
        }
        return stars;
    };

    const getRatingPercentage = (count) => {
        if (!stats || stats.totalReviews === 0) return 0;
        return (count / stats.totalReviews) * 100;
    };

    if (loading) {
        return <div className="reviews-loading">Loading reviews...</div>;
    }

    return (
        <div className="product-reviews-section">
            {/* Review Summary */}
            <div className="review-summary">
                <div className="summary-left">
                    <div className="average-rating">
                        <span className="rating-number">{stats?.averageRating?.toFixed(1) || '0.0'}</span>
                        <div className="rating-stars">
                            {renderStars(stats?.averageRating || 0, 20)}
                        </div>
                        <p className="total-reviews">{stats?.totalReviews || 0} reviews</p>
                    </div>
                </div>

                <div className="summary-right">
                    <div className="rating-breakdown">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="rating-bar-row">
                                <span className="rating-label">{rating} ⭐</span>
                                <div className="rating-bar-bg">
                                    <div
                                        className="rating-bar-fill"
                                        style={{ width: `${getRatingPercentage(stats?.[`rating${rating}`] || 0)}%` }}
                                    ></div>
                                </div>
                                <span className="rating-count">{stats?.[`rating${rating}`] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Write Review Button */}
            {userToken && canReview && (
                <div className="write-review-section">
                    <button
                        className="btn-write-review"
                        onClick={() => setShowReviewModal(true)}
                    >
                        <FaStar /> Write a Review
                    </button>
                </div>
            )}

            {!userToken && (
                <div className="review-login-prompt">
                    <p>Please log in to write a review</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                <h3 className="reviews-title">Customer Reviews ({reviews.length})</h3>

                {reviews.length === 0 ? (
                    <div className="empty-reviews">
                        <div className="empty-icon">⭐</div>
                        <h4>No reviews yet</h4>
                        <p>Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <ReviewCard key={review._id} review={review} renderStars={renderStars} />
                    ))
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <WriteReviewModal
                    productId={productId}
                    userToken={userToken}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={() => {
                        setShowReviewModal(false);
                        fetchReviews();
                    }}
                />
            )}
        </div>
    );
};

// Review Card Component
const ReviewCard = ({ review, renderStars }) => {
    return (
        <div className="review-card">
            <div className="review-header">
                <div className="reviewer-info">
                    <div className="reviewer-avatar">
                        {review.user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h4 className="reviewer-name">{review.maskedUserName || 'Anonymous'}</h4>
                        <div className="review-meta">
                            {renderStars(review.rating, 14)}
                            <span className="review-date">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                {review.isVerifiedPurchase && (
                    <div className="verified-badge">
                        <FaCheckCircle size={14} />
                        <span>Verified Purchase</span>
                    </div>
                )}
            </div>

            {review.title && <h5 className="review-title">{review.title}</h5>}

            <p className="review-comment">{review.comment}</p>

            {review.images && review.images.length > 0 && (
                <div className="review-images">
                    {review.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Review ${idx + 1}`} className="review-image" />
                    ))}
                </div>
            )}
        </div>
    );
};

// Write Review Modal Component
const WriteReviewModal = ({ productId, userToken, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            setError('Please write a review');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    product: productId,
                    rating,
                    title,
                    comment,
                    images
                })
            });

            const data = await response.json();

            if (data.success) {
                onSubmit();
            } else {
                setError(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Write a Review</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    {/* Star Rating */}
                    <div className="form-group">
                        <label>Your Rating *</label>
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className="star-button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <FaStar
                                        size={32}
                                        color={(hoverRating || rating) >= star ? '#fbbf24' : '#d1d5db'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label>Review Title (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                        />
                    </div>

                    {/* Comment */}
                    <div className="form-group">
                        <label>Your Review *</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Share your thoughts about this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            maxLength={1000}
                            required
                        />
                        <span className="char-count">{comment.length}/1000</span>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>

                    <p className="review-note">
                        Your review will be visible after admin approval.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ProductReviews;
