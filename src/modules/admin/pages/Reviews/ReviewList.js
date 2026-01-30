import React, { useState, useEffect } from 'react';
import { FaStar, FaEye, FaCheck, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import '../../admin.css';
import './Reviews.css';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [filterStatus, filterRating, currentPage, entriesPerPage]);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const params = new URLSearchParams({
                status: filterStatus,
                page: currentPage,
                limit: entriesPerPage
            });

            if (filterRating !== 'all') {
                params.append('rating', filterRating);
            }

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const response = await fetch(`http://localhost:5001/api/reviews/admin?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

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

    const handleStatusUpdate = async (reviewId, newStatus) => {
        const confirmMessage = newStatus === 'approved'
            ? 'Are you sure you want to approve this review?'
            : 'Are you sure you want to reject this review?';

        if (!window.confirm(confirmMessage)) return;

        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await fetch(`http://localhost:5001/api/reviews/${reviewId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                fetchReviews();
                setShowDetailModal(false);
            }
        } catch (error) {
            console.error('Error updating review status:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await fetch(`http://localhost:5001/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchReviews();
                setShowDetailModal(false);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        size={14}
                        color={i < rating ? '#fbbf24' : '#d1d5db'}
                    />
                ))}
            </div>
        );
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved': return 'status-badge status-success';
            case 'rejected': return 'status-badge status-danger';
            case 'pending': return 'status-badge status-warning';
            default: return 'status-badge status-neutral';
        }
    };

    // Filter reviews based on search
    const filteredReviews = reviews.filter(review => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            review.comment?.toLowerCase().includes(searchLower) ||
            review.title?.toLowerCase().includes(searchLower) ||
            review.user?.name?.toLowerCase().includes(searchLower) ||
            review.product?.name?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="admin-page-container fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Product Reviews</h1>
                    <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                        Manage and moderate customer reviews
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="inventory-stats-grid">
                <div className="stat-card-coupon" onClick={() => setFilterStatus('all')}>
                    <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                        ⭐
                    </div>
                    <div>
                        <div className="stat-label">Total Reviews</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </div>

                <div className="stat-card-coupon" onClick={() => setFilterStatus('pending')}>
                    <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                        ⏳
                    </div>
                    <div>
                        <div className="stat-label">Pending</div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                </div>

                <div className="stat-card-coupon" onClick={() => setFilterStatus('approved')}>
                    <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#10b981' }}>
                        ✅
                    </div>
                    <div>
                        <div className="stat-label">Approved</div>
                        <div className="stat-value">{stats.approved}</div>
                    </div>
                </div>

                <div className="stat-card-coupon" onClick={() => setFilterStatus('rejected')}>
                    <div className="stat-icon-wrapper" style={{ background: '#fee2e2', color: '#ef4444' }}>
                        ❌
                    </div>
                    <div>
                        <div className="stat-label">Rejected</div>
                        <div className="stat-value">{stats.rejected}</div>
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="table-container" style={{ marginTop: '24px' }}>
                <div className="table-toolbar">
                    {/* Entries Select */}
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <AdminSelect
                            options={[
                                { value: 10, label: '10' },
                                { value: 25, label: '25' },
                                { value: 50, label: '50' }
                            ]}
                            value={entriesPerPage}
                            onChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
                            styles={{
                                control: (base) => ({ ...base, minHeight: '32px', width: '70px', fontSize: '12px' })
                            }}
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <div style={{ width: '150px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'rejected', label: 'Rejected' }
                                ]}
                                value={filterStatus}
                                onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
                                placeholder="Status"
                            />
                        </div>

                        <div style={{ width: '130px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'all', label: 'All Ratings' },
                                    { value: '5', label: '5 Stars' },
                                    { value: '4', label: '4 Stars' },
                                    { value: '3', label: '3 Stars' },
                                    { value: '2', label: '2 Stars' },
                                    { value: '1', label: '1 Star' }
                                ]}
                                value={filterRating}
                                onChange={(val) => { setFilterRating(val); setCurrentPage(1); }}
                                placeholder="Rating"
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews Table */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading reviews...
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">⭐</div>
                        <h3>No Reviews Found</h3>
                        <p>No reviews match your current filters</p>
                    </div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Review</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map(review => (
                                    <tr key={review._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={review.product?.image}
                                                    alt={review.product?.name}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                                                        {review.product?.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                                                        ₹{review.product?.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{review.user?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                                                    {review.user?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{renderStars(review.rating)}</td>
                                        <td>
                                            <div style={{ maxWidth: '300px' }}>
                                                {review.title && (
                                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                        {review.title}
                                                    </div>
                                                )}
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--admin-text-secondary)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {review.comment}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getStatusBadgeClass(review.status)}>
                                                {review.status}
                                            </span>
                                            {review.isVerifiedPurchase && (
                                                <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px' }}>
                                                    ✓ Verified
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                                <button
                                                    className="admin-btn-icon"
                                                    title="View Details"
                                                    onClick={() => {
                                                        setSelectedReview(review);
                                                        setShowDetailModal(true);
                                                    }}
                                                >
                                                    <FaEye />
                                                </button>
                                                {review.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="admin-btn-icon"
                                                            style={{ color: '#10b981' }}
                                                            title="Approve"
                                                            onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            className="admin-btn-danger"
                                                            title="Reject"
                                                            onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={stats.total}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Review Detail Modal */}
            {showDetailModal && selectedReview && (
                <ReviewDetailModal
                    review={selectedReview}
                    onClose={() => setShowDetailModal(false)}
                    onApprove={() => handleStatusUpdate(selectedReview._id, 'approved')}
                    onReject={() => handleStatusUpdate(selectedReview._id, 'rejected')}
                    onDelete={() => handleDelete(selectedReview._id)}
                    renderStars={renderStars}
                />
            )}
        </div>
    );
};

// Review Detail Modal Component
const ReviewDetailModal = ({ review, onClose, onApprove, onReject, onDelete, renderStars }) => {
    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Review Details</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Product Info */}
                    <div className="review-product-info">
                        <img src={review.product?.image} alt={review.product?.name} />
                        <div>
                            <h4>{review.product?.name}</h4>
                            <p>₹{review.product?.price}</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="review-user-info">
                        <div>
                            <strong>Reviewer:</strong> {review.user?.name}
                        </div>
                        <div>
                            <strong>Email:</strong> {review.user?.email}
                        </div>
                        <div>
                            <strong>Date:</strong> {new Date(review.createdAt).toLocaleString()}
                        </div>
                        {review.isVerifiedPurchase && (
                            <div style={{ color: '#10b981', fontWeight: 600 }}>
                                ✓ Verified Purchase
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="review-rating-section">
                        <strong>Rating:</strong>
                        <div style={{ marginTop: '8px' }}>
                            {renderStars(review.rating)}
                        </div>
                    </div>

                    {/* Review Content */}
                    {review.title && (
                        <div className="review-title-section">
                            <strong>Title:</strong>
                            <p>{review.title}</p>
                        </div>
                    )}

                    <div className="review-comment-section">
                        <strong>Review:</strong>
                        <p>{review.comment}</p>
                    </div>

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                        <div className="review-images-section">
                            <strong>Images:</strong>
                            <div className="review-images-grid">
                                {review.images.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    <div className="review-status-section">
                        <strong>Status:</strong>
                        <span className={`status-badge status-${review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'danger' : 'warning'}`}>
                            {review.status}
                        </span>
                    </div>
                </div>

                <div className="modal-actions">
                    {review.status === 'pending' && (
                        <>
                            <button className="btn-approve" onClick={onApprove}>
                                <FaCheck /> Approve
                            </button>
                            <button className="btn-reject" onClick={onReject}>
                                <FaTimes /> Reject
                            </button>
                        </>
                    )}
                    <button className="btn-delete" onClick={onDelete}>
                        Delete Review
                    </button>
                    <button className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewList;
