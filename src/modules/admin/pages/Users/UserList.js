import React, { useState, useEffect } from 'react';
import { FaUser, FaSearch, FaEnvelope, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import AdminSelect from '../../components/AdminSelect'; // Added for entries select
import AdminPagination from '../../components/AdminPagination';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [saving, setSaving] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: 'weak',
        checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false
        }
    });

    const { token: adminAuthToken, user } = useAdminAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminAuthToken');
                const response = await fetch('http://localhost:5001/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '')
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        let checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        };

        if (checks.length) score++;
        if (checks.uppercase) score++;
        if (checks.lowercase) score++;
        if (checks.number) score++;

        let label = 'weak';
        if (score === 4) label = 'strong';
        else if (score >= 2) label = 'medium';

        setPasswordStrength({ score, label, checks });
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('adminAuthToken');
                const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'user-id': user?.email || (localStorage.getItem('adminAuthUser') ? JSON.parse(localStorage.getItem('adminAuthUser')).email : '')
                    }
                });

                if (response.ok) {
                    setUsers(users.filter(u => u._id !== userId));
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Use the signup endpoint which is public/available
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    mobile: formData.phone
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Customer added successfully');
                setShowAddModal(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: ''
                });
                // After adding, refresh the list
                // We need to re-fetch users. 
                // Since fetchUsers is defined inside useEffect, we can't call it here easily 
                // unless we move it out or trigger a reload.
                // For now, let's just trigger a window reload or a state update if we refactor.
                window.location.reload();
            } else {
                alert(data.message || 'Error adding customer');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('Failed to connect to server');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="table-container">
                {/* Standardized Toolbar */}
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

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <button
                            className="admin-btn-outline"
                            onClick={() => setShowAddModal(true)}
                        >
                            <FaPlus size={12} /> Add Customer
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading users...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Access Level</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length > 0 ? currentUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'var(--admin-bg)', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', color: 'var(--admin-text-secondary)'
                                                }}>
                                                    <FaUser size={14} />
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-secondary)' }}>
                                                <FaEnvelope size={12} />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className={`stock-indicator stock-${user.isAdmin ? 'low' : 'in'}`}></span>
                                                <span className={`status-badge ${user.isAdmin ? 'status-warning' : 'status-primary'}`}>
                                                    {user.isAdmin ? 'Admin' : 'Customer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="admin-btn-danger"
                                                title="Delete User"
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-muted)' }}>No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredUsers.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Add New Customer</h2>
                            <button
                                className="modal-close-btn"
                                onClick={() => setShowAddModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddCustomer}>
                            <div className="modal-body">
                                <div className="form-field" style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.75rem' }}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Doe"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem'
                                        }}
                                    />
                                </div>

                                <div className="form-field" style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.75rem' }}>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="john@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem'
                                        }}
                                    />
                                </div>

                                <div className="form-field" style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.75rem' }}>
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Minimum 8 characters"
                                        minLength="8"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem'
                                        }}
                                    />

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>
                                                    Password strength:
                                                </span>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    color: passwordStrength.label === 'strong' ? '#10b981' :
                                                        passwordStrength.label === 'medium' ? '#f59e0b' : '#ef4444'
                                                }}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>

                                            {/* Strength Bar */}
                                            <div style={{
                                                width: '100%',
                                                height: '4px',
                                                background: '#e2e8f0',
                                                borderRadius: '2px',
                                                overflow: 'hidden',
                                                marginBottom: '8px'
                                            }}>
                                                <div style={{
                                                    width: `${(passwordStrength.score / 4) * 100}%`,
                                                    height: '100%',
                                                    background: passwordStrength.label === 'strong' ? '#10b981' :
                                                        passwordStrength.label === 'medium' ? '#f59e0b' : '#ef4444',
                                                    transition: 'all 0.3s ease'
                                                }}></div>
                                            </div>

                                            {/* Requirements Checklist */}
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                                    <span style={{ color: passwordStrength.checks.length ? '#10b981' : '#94a3b8' }}>
                                                        {passwordStrength.checks.length ? '✓' : '○'}
                                                    </span>
                                                    At least 8 characters
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                                    <span style={{ color: passwordStrength.checks.uppercase ? '#10b981' : '#94a3b8' }}>
                                                        {passwordStrength.checks.uppercase ? '✓' : '○'}
                                                    </span>
                                                    One uppercase letter
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                                    <span style={{ color: passwordStrength.checks.lowercase ? '#10b981' : '#94a3b8' }}>
                                                        {passwordStrength.checks.lowercase ? '✓' : '○'}
                                                    </span>
                                                    One lowercase letter
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ color: passwordStrength.checks.number ? '#10b981' : '#94a3b8' }}>
                                                        {passwordStrength.checks.number ? '✓' : '○'}
                                                    </span>
                                                    One number
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="form-field" style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.75rem' }}>
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 234 567 8900"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-outline"
                                    disabled={saving}
                                >
                                    <FaPlus /> {saving ? 'Adding...' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
