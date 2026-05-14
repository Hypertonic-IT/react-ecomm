
import React, { useState, useEffect } from 'react';
import { FaUserShield, FaSearch, FaEnvelope, FaTrash, FaPlus, FaTimes, FaUserEdit } from 'react-icons/fa';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';
import { API_BASE_URL, BASE_URL } from 'config';

const StaffList = () => {
    const { token } = useAdminAuth();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'product_manager',
        isAdmin: true
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'product_manager', label: 'Product Manager' },
        { value: 'sales_manager', label: 'Sales Manager' },
        { value: 'marketing_manager', label: 'Marketing Manager' }
    ];

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).emailOrMobile : ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter only staff roles
                const staffOnly = data.filter(u =>
                    u.isAdmin || ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(u.role)
                );
                setStaff(staffOnly);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/users/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).emailOrMobile : ''
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setShowAddModal(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'product_manager',
                    isAdmin: true
                });
                fetchStaff();
            } else {
                setError(data.message || 'Failed to add staff member');
            }
        } catch (error) {
            setError('Server error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).emailOrMobile : ''
                }
            });
            if (response.ok) {
                fetchStaff();
            }
        } catch (error) {
            console.error("Error deleting staff:", error);
        }
    };

    const filteredStaff = staff.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.emailOrMobile && user.emailOrMobile.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentStaff = filteredStaff.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Staff Management</h1>
                    <p className="admin-page-subtitle">Manage administrative users and their permissions</p>
                </div>
                <button
                    className="admin-btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    <FaPlus /> Add Staff Member
                </button>
            </div>

            <div className="table-container">
                <div className="table-toolbar">
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
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search staff..."
                            className="search-input-modern"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                        <FaSearch className="search-icon-modern" />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading staff members...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Staff Member</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStaff.length > 0 ? currentStaff.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="avatar-circle">
                                                    <FaUserShield />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>ID: {user._id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.role === 'super_admin' ? 'status-danger' : 'status-primary'}`}>
                                                {user.role ? user.role.replace('_', ' ').toUpperCase() : 'ADMIN'}
                                            </span>
                                        </td>
                                        <td>{user.emailOrMobile}</td>
                                        <td>
                                            <span className="status-badge status-success">Active</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button className="admin-btn-icon" title="Edit Permissions">
                                                    <FaUserEdit />
                                                </button>
                                                <button
                                                    className="admin-btn-icon-danger"
                                                    title="Remove Staff"
                                                    onClick={() => handleDeleteStaff(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="empty-table-row">No staff members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredStaff.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Add Staff Member</h2>
                            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddStaff}>
                            <div className="modal-body">
                                {error && <div className="admin-auth-error" style={{ marginBottom: '16px' }}>{error}</div>}

                                <div className="form-field">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="email@kayaroop.com"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Temporary Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>Assigned Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="admin-select-native"
                                    >
                                        {roles.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field-checkbox">
                                    <input
                                        type="checkbox"
                                        id="isAdmin"
                                        name="isAdmin"
                                        checked={formData.isAdmin}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="isAdmin">Grant Admin Panel Access</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="admin-btn-secondary" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn-primary" disabled={saving}>
                                    {saving ? 'Creating...' : 'Invite Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffList;
