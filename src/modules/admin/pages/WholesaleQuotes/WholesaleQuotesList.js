import React, { useEffect, useState } from 'react';
import { FaFileInvoiceDollar, FaSearch, FaReply, FaCheck } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import '../../admin.css';
import { API_BASE_URL } from 'config';

const WholesaleQuotesList = () => {
    const { user } = useAdminAuth();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [quotesPerPage, setQuotesPerPage] = useState(10);
    
    // Modal/Response state
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [adminResponseText, setAdminResponseText] = useState('');
    const [responding, setResponding] = useState(false);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await fetch(`${API_BASE_URL}/quotes`, {
                headers: {
                    'Authorization': `Bearer ${token || ''}`,
                    'user-id': user?.email || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setQuotes(data);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const handleRespondSubmit = async (e) => {
        e.preventDefault();
        if (!adminResponseText.trim()) {
            alert("Response text is required");
            return;
        }

        setResponding(true);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await fetch(`${API_BASE_URL}/quotes/${selectedQuote._id}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || ''}`,
                    'user-id': user?.email || ''
                },
                body: JSON.stringify({ adminResponse: adminResponseText })
            });

            if (response.ok) {
                alert("Quote request response recorded!");
                setSelectedQuote(null);
                setAdminResponseText('');
                fetchQuotes();
            } else {
                const errData = await response.json();
                alert(errData.message || "Failed to submit response");
            }
        } catch (error) {
            console.error("Error responding to quote:", error);
            alert("Network error. Please try again.");
        } finally {
            setResponding(false);
        }
    };

    const parseMessage = (msg) => {
        if (!msg) return { businessName: 'N/A', notes: 'N/A' };
        const parts = msg.split('\n');
        let businessName = 'N/A';
        let notes = msg;
        if (parts[0] && parts[0].startsWith('Business Name:')) {
            businessName = parts[0].replace('Business Name:', '').trim();
            notes = parts.slice(1).join('\n').replace(/^Notes:\s*/, '').trim();
        }
        return { businessName, notes };
    };

    // Filter Logic
    const filteredQuotes = quotes.filter(quote => {
        const { businessName, notes } = parseMessage(quote.message);
        const matchesSearch = 
            quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.phone.includes(searchTerm) ||
            businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (quote.itemsDescription && quote.itemsDescription.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastQuote = currentPage * quotesPerPage;
    const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
    const currentQuotes = filteredQuotes.slice(indexOfFirstQuote, indexOfLastQuote);
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusClass = (status) => {
        switch (status) {
            case 'responded': return 'status-success';
            default: return 'status-warning';
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ marginBottom: '25px' }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaFileInvoiceDollar /> Wholesale Quote Requests
                </h1>
            </div>

            <div className="table-container">
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <AdminSelect
                            options={[
                                { value: 10, label: '10' },
                                { value: 25, label: '25' },
                                { value: 50, label: '50' }
                            ]}
                            value={quotesPerPage}
                            onChange={(val) => {
                                setQuotesPerPage(val);
                                setCurrentPage(1);
                            }}
                            styles={{
                                control: (base) => ({ ...base, minHeight: '32px', width: '70px', fontSize: '12px' })
                            }}
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="filter-wrapper">
                            <AdminSelect
                                options={[
                                    { value: 'all', label: 'All Statuses' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'responded', label: 'Responded' }
                                ]}
                                value={statusFilter}
                                onChange={(val) => {
                                    setStatusFilter(val);
                                    setCurrentPage(1);
                                }}
                                styles={{
                                    control: (base) => ({ ...base, minHeight: '32px', width: '130px', fontSize: '12px' })
                                }}
                                isSearchable={false}
                            />
                        </div>

                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search quotes..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading quotes...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Business Customer</th>
                                    <th>Contact Info</th>
                                    <th>Product Details</th>
                                    <th>Special Notes</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentQuotes.length > 0 ? (
                                    currentQuotes.map(quote => {
                                        const { businessName, notes } = parseMessage(quote.message);
                                        return (
                                            <tr key={quote._id}>
                                                <td style={{ fontSize: '0.85rem' }}>
                                                    {new Date(quote.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{businessName}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>User: {quote.user_id?.name || 'Guest'}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{quote.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{quote.email}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{quote.phone}</div>
                                                </td>
                                                <td style={{ fontSize: '0.85rem', maxWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                    {quote.itemsDescription || 'N/A'}
                                                </td>
                                                <td style={{ fontSize: '0.85rem', maxWidth: '220px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                    {notes}
                                                    {quote.adminResponse && (
                                                        <div style={{ marginTop: '8px', padding: '6px', background: '#f0fdf4', borderLeft: '3px solid #22c55e', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                            <strong>Response:</strong> {quote.adminResponse}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(quote.status)}`}>
                                                        {quote.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => setSelectedQuote(quote)}
                                                        className="admin-btn-primary"
                                                        style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                        title="Respond to Quote"
                                                    >
                                                        <FaReply size={10} /> Process
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--admin-text-secondary)' }}>
                                            No quote requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <AdminPagination
                                currentPage={currentPage}
                                totalItems={filteredQuotes.length}
                                itemsPerPage={quotesPerPage}
                                onPageChange={paginate}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Response Popup Modal */}
            {selectedQuote && (
                <div className="admin-modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="admin-modal-content" style={{
                        background: '#fff', borderRadius: '12px', padding: '30px',
                        width: '500px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px', color: '#0f172a' }}>Process Quote Request</h2>
                        <div style={{ marginBottom: '15px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
                            <div><strong>Business:</strong> {parseMessage(selectedQuote.message).businessName}</div>
                            <div><strong>Product Details:</strong> {selectedQuote.itemsDescription}</div>
                            <div><strong>Contact:</strong> {selectedQuote.name} ({selectedQuote.email})</div>
                        </div>

                        <form onSubmit={handleRespondSubmit}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ fontWeight: '700', marginBottom: '6px', display: 'block', fontSize: '0.85rem' }}>Response / Processing Comments*</label>
                                <textarea
                                    required
                                    value={adminResponseText}
                                    onChange={(e) => setAdminResponseText(e.target.value)}
                                    placeholder="Enter pricing notes, discount details, or contact summary..."
                                    rows="4"
                                    style={{
                                        width: '100%', padding: '10px', border: '1.5px solid #cbd5e1',
                                        borderRadius: '8px', fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedQuote(null)}
                                    className="admin-btn-secondary"
                                    style={{ padding: '8px 16px' }}
                                    disabled={responding}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-primary"
                                    style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    disabled={responding}
                                >
                                    <FaCheck size={12} /> Submit Response
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WholesaleQuotesList;
