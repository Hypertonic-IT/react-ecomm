import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination'; // Added
import { categories as defaultCategories } from '../../../../data/fashionData';
import { API_BASE_URL, BASE_URL, getImageUrl } from '../../../../../config';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10); // Added state

    // Fetch Categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleSyncDefaults = async () => {
        if (!window.confirm("This will upload default categories from the website data. Continue?")) return;
        setLoading(true);
        let addedCount = 0;

        for (const cat of defaultCategories) {
            // Check if exists
            const exists = categories.some(existing => existing.slug === cat.id || existing.name === cat.title);
            if (!exists && !cat.isLink) { // Skip "New" and "Sale" links
                try {
                    await fetch(`${API_BASE_URL}/categories`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: cat.title,
                            slug: cat.id,
                            image: cat.image,
                            description: `Explore our ${cat.title} collection.`,
                            status: 'Active'
                        })
                    });
                    addedCount++;
                } catch (err) {
                    console.error("Failed to add " + cat.title, err);
                }
            }
        }

        alert(`Synced ${addedCount} new categories.`);
        fetchCategories();
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredCategories.slice(indexOfFirstEntry, indexOfLastEntry);

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
                                placeholder="Search categories..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <button onClick={handleSyncDefaults} className="admin-btn-secondary" title="Sync Default Categories from Website">
                            <FaSync size={12} /> Sync Defaults
                        </button>
                        <Link to="/admin/categories/new" className="admin-btn-outline">
                            <FaPlus size={12} /> Add Category
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading categories...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Slug</th>
                                    <th>Image</th>
                                    <th>Status</th>
                                    <th>Header</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((cat) => (
                                    <tr key={cat._id || cat.id}>
                                        <td style={{ fontWeight: '600' }}>{cat.name}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>/{cat.slug}</td>
                                        <td>
                                            {cat.image ? (
                                                <img src={getImageUrl(cat.image)} alt={cat.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>No Img</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className={`stock-indicator stock-${cat.status === 'Active' ? 'in' : 'out'}`}></span>
                                                <span className={`status-badge ${cat.status === 'Active' ? 'status-success' : 'status-neutral'}`}>
                                                    {cat.status || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {cat.showInHeader ? (
                                                <span style={{ fontSize: '0.7rem', color: '#10b981', background: '#d1fae5', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>Shown</span>
                                            ) : (
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px' }}>Hidden</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <Link to={`/admin/categories/edit/${cat._id}`} className="admin-btn-icon" title="Edit">
                                                    <FaEdit />
                                                </Link>
                                                <button className="admin-btn-danger" title="Delete" onClick={() => handleDelete(cat._id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredCategories.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryList;
