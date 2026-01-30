import React, { useState, useEffect } from 'react';
import {
    FaSearch, FaFilter, FaUpload, FaPlus, FaEdit, FaHistory,
    FaChevronDown, FaChevronRight, FaExclamationTriangle, FaDownload,
    FaTimes, FaCheck
} from 'react-icons/fa';
import '../../admin.css';
import AdminSelect from '../../components/AdminSelect'; // Added
import AdminPagination from '../../components/AdminPagination'; // Added
import './Inventory.css';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStockStatus, setFilterStockStatus] = useState('All');
    const [expandedProducts, setExpandedProducts] = useState(new Set());
    const [editingStock, setEditingStock] = useState(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [showHistory, setShowHistory] = useState(null);
    const [stockHistory, setStockHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // Low stock threshold
    const LOW_STOCK_THRESHOLD = 10;

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/products');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            setLoading(false);
        }
    };

    // Calculate inventory stats
    const stats = {
        total: products.length,
        inStock: products.filter(p => p.countInStock > LOW_STOCK_THRESHOLD).length,
        lowStock: products.filter(p => p.countInStock > 0 && p.countInStock <= LOW_STOCK_THRESHOLD).length,
        outOfStock: products.filter(p => p.countInStock === 0).length
    };

    // Get stock status
    const getStockStatus = (quantity) => {
        if (quantity === 0) return 'out';
        if (quantity <= LOW_STOCK_THRESHOLD) return 'low';
        return 'in';
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;

        const stockStatus = getStockStatus(product.countInStock);
        const matchesStock = filterStockStatus === 'All' ||
            (filterStockStatus === 'In Stock' && stockStatus === 'in') ||
            (filterStockStatus === 'Low Stock' && stockStatus === 'low') ||
            (filterStockStatus === 'Out of Stock' && stockStatus === 'out');

        return matchesSearch && matchesCategory && matchesStock;
    });

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstEntry, indexOfLastEntry);

    // Toggle product expansion
    const toggleExpand = (productId) => {
        const newExpanded = new Set(expandedProducts);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedProducts(newExpanded);
    };

    // Update stock
    const handleUpdateStock = async (productId, newStock, reason = '') => {
        try {
            const product = products.find(p => p._id === productId);
            const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...product,
                    countInStock: parseInt(newStock)
                })
            });

            if (response.ok) {
                // Update local state
                setProducts(products.map(p =>
                    p._id === productId ? { ...p, countInStock: parseInt(newStock) } : p
                ));

                // Log to history (in real app, save to backend)
                const historyEntry = {
                    date: new Date().toISOString(),
                    action: newStock > product.countInStock ? 'Added' : 'Deducted',
                    quantity: Math.abs(newStock - product.countInStock),
                    admin: 'Admin User',
                    reason: reason || 'Manual update'
                };

                setEditingStock(null);
                alert('Stock updated successfully!');
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            alert('Failed to update stock');
        }
    };

    return (
        <div className="admin-page-container fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventory Management</h1>
                    <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                        Track and control product stock in real time
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="inventory-stats-grid">
                <div className="stat-card-inventory" onClick={() => setFilterStockStatus('All')}>
                    <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                        📦
                    </div>
                    <div>
                        <div className="stat-label">Total Products</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </div>

                <div className="stat-card-inventory" onClick={() => setFilterStockStatus('In Stock')}>
                    <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#10b981' }}>
                        ✓
                    </div>
                    <div>
                        <div className="stat-label">In Stock</div>
                        <div className="stat-value">{stats.inStock}</div>
                    </div>
                </div>

                <div className="stat-card-inventory" onClick={() => setFilterStockStatus('Low Stock')}>
                    <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                        ⚠️
                    </div>
                    <div>
                        <div className="stat-label">Low Stock</div>
                        <div className="stat-value">{stats.lowStock}</div>
                    </div>
                </div>

                <div className="stat-card-inventory" onClick={() => setFilterStockStatus('Out of Stock')}>
                    <div className="stat-icon-wrapper" style={{ background: '#fee2e2', color: '#ef4444' }}>
                        ✕
                    </div>
                    <div>
                        <div className="stat-label">Out of Stock</div>
                        <div className="stat-value">{stats.outOfStock}</div>
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
                                placeholder="Search by name or SKU..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        {/* Category Filter */}
                        <div style={{ width: '180px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'All', label: 'All Categories' },
                                    { value: 'Men', label: 'Men' },
                                    { value: 'Women', label: 'Women' },
                                    { value: 'Kids', label: 'Kids' },
                                    { value: 'Accessories', label: 'Accessories' }
                                ]}
                                value={filterCategory}
                                onChange={(val) => { setFilterCategory(val); setCurrentPage(1); }}
                                placeholder="Filter Category"
                            />
                        </div>

                        {/* Stock Status Filter */}
                        <div style={{ width: '180px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'All', label: 'All Stock Status' },
                                    { value: 'In Stock', label: 'In Stock' },
                                    { value: 'Low Stock', label: 'Low Stock' },
                                    { value: 'Out of Stock', label: 'Out of Stock' }
                                ]}
                                value={filterStockStatus}
                                onChange={(val) => { setFilterStockStatus(val); setCurrentPage(1); }}
                                placeholder="Stock Status"
                            />
                        </div>

                        {/* Bulk Update Button */}
                        <button
                            className="admin-btn-secondary"
                            onClick={() => setShowBulkUpload(true)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <FaUpload size={12} /> Bulk Update
                        </button>
                    </div>
                </div>

                {/* Bottom Toolbar - Entries Selector & Add Button */}
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

                    {/* Add Inventory Button - Moved Here */}
                    <button className="admin-btn-outline" style={{ whiteSpace: 'nowrap' }}>
                        <FaPlus size={12} /> Add Inventory
                    </button>
                </div>

                {/* Inventory Table */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading inventory...
                    </div>
                ) : (
                    <>
                        <table className="admin-table inventory-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}></th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>SKU</th>
                                    <th>Stock Qty</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map(product => {
                                    const stockStatus = getStockStatus(product.countInStock);
                                    const isExpanded = expandedProducts.has(product._id);

                                    return (
                                        <React.Fragment key={product._id}>
                                            <tr className={stockStatus === 'out' ? 'out-of-stock-row' : ''}>
                                                <td>
                                                    <button
                                                        className="expand-btn"
                                                        onClick={() => toggleExpand(product._id)}
                                                    >
                                                        {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                                    </button>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                                                        />
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                                                                {product.name}
                                                            </div>
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>
                                                                ID: {product._id.substring(0, 8)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-primary">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                    {product.sku || product._id.substring(0, 10).toUpperCase()}
                                                </td>
                                                <td>
                                                    <span style={{
                                                        fontWeight: 700,
                                                        fontSize: '0.9rem',
                                                        color: stockStatus === 'out' ? '#ef4444' :
                                                            stockStatus === 'low' ? '#f59e0b' : '#10b981'
                                                    }}>
                                                        {product.countInStock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span className={`stock-indicator stock-${stockStatus}`}></span>
                                                        <span className={`status-badge status-${stockStatus === 'in' ? 'success' :
                                                            stockStatus === 'low' ? 'warning' : 'danger'
                                                            }`}>
                                                            {stockStatus === 'in' ? 'In Stock' :
                                                                stockStatus === 'low' ? 'Low Stock' : 'Out of Stock'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.75rem' }}>
                                                    {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                                        <button
                                                            className="admin-btn-icon"
                                                            onClick={() => setEditingStock(product)}
                                                            title="Edit Stock"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="admin-btn-icon"
                                                            onClick={() => setShowHistory(product)}
                                                            title="View History"
                                                        >
                                                            <FaHistory />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Variant View */}
                                            {isExpanded && (
                                                <tr className="variant-row">
                                                    <td colSpan="8">
                                                        <div className="variant-container">
                                                            <div className="variant-header">Product Variants</div>
                                                            <table className="variant-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Color</th>
                                                                        <th>Size</th>
                                                                        <th>Stock</th>
                                                                        <th>Status</th>
                                                                        <th>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/* Mock variants - in real app, fetch from product.variants */}
                                                                    <tr>
                                                                        <td>Black</td>
                                                                        <td>M</td>
                                                                        <td>20</td>
                                                                        <td><span className="status-badge status-success">In Stock</span></td>
                                                                        <td><button className="admin-btn-icon"><FaEdit size={10} /></button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Black</td>
                                                                        <td>L</td>
                                                                        <td>5</td>
                                                                        <td><span className="status-badge status-warning">Low</span></td>
                                                                        <td><button className="admin-btn-icon"><FaEdit size={10} /></button></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>White</td>
                                                                        <td>M</td>
                                                                        <td>0</td>
                                                                        <td><span className="status-badge status-danger">Out</span></td>
                                                                        <td><button className="admin-btn-icon"><FaEdit size={10} /></button></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
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
                            totalItems={filteredProducts.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Edit Stock Modal */}
            {
                editingStock && (
                    <EditStockModal
                        product={editingStock}
                        onClose={() => setEditingStock(null)}
                        onUpdate={handleUpdateStock}
                    />
                )
            }

            {/* Bulk Upload Modal */}
            {
                showBulkUpload && (
                    <BulkUploadModal onClose={() => setShowBulkUpload(false)} />
                )
            }

            {/* History Drawer */}
            {
                showHistory && (
                    <HistoryDrawer
                        product={showHistory}
                        onClose={() => setShowHistory(null)}
                    />
                )
            }
        </div >
    );
};

// Edit Stock Modal Component
const EditStockModal = ({ product, onClose, onUpdate }) => {
    const [newStock, setNewStock] = useState(product.countInStock);
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Math.abs(newStock - product.countInStock) > 50) {
            if (!window.confirm(`You're changing stock by ${Math.abs(newStock - product.countInStock)} units. Are you sure?`)) {
                return;
            }
        }
        onUpdate(product._id, newStock, reason);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Update Stock - {product.name}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>SKU (Read-only)</label>
                            <input
                                type="text"
                                value={product.sku || product._id.substring(0, 10).toUpperCase()}
                                disabled
                                className="admin-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Current Stock</label>
                            <input
                                type="text"
                                value={product.countInStock}
                                disabled
                                className="admin-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Stock Quantity *</label>
                            <input
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                className="admin-input"
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Reason (Optional)</label>
                            <AdminSelect
                                options={[
                                    { value: 'New shipment', label: 'New shipment' },
                                    { value: 'Manual correction', label: 'Manual correction' },
                                    { value: 'Return added', label: 'Return added' },
                                    { value: 'Damaged goods', label: 'Damaged goods' },
                                    { value: 'Inventory audit', label: 'Inventory audit' }
                                ]}
                                value={reason}
                                onChange={setReason}
                                placeholder="Select reason..."
                            />
                        </div>
                        <div className="stock-change-indicator">
                            {newStock > product.countInStock && (
                                <div style={{ color: '#10b981' }}>
                                    ↑ Adding {newStock - product.countInStock} units
                                </div>
                            )}
                            {newStock < product.countInStock && (
                                <div style={{ color: '#ef4444' }}>
                                    ↓ Removing {product.countInStock - newStock} units
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="admin-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn-primary">
                            <FaCheck /> Update Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Bulk Upload Modal
const BulkUploadModal = ({ onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Bulk Stock Update</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="upload-area">
                        <FaUpload size={32} color="#94a3b8" />
                        <p>Drag and drop your Excel file here</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                            or click to browse
                        </p>
                        <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} />
                    </div>
                    <button className="admin-btn-secondary" style={{ width: '100%', marginTop: '16px' }}>
                        <FaDownload /> Download Sample Template
                    </button>
                    <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                        <strong>Required columns:</strong> SKU, Variant, Stock Qty
                    </div>
                </div>
            </div>
        </div>
    );
};

// History Drawer
const HistoryDrawer = ({ product, onClose }) => {
    // Mock history data
    const history = [
        { date: '2024-01-28', action: 'Added', quantity: 50, admin: 'Admin User', reason: 'New shipment' },
        { date: '2024-01-25', action: 'Deducted', quantity: 10, admin: 'Admin User', reason: 'Sales' },
        { date: '2024-01-20', action: 'Added', quantity: 5, admin: 'Admin User', reason: 'Return added' },
    ];

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <h3>Stock History - {product.name}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="drawer-body">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Action</th>
                                <th>Quantity</th>
                                <th>Admin</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${entry.action === 'Added' ? 'status-success' : 'status-warning'}`}>
                                            {entry.action}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {entry.action === 'Added' ? '+' : '-'}{entry.quantity}
                                    </td>
                                    <td>{entry.admin}</td>
                                    <td style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                                        {entry.reason}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagement;
