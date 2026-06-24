import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaBriefcase, FaChevronDown, FaCheck, FaTimes, FaToggleOn, FaToggleOff, FaEllipsisV } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import '../../admin.css';
import { API_BASE_URL } from 'config';

// Dropdown action menu component
const ActionMenu = ({ app, onUpdateStatus, onToggleActive, onDelete }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const actions = [];
    if (app.status === 'pending') {
        actions.push({ label: '✓ Approve', action: () => { onUpdateStatus(app._id, 'approved'); setOpen(false); }, color: '#16a34a' });
        actions.push({ label: '✕ Reject', action: () => { onUpdateStatus(app._id, 'rejected'); setOpen(false); }, color: '#dc2626' });
    } else if (app.status === 'rejected') {
        actions.push({ label: '↩ Re-review (Pending)', action: () => { onUpdateStatus(app._id, 'pending'); setOpen(false); }, color: '#d97706' });
        actions.push({ label: '✓ Approve', action: () => { onUpdateStatus(app._id, 'approved'); setOpen(false); }, color: '#16a34a' });
    } else if (app.status === 'approved') {
        actions.push({ label: '✕ Revoke Approval', action: () => { onUpdateStatus(app._id, 'rejected'); setOpen(false); }, color: '#dc2626' });
    }
    actions.push({
        label: app.isActive === false ? '▶ Activate Account' : '⏸ Deactivate Account',
        action: () => { onToggleActive(app._id, app.isActive !== false); setOpen(false); },
        color: app.isActive === false ? '#16a34a' : '#6b7280'
    });
    actions.push({
        label: '🗑️ Delete Application',
        action: () => { onDelete(app._id); setOpen(false); },
        color: '#dc2626'
    });

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    background: 'var(--admin-card-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--admin-text)',
                    whiteSpace: 'nowrap'
                }}
                title="Actions"
            >
                <FaEllipsisV size={12} /> Actions <FaChevronDown size={10} />
            </button>
            {open && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '4px',
                    background: 'var(--admin-card-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    minWidth: '190px',
                    overflow: 'hidden'
                }}>
                    {actions.map((a, i) => (
                        <button
                            key={i}
                            onClick={a.action}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 16px',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: a.color,
                                borderBottom: i < actions.length - 1 ? '1px solid var(--admin-border)' : 'none',
                                transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => e.target.style.background = 'var(--admin-hover-bg, #f1f5f9)'}
                            onMouseLeave={e => e.target.style.background = 'none'}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const BusinessApplicationsList = () => {
    const { user } = useAdminAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [appsPerPage, setAppsPerPage] = useState(10);

    const getToken = () => localStorage.getItem('adminAuthToken');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/business/applications`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'user-id': user?.email || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const updateStatus = async (id, status) => {
        if (!window.confirm(`Change this application's status to "${status}"?`)) return;
        try {
            const response = await fetch(`${API_BASE_URL}/business/applications/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                    'user-id': user?.email || ''
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchApplications();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to update status');
            }
        } catch (error) {
            alert('Network error updating status');
        }
    };

    const toggleActive = async (id, makeInactive) => {
        // We use the status update endpoint to toggle the user's active state via isActive flag
        try {
            const response = await fetch(`${API_BASE_URL}/business/applications/${id}/active`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                    'user-id': user?.email || ''
                },
                body: JSON.stringify({ isActive: !makeInactive })
            });
            if (response.ok) {
                fetchApplications();
            } else {
                const err = await response.json().catch(() => ({}));
                alert(err.message || 'Failed to toggle status');
            }
        } catch (error) {
            alert('Network error');
        }
    };

    const deleteApplication = async (id) => {
        if (!window.confirm('Are you sure you want to completely delete this business application? This action cannot be undone.')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/business/applications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'user-id': user?.email || ''
                }
            });
            if (response.ok) {
                fetchApplications();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to delete application');
            }
        } catch (error) {
            alert('Network error deleting application');
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch =
            (app.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.phone || '').includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastApp = currentPage * appsPerPage;
    const indexOfFirstApp = indexOfLastApp - appsPerPage;
    const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'status-success';
            case 'rejected': return 'status-danger';
            default: return 'status-warning';
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ marginBottom: '25px' }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaBriefcase /> B2B Business Applications
                </h1>
            </div>

            <div className="table-container">
                {/* Toolbar */}
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <AdminSelect
                            options={[
                                { value: 10, label: '10' },
                                { value: 25, label: '25' },
                                { value: 50, label: '50' }
                            ]}
                            value={appsPerPage}
                            onChange={(val) => { setAppsPerPage(val); setCurrentPage(1); }}
                            styles={{ control: (base) => ({ ...base, minHeight: '32px', width: '70px', fontSize: '12px' }) }}
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="filter-wrapper">
                            <AdminSelect
                                options={[
                                    { value: 'all', label: 'All Statuses' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'rejected', label: 'Rejected' }
                                ]}
                                value={statusFilter}
                                onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                                styles={{ control: (base) => ({ ...base, minHeight: '32px', width: '150px', fontSize: '12px' }) }}
                                isSearchable={false}
                            />
                        </div>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search applications..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading business applications...</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="b2b-table-wrap">
                            <table className="admin-table b2b-applications-table">
                                <thead>
                                    <tr>
                                        <th>Business Details</th>
                                        <th>Contact Info</th>
                                        <th>GST / Type</th>
                                        <th>Location</th>
                                        <th>Req./Month</th>
                                        <th>App. Status</th>
                                        <th>Account</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentApps.length > 0 ? (
                                        currentApps.map(app => (
                                            <tr key={app._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{app.business_name}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                                                        {app.user_id?.name || 'Unknown'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{app.contact_person}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{app.email}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{app.phone}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.gst_number || '—'}</div>
                                                    <span className="status-badge status-primary" style={{ fontSize: '0.7rem', marginTop: '4px', display: 'inline-block' }}>{app.business_type}</span>
                                                </td>
                                                <td style={{ fontSize: '0.82rem', maxWidth: '160px' }}>
                                                    <div className="truncate-2">{app.business_address}</div>
                                                    {(app.city || app.state) && (
                                                        <div style={{ fontWeight: 600, color: '#64748b', marginTop: '3px' }}>
                                                            {[app.city, app.state].filter(Boolean).join(', ')}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ fontSize: '0.85rem', fontWeight: 500 }}>{app.monthly_requirement || '—'}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(app.status)}`} style={{ textTransform: 'capitalize' }}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${app.isActive === false ? 'status-danger' : 'status-success'}`} style={{ fontSize: '0.72rem' }}>
                                                        {app.isActive === false ? 'Inactive' : 'Active'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <ActionMenu
                                                        app={app}
                                                        onUpdateStatus={updateStatus}
                                                        onToggleActive={toggleActive}
                                                        onDelete={deleteApplication}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                                                No business applications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards (visible on small screens) */}
                        <div className="b2b-cards-mobile">
                            {currentApps.length > 0 ? currentApps.map(app => (
                                <div key={app._id} className="b2b-card-mobile">
                                    <div className="b2b-card-header">
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{app.business_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{app.contact_person} • {app.email}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span className={`status-badge ${getStatusClass(app.status)}`} style={{ textTransform: 'capitalize' }}>{app.status}</span>
                                            <span className={`status-badge ${app.isActive === false ? 'status-danger' : 'status-success'}`} style={{ fontSize: '0.7rem' }}>
                                                {app.isActive === false ? 'Inactive' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="b2b-card-body">
                                        <div><strong>Phone:</strong> {app.phone}</div>
                                        <div><strong>GST:</strong> {app.gst_number || '—'}</div>
                                        <div><strong>Type:</strong> {app.business_type}</div>
                                        <div><strong>Location:</strong> {[app.city, app.state].filter(Boolean).join(', ') || app.business_address}</div>
                                        <div><strong>Monthly Req.:</strong> {app.monthly_requirement || '—'}</div>
                                    </div>
                                    <div className="b2b-card-footer">
                                        <ActionMenu app={app} onUpdateStatus={updateStatus} onToggleActive={toggleActive} onDelete={deleteApplication} />
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-secondary)' }}>No applications found.</div>
                            )}
                        </div>

                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredApps.length}
                            itemsPerPage={appsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Inline styles for responsive behaviour */}
            <style>{`
                .b2b-table-wrap { overflow-x: auto; }
                .b2b-applications-table { min-width: 900px; }
                .b2b-applications-table td { vertical-align: top; }
                .truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .b2b-cards-mobile { display: none; }
                @media (max-width: 768px) {
                    .b2b-table-wrap { display: none; }
                    .b2b-cards-mobile { display: flex; flex-direction: column; gap: 14px; }
                    .b2b-card-mobile { background: var(--admin-card-bg); border: 1px solid var(--admin-border); border-radius: 10px; padding: 16px; }
                    .b2b-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
                    .b2b-card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem; color: var(--admin-text-secondary); margin-bottom: 14px; }
                    .b2b-card-footer { display: flex; justify-content: flex-end; }
                }
            `}</style>
        </div>
    );
};

export default BusinessApplicationsList;
