import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaCloudUploadAlt, FaImage } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';
import { API_BASE_URL, BASE_URL } from 'config';

const BlogAddEdit = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { user } = useAdminAuth();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        image: '',
        excerpt: '',
        author: '',
        category: '',
        tags: '',
        status: 'draft',
        isPopular: false
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch blog if editing
    useEffect(() => {
        if (isEditMode) {
            const fetchBlog = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
                    const data = await response.json();
                    setFormData({
                        title: data.title || '',
                        slug: data.slug || '',
                        content: data.content || '',
                        image: data.image || '',
                        excerpt: data.excerpt || '',
                        author: data.author || '',
                        category: data.category || '',
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
                        status: data.status || 'draft',
                        isPopular: data.isPopular || false
                    });
                    setPreviewImage(data.image);
                } catch (error) {
                    console.error("Error fetching blog:", error);
                }
            };
            fetchBlog();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        // Auto-generate slug from title
        if (name === 'title') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const uploadImageHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();

            if (response.ok) {
                setFormData(prev => ({ ...prev, image: data.image }));
                setPreviewImage(data.image);
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            const url = isEditMode
                ? `${API_BASE_URL}/blogs/${id}`
                : `${API_BASE_URL}/blogs`;

            const method = isEditMode ? 'PUT' : 'POST';

            const token = localStorage.getItem('adminAuthToken');

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            navigate('/admin/blogs');
        } catch (error) {
            console.error("Error saving blog:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <button
                    onClick={() => navigate('/admin/blogs')}
                    className="admin-btn-secondary"
                >
                    <FaArrowLeft /> Back
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>
                    {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Left Column: Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Basic Information Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Blog Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="e.g. The Future of Fashion Technology"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="auto-generated-from-title"
                            />
                            <small style={{ color: 'var(--admin-text-muted)' }}>Auto-generated from title, or customize it</small>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Excerpt (Short Description)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows="3"
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="Brief summary shown in blog list..."
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Content (Main Article)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="12"
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px', fontFamily: 'monospace' }}
                                placeholder="Full blog content (HTML supported)..."
                            ></textarea>
                            <small style={{ color: 'var(--admin-text-muted)' }}>You can use HTML tags for formatting</small>
                        </div>
                    </div>

                </div>

                {/* Right Column: Media & Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Featured Image Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Featured Image</h3>

                        <div className="form-group">
                            {/* Upload Button */}
                            <div style={{ marginBottom: '10px' }}>
                                <label
                                    htmlFor="image-upload"
                                    className="admin-btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}
                                >
                                    <FaCloudUploadAlt /> {uploading ? 'Uploading...' : 'Upload Image'}
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadImageHandler}
                                    style={{ display: 'none' }}
                                />
                            </div>

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
                                    <FaImage size={30} style={{ marginBottom: '10px' }} />
                                    <p>Enter URL to preview</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta Information Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Meta Information</h3>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Author</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="e.g. Admin, John Doe"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            >
                                <option value="">Select Category</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Technology">Technology</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--admin-text)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="isPopular"
                                    checked={formData.isPopular}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                Mark as Most Popular
                            </label>
                            <small style={{ display: 'block', marginTop: '5px', color: 'var(--admin-text-muted)' }}>If checked, this post will appear in the 'Most Popular' slider.</small>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="fashion, lifestyle, trends"
                            />
                            <small style={{ color: 'var(--admin-text-muted)' }}>Comma-separated tags</small>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <FaSave /> {loading ? 'Saving...' : (isEditMode ? 'Update Blog Post' : 'Create Blog Post')}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default BlogAddEdit;
