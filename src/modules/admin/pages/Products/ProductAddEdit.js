
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaImages } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';

const ProductAddEdit = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { user } = useAdminAuth();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountedPrice: '',
        image: '',
        category: '',
        description: '',
        countInStock: 0,
        sizes: '',  // "S,M,L"
        colors: '', // "Red,Blue"
        isNewArrival: false,
        isTrending: false,
        isBestSeller: false,
        isExclusive: false,
        isActive: true
    });

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch product details if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/products/${id}`);
                    const data = await response.json();

                    setFormData({
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        category: data.category,
                        description: data.description,
                        countInStock: data.countInStock,
                        sizes: Array.isArray(data.sizes) ? data.sizes.join(',') : data.sizes || '',
                        colors: Array.isArray(data.colors) ? data.colors.join(',') : data.colors || '',
                        isNewArrival: data.isNewArrival || false,
                        isTrending: data.isTrending || false,
                        isBestSeller: data.isBestSeller || false,
                        isExclusive: data.isExclusive || false,
                        isActive: data.isActive !== undefined ? data.isActive : true
                    });
                    setPreviewImage(data.image);
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: Number(formData.price),
            countInStock: Number(formData.countInStock),
            // Convert comma strings to arrays
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
        };

        try {
            const url = isEditMode
                ? `http://localhost:5001/api/products/${id}`
                : `http://localhost:5001/api/products`;

            const method = isEditMode ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user?.email
                },
                body: JSON.stringify(payload)
            });

            navigate('/admin/products');
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="admin-btn-secondary"
                >
                    <FaArrowLeft /> Back
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Left Column: Main Info */}
                <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="admin-input"
                            style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            placeholder="e.g. Premium Oversized Hoodie"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="admin-input"
                            style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            placeholder="Detailed product description..."
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Count In Stock</label>
                            <input
                                type="number"
                                name="countInStock"
                                value={formData.countInStock}
                                onChange={handleChange}
                                required
                                min="0"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Variants</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <small style={{ color: 'var(--admin-text-muted)' }}>Sizes (comma separated)</small>
                                <input
                                    type="text"
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleChange}
                                    placeholder="S, M, L, XL"
                                    style={{ width: '100%', marginTop: '5px', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                />
                            </div>
                            <div>
                                <small style={{ color: 'var(--admin-text-muted)' }}>Colors (comma separated)</small>
                                <input
                                    type="text"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    placeholder="Red, Blue, Black"
                                    style={{ width: '100%', marginTop: '5px', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Organization */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Media Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Product Media</h3>

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

                    {/* Category Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Organization</h3>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="admin-input admin-select"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="isActive" style={{ color: 'var(--admin-text)', cursor: 'pointer', fontWeight: 600 }}>Active (Visible on Website)</label>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: '10px 0' }} />

                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px', fontSize: '0.85rem' }}>Marketing Sections</label>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="isNewArrival"
                                    id="isNewArrival"
                                    checked={formData.isNewArrival}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="isNewArrival" style={{ color: 'var(--admin-text)', cursor: 'pointer' }}>New Arrival</label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="isTrending"
                                    id="isTrending"
                                    checked={formData.isTrending}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="isTrending" style={{ color: 'var(--admin-text)', cursor: 'pointer' }}>Trending Now</label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="isBestSeller"
                                    id="isBestSeller"
                                    checked={formData.isBestSeller}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="isBestSeller" style={{ color: 'var(--admin-text)', cursor: 'pointer' }}>Best Seller</label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    name="isExclusive"
                                    id="isExclusive"
                                    checked={formData.isExclusive}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="isExclusive" style={{ color: 'var(--admin-text)', cursor: 'pointer' }}>Exclusive For You</label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        <FaSave />
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default ProductAddEdit;
