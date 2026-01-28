import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { categories as defaultCategories } from '../../../../data/fashionData';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/categories');
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
            await fetch(`http://localhost:5001/api/categories/${id}`, { method: 'DELETE' });
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
                    await fetch('http://localhost:5001/api/categories', {
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

    return (
        <div className="admin-page-container fade-in">
            <div className="table-container">
                {/* Table Toolbar */}
                <div className="table-toolbar">
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <select className="entries-select" defaultValue="10">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <button onClick={handleSyncDefaults} className="admin-btn-secondary" style={{ marginRight: '10px' }} title="Sync Default Categories from Website">
                            <FaSync size={12} /> Sync Defaults
                        </button>
                        <Link to="/admin/categories/new" className="admin-btn-outline">
                            <FaPlus size={12} /> Add new
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading categories...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Slug</th>
                                <th>Image</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((cat) => (
                                <tr key={cat._id || cat.id}>
                                    <td style={{ fontWeight: '600' }}>{cat.name}</td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>/{cat.slug}</td>
                                    <td>
                                        {cat.image ? (
                                            <img src={cat.image} alt={cat.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
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
                )}
            </div>
        </div>
    );
};

export default CategoryList;
