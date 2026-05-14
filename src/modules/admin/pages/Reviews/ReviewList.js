import React, { useState, useEffect } from 'react';
import { FaStar, FaEye, FaCheck, FaTimes, FaSearch, FaFilter, FaChevronDown, FaChevronRight, FaTrash } from 'react-icons/fa';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import '../../admin.css';
import '../Inventory/Inventory.css'; // Import Inventory styles for table consistency
import './Reviews.css';
import { API_BASE_URL, BASE_URL, getImageUrl } from 'config';

const ReviewList = () => {
    // ... rest of the code ...

    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [expandedReviews, setExpandedReviews] = useState(new Set());

    useEffect(() => {
        fetchReviews();
    }, [filterStatus, filterRating, currentPage, entriesPerPage]);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const adminUser = localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')) : null;

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

            const response = await fetch(`${API_BASE_URL}/reviews/admin?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': adminUser?.email || ''
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
        try {
            const token = localStorage.getItem('adminAuthToken');
            const adminUser = localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')) : null;

            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': adminUser?.email || ''
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                // Optimistic update or refetch
                setReviews(reviews.map(r => r._id === reviewId ? { ...r, status: newStatus } : r));
                // Update stats locally or refetch
                fetchReviews();
            } else {
                console.error("Failed to update status:", data.message);
                alert("Failed to update status: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error('Error updating review status:', error);
            alert("Error updating status");
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminAuthToken');
            const adminUser = localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')) : null;

            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': adminUser?.email || ''
                }
            });

            const data = await response.json();
            if (data.success) {
                setReviews(reviews.filter(r => r._id !== reviewId));
                fetchReviews(); // To update stats
            } else {
                alert("Failed to delete review: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert("Error deleting review");
        }
    };

    const toggleExpand = (reviewId) => {
        const newExpanded = new Set(expandedReviews);
        if (newExpanded.has(reviewId)) {
            newExpanded.delete(reviewId);
        } else {
            newExpanded.add(reviewId);
        }
        setExpandedReviews(newExpanded);
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

    // Filter reviews based on search (already handled by backend mostly, but keeping client side filter if needed for small lists)
    // The backend search is superior so relying on that via fetchReviews

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

            {/* Filters & Actions Bar - Above Table */}
            <div className="table-container" style={{ marginTop: '24px' }}>
                {/* Top Toolbar - Filters and Actions */}
                <div style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.05)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div className="search-container" style={{ width: '280px' }}>
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        {/* Status Filter */}
                        <div style={{ width: '180px' }}>
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

                        {/* Rating Filter */}
                        <div style={{ width: '180px' }}>
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

                {/* Bottom Toolbar - Entries Selector */}
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
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
                </div>

                {/* Reviews Table */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading reviews...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">⭐</div>
                        <h3>No Reviews Found</h3>
                        <p>No reviews match your current filters</p>
                    </div>
                ) : (
                    <>
                        <table className="admin-table inventory-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}></th>
                                    <th>Product</th>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Summary</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(review => {
                                    const isExpanded = expandedReviews.has(review._id);
                                    return (
                                        <React.Fragment key={review._id}>
                                            <tr className={isExpanded ? 'active-row' : ''} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(review._id)}>
                                                <td>
                                                    <button
                                                        className="expand-btn"
                                                        onClick={(e) => { e.stopPropagation(); toggleExpand(review._id); }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--admin-text-secondary)' }}
                                                    >
                                                        {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                                    </button>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img
                                                            src={getImageUrl(review.product?.image)}
                                                            alt={review.product?.name}
                                                            style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.9rem' }}>
                                                            {review.product?.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.9rem' }}>{review.user?.name}</div>
                                                </td>
                                                <td>{renderStars(review.rating)}</td>
                                                <td>
                                                    <div style={{
                                                        fontSize: '0.85rem',
                                                        color: 'var(--admin-text-secondary)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '200px'
                                                    }}>
                                                        {review.title || review.comment}
                                                    </div>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => {
                                                            const newStatus = review.status === 'approved' ? 'rejected' : 'approved';
                                                            handleStatusUpdate(review._id, newStatus);
                                                        }}
                                                        className={`status-badge ${review.status === 'approved' ? 'status-success' : 'status-neutral'}`}
                                                        style={{ border: 'none', cursor: 'pointer', minWidth: '70px', fontSize: '0.75rem' }}
                                                    >
                                                        {review.status === 'approved' ? 'Active' : 'Inactive'}
                                                    </button>
                                                    {review.status === 'pending' && <div style={{ fontSize: '0.65rem', color: '#f59e0b', marginTop: '2px' }}>Pending Review</div>}
                                                </td>
                                                <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        className="admin-btn-icon"
                                                        title="Delete"
                                                        onClick={() => handleDelete(review._id)}
                                                    >
                                                        <FaTrash size={14} color="#ef4444" />
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <tr className="variant-row">
                                                    <td colSpan="8" style={{ padding: '0 !important', background: 'var(--admin-bg-light)' }}>
                                                        <div style={{ padding: '20px 20px 20px 60px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                                                                <div>
                                                                    <div style={{ marginBottom: '15px' }}>
                                                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--admin-text)' }}>
                                                                            {review.title || 'Review Details'}
                                                                        </h4>
                                                                        <p style={{ color: 'var(--admin-text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                                                            {review.comment}
                                                                        </p>
                                                                    </div>

                                                                    {review.images && review.images.length > 0 && (
                                                                        <div>
                                                                            <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--admin-text)' }}>User Images</strong>
                                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                                {review.images.map((img, idx) => (
                                                                                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                                                                                        <img
                                                                                            src={img}
                                                                                            alt={`Review ${idx}`}
                                                                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                                                                        />
                                                                                    </a>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                                                                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--admin-text)', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Metadata</h5>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <span>User Email:</span>
                                                                            <span style={{ fontWeight: 500 }}>{review.user?.email || 'N/A'}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <span>Order Verified:</span>
                                                                            {review.isVerifiedPurchase ? (
                                                                                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><FaCheck size={10} /> Yes</span>
                                                                            ) : (
                                                                                <span>No</span>
                                                                            )}
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <span>Product Price:</span>
                                                                            <span>₹{review.product?.price}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <span>Review ID:</span>
                                                                            <span style={{ fontFamily: 'monospace' }}>{review._id.substring(0, 8)}...</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
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
        </div>
    );
};

export default ReviewList;
