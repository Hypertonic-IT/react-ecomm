import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaSearch, FaEye, FaTimes } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import '../../admin.css';
import { API_BASE_URL } from 'config';

const ContactSubmissions = () => {
    const { user } = useAdminAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [selectedContact, setSelectedContact] = useState(null);

    const getToken = () => localStorage.getItem('adminAuthToken');

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'user-id': user?.email || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts || []);
            }
        } catch (err) {
            console.error('Error fetching contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    const markAs = async (id, status) => {
        try {
            await fetch(`${API_BASE_URL}/contact/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                    'user-id': user?.email || ''
                },
                body: JSON.stringify({ status })
            });
            fetchContacts();
            if (selectedContact && selectedContact._id === id) {
                setSelectedContact(prev => ({ ...prev, status }));
            }
        } catch (err) {
            console.error('Error updating contact:', err);
        }
    };

    const filtered = contacts.filter(c => {
        const matchSearch =
            (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const currentItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getStatusClass = (status) => {
        if (status === 'replied') return 'status-success';
        if (status === 'read') return 'status-primary';
        return 'status-warning';
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ marginBottom: '25px' }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEnvelope /> Contact Us Submissions
                </h1>
            </div>

            <div className="table-container">
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <AdminSelect
                            options={[{ value: 10, label: '10' }, { value: 25, label: '25' }, { value: 50, label: '50' }]}
                            value={perPage}
                            onChange={(val) => { setPerPage(val); setCurrentPage(1); }}
                            styles={{ control: (base) => ({ ...base, minHeight: '32px', width: '70px', fontSize: '12px' }) }}
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="filter-wrapper">
                            <AdminSelect
                                options={[
                                    { value: 'all', label: 'All Statuses' },
                                    { value: 'new', label: 'New' },
                                    { value: 'read', label: 'Read' },
                                    { value: 'replied', label: 'Replied' }
                                ]}
                                value={statusFilter}
                                onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                                styles={{ control: (base) => ({ ...base, minHeight: '32px', width: '130px', fontSize: '12px' }) }}
                                isSearchable={false}
                            />
                        </div>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by name, email, subject..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading submissions...</div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? currentItems.map(c => (
                                        <tr key={c._id} style={{ fontWeight: c.status === 'new' ? 700 : 400 }}>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap' }}>
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{c.name}</td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>{c.email}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {c.subject}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(c.status)}`} style={{ textTransform: 'capitalize' }}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="admin-btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    onClick={() => { setSelectedContact(c); markAs(c._id, 'read'); }}
                                                >
                                                    <FaEye size={11} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                                                No contact submissions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filtered.length}
                            itemsPerPage={perPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {selectedContact && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--admin-card-bg)', borderRadius: '14px',
                        padding: '32px', width: '560px', maxWidth: '95%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)', position: 'relative'
                    }}>
                        <button
                            onClick={() => setSelectedContact(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-secondary)', fontSize: '1.2rem' }}
                        >
                            <FaTimes />
                        </button>

                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', color: 'var(--admin-text)' }}>
                            Contact Message
                        </h2>

                        <div style={{ background: 'var(--admin-bg)', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.7' }}>
                            <div style={{ marginBottom: '8px' }}><strong>From:</strong> {selectedContact.name} ({selectedContact.email})</div>
                            <div style={{ marginBottom: '8px' }}><strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</div>
                            <div style={{ marginBottom: '8px' }}><strong>Subject:</strong> {selectedContact.subject}</div>
                            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--admin-border)' }}>
                                <strong>Message:</strong>
                                <p style={{ marginTop: '8px', color: 'var(--admin-text-secondary)', lineHeight: 1.7 }}>{selectedContact.message}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button
                                className="admin-btn-secondary"
                                style={{ padding: '8px 16px' }}
                                onClick={() => setSelectedContact(null)}
                            >
                                Close
                            </button>
                            <a
                                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                                className="admin-btn-primary"
                                style={{ padding: '8px 16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={() => markAs(selectedContact._id, 'replied')}
                            >
                                <FaEnvelope size={12} /> Reply via Email
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactSubmissions;
