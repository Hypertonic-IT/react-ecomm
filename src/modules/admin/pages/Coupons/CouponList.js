import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaPlus, FaSearch, FaEdit, FaEye, FaToggleOn, FaToggleOff,
    FaTrash, FaPercentage, FaRupeeSign, FaCalendarAlt
} from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';
import './Coupons.css';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination'; // Added
import { API_BASE_URL, BASE_URL } from 'config';

const CouponList = () => {
    const { user } = useAdminAuth();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/coupons`);
            const data = await response.json();
            setCoupons(data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setLoading(false);
        }
    };

    // Get coupon status
    const getCouponStatus = (coupon) => {
        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);

        if (!coupon.isActive) return 'inactive';
        if (now < startDate) return 'upcoming';
        if (now > endDate) return 'expired';
        return 'active';
    };

    // Filter coupons
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.name.toLowerCase().includes(searchTerm.toLowerCase());

        const status = getCouponStatus(coupon);
        const matchesFilter = filterStatus === 'All' ||
            (filterStatus === 'Active' && status === 'active') ||
            (filterStatus === 'Expired' && status === 'expired') ||
            (filterStatus === 'Upcoming' && status === 'upcoming') ||
            (filterStatus === 'Inactive' && status === 'inactive');

        return matchesSearch && matchesFilter;
    });

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentCoupons = filteredCoupons.slice(indexOfFirstEntry, indexOfLastEntry);

    // Calculate stats
    const stats = {
        total: coupons.length,
        active: coupons.filter(c => getCouponStatus(c) === 'active').length,
        expired: coupons.filter(c => getCouponStatus(c) === 'expired').length,
        upcoming: coupons.filter(c => getCouponStatus(c) === 'upcoming').length
    };

    // Toggle coupon status
    const toggleCouponStatus = async (couponId, currentStatus) => {
        if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this coupon?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user ? localStorage.getItem('adminAuthToken') : ''}`,
                        'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '')
                    },
                    body: JSON.stringify({ isActive: !currentStatus })
                });

                if (response.ok) {
                    fetchCoupons();
                }
            } catch (error) {
                console.error("Error toggling coupon:", error);
            }
        }
    };

    // Delete coupon
    const deleteCoupon = async (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user ? localStorage.getItem('adminAuthToken') : ''}`,
                        'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '') // Fallback
                    }
                });

                if (response.ok) {
                    fetchCoupons();
                }
            } catch (error) {
                console.error("Error deleting coupon:", error);
            }
        }
    };

    return (
        <div className="admin-page-container fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Coupons</h1>
                    <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                        Create and manage discount codes
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="coupon-stats-grid">
                <div className="stat-card-coupon" onClick={() => setFilterStatus('All')}>
                    <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                        🎫
                    </div>
                    <div>
                        <div className="stat-label">Total Coupons</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </div>

                <div className="stat-card-coupon" onClick={() => setFilterStatus('Active')}>
                    <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#10b981' }}>
                        ✓
                    </div>
                    <div>
                        <div className="stat-label">Active</div>
                        <div className="stat-value">{stats.active}</div>
                    </div>
                </div>

                <div className="stat-card-coupon" onClick={() => setFilterStatus('Upcoming')}>
                    <div className="stat-icon-wrapper" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                        📅
                    </div>
                    <div>
                        <div className="stat-label">Upcoming</div>
                        <div className="stat-value">{stats.upcoming}</div>
                    </div>
                </div>

                <div className="stat-card-coupon" onClick={() => setFilterStatus('Expired')}>
                    <div className="stat-icon-wrapper" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                        ⏰
                    </div>
                    <div>
                        <div className="stat-label">Expired</div>
                        <div className="stat-value">{stats.expired}</div>
                    </div>
                </div>
            </div>

            {/* Action Bar & Table */}
            <div className="table-container" style={{ marginTop: '24px' }}>
                {/* Standardized Toolbar */}
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
                    {/* Add Entries Select */}
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

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by coupon code or name..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <div style={{ width: '180px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'All', label: 'All Status' },
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Upcoming', label: 'Upcoming' },
                                    { value: 'Expired', label: 'Expired' },
                                    { value: 'Inactive', label: 'Inactive' }
                                ]}
                                value={filterStatus}
                                onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
                                placeholder="Filter Status"
                            />
                        </div>
                    </div>

                    <Link to="/admin/coupons/new" className="admin-btn-outline">
                        <FaPlus size={12} /> Create Coupon
                    </Link>
                </div>

                {/* Coupons Table */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading coupons...
                    </div>
                ) : filteredCoupons.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎫</div>
                        <h3>No Coupons Found</h3>
                        <p>Create your first coupon to start offering discounts</p>
                        <Link to="/admin/coupons/new" className="admin-btn-outline">
                            <FaPlus /> Create First Coupon
                        </Link>
                    </div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Coupon Code</th>
                                    <th>Name</th>
                                    <th>Discount</th>
                                    <th>Validity</th>
                                    <th>Usage</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCoupons.map(coupon => {
                                    const status = getCouponStatus(coupon);
                                    const usagePercent = coupon.usageLimit > 0
                                        ? (coupon.usedCount / coupon.usageLimit) * 100
                                        : 0;

                                    return (
                                        <tr key={coupon._id} className={status === 'expired' ? 'expired-row' : ''}>
                                            <td>
                                                <div className="coupon-code-cell">
                                                    {coupon.code}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{coupon.name}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {coupon.discountType === 'percentage' ? (
                                                        <>
                                                            <FaPercentage size={12} color="#3b82f6" />
                                                            <span style={{ fontWeight: 600 }}>{coupon.discountValue}%</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaRupeeSign size={12} color="#10b981" />
                                                            <span style={{ fontWeight: 600 }}>₹{coupon.discountValue}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.75rem' }}>
                                                    <div>{new Date(coupon.startDate).toLocaleDateString()}</div>
                                                    <div style={{ color: 'var(--admin-text-secondary)' }}>
                                                        to {new Date(coupon.endDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="usage-cell">
                                                    <div className="usage-text">
                                                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                                    </div>
                                                    {coupon.usageLimit > 0 && (
                                                        <div className="usage-bar">
                                                            <div
                                                                className="usage-bar-fill"
                                                                style={{
                                                                    width: `${Math.min(usagePercent, 100)}%`,
                                                                    backgroundColor: usagePercent > 80 ? '#ef4444' : '#3b82f6'
                                                                }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span className={`stock-indicator stock-${status === 'active' ? 'in' :
                                                        status === 'upcoming' ? 'low' : 'out'
                                                        }`}></span>
                                                    <span className={`status-badge status-${status === 'active' ? 'success' :
                                                        status === 'upcoming' ? 'primary' :
                                                            status === 'expired' ? 'neutral' : 'danger'
                                                        }`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '6px' }}>
                                                    <Link
                                                        to={`/admin/coupons/${coupon._id}`}
                                                        className="admin-btn-icon"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                    <Link
                                                        to={`/admin/coupons/edit/${coupon._id}`}
                                                        className="admin-btn-icon"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                                                        className="admin-btn-icon"
                                                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {coupon.isActive ? <FaToggleOn color="#10b981" /> : <FaToggleOff />}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCoupon(coupon._id)}
                                                        className="admin-btn-danger"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredCoupons.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div >
    );
};

export default CouponList;
