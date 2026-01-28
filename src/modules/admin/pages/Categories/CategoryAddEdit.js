
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaImages } from 'react-icons/fa';
import '../../admin.css';

const CategoryAddEdit = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image: '',
        description: '',
        status: 'Active'
    });

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch category details if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchCategory = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/categories/${id}`);
                    const data = await response.json();

                    if (response.ok) {
                        setFormData({
                            name: data.name,
                            slug: data.slug,
                            image: data.image || '',
                            description: data.description || '',
                            status: data.status || 'Active'
                        });
                        setPreviewImage(data.image);
                    } else {
                        console.error("Category not found");
                    }
                } catch (error) {
                    console.error("Error fetching category:", error);
                }
            };
            fetchCategory();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditMode
                ? `http://localhost:5001/api/categories/${id}`
                : `http://localhost:5001/api/categories`;

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/admin/categories');
            } else {
                console.error("Failed to save category");
            }
        } catch (error) {
            console.error("Error saving category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container fade-in">
            {/* Header Actions */}
            <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <button
                    onClick={() => navigate('/admin/categories')}
                    className="admin-btn-secondary"
                >
                    <FaArrowLeft /> Back
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>
                    {isEditMode ? 'Edit Category' : 'Add New Category'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Left Column: Main Info */}
                <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="admin-input"
                            style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            placeholder="e.g. Summer Collection"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Slug (URL Friendly)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="admin-input"
                            style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            placeholder="summer-collection"
                        />
                        <small style={{ color: 'var(--admin-text-muted)', display: 'block', marginTop: '5px' }}>Leave empty to auto-generate from name</small>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            className="admin-input"
                            style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            placeholder="Category description..."
                        ></textarea>
                    </div>
                </div>

                {/* Right Column: Media & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Media Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Category Media</h3>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={(e) => {
                                    handleChange(e);
                                    setPreviewImage(e.target.value);
                                }}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px', marginBottom: '15px' }}
                            />
                        </div>

                        <div style={{
                            border: '2px dashed var(--admin-border)',
                            borderRadius: '12px',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                    <FaImages size={30} style={{ marginBottom: '10px' }} />
                                    <p>Enter URL to preview</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Status</h3>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Visibility</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        <FaSave />
                        {loading ? 'Saving...' : 'Save Category'}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default CategoryAddEdit;
