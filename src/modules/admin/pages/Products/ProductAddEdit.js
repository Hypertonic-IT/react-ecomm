
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaImages, FaTrash, FaPlus, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import AdminSelect from '../../components/AdminSelect';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';
import { API_BASE_URL, BASE_URL } from '../../../../../config';

const ProductAddEdit = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { user, token } = useAdminAuth();

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
        isActive: true,
        shortDescription: '',
        shippingInfo: '',
        galleryImages: '', // Comma separated URLs
        specifications: '', // "Key: Value" per line
        categories: [], // Array of selected categories
        discount: 0,
        salePrice: 0
    });

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const currentImages = formData.galleryImages ? formData.galleryImages.split('\n').filter(Boolean) : [];
        if (currentImages.length + files.length > 5) {
            alert(`You can only upload a maximum of 5 images. You currently have ${currentImages.length} images.`);
            if (e.target) e.target.value = null;
            return;
        }

        setUploading(true);
        const newUrls = [];

        try {
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('image', file);

                const response = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: uploadData
                });
                const data = await response.json();

                if (response.ok) {
                    newUrls.push(data.image);
                } else {
                    console.error('Failed to upload:', file.name);
                }
            }

            if (newUrls.length > 0) {
                const updated = [...currentImages, ...newUrls];
                setFormData(prev => ({ ...prev, galleryImages: updated.join('\n') }));
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading files');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = null;
        }
    };

    const uploadMainImageHandler = async (e) => {
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

    const addGalleryImage = () => {
        if (!newGalleryUrl) return;
        const current = formData.galleryImages ? formData.galleryImages.split('\n').filter(Boolean) : [];

        if (current.length >= 5) {
            alert("You can only have a maximum of 5 gallery images.");
            return;
        }

        const updated = [...current, newGalleryUrl.trim()];
        setFormData(prev => ({ ...prev, galleryImages: updated.join('\n') }));
        setNewGalleryUrl('');
    };

    const removeGalleryImage = (index) => {
        const current = formData.galleryImages ? formData.galleryImages.split('\n') : [];
        const updated = current.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, galleryImages: updated.join('\n') }));
    };

    const replaceGalleryImageHandler = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();

            if (response.ok) {
                const currentImages = formData.galleryImages ? formData.galleryImages.split('\n').filter(Boolean) : [];
                // Replace the exact url at the index
                currentImages[index] = data.image;
                setFormData(prev => ({ ...prev, galleryImages: currentImages.join('\n') }));
            } else {
                console.error('Failed to upload replacement:', file.name);
                alert(data.message || 'Error replacing file');
            }
        } catch (error) {
            console.error(error);
            alert('Error replacing file');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = null; // Clear input
        }
    };

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`);
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
                    const response = await fetch(`${API_BASE_URL}/products/${id}`);
                    const data = await response.json();

                    setFormData({
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        category: data.category,
                        categories: data.categories || (data.category ? [data.category] : []),
                        description: data.description,
                        countInStock: data.countInStock,
                        sizes: Array.isArray(data.sizes) ? data.sizes.join(',') : data.sizes || '',
                        colors: Array.isArray(data.colors) ? data.colors.join(',') : data.colors || '',
                        isNewArrival: data.isNewArrival || false,
                        isTrending: data.isTrending || false,
                        isBestSeller: data.isBestSeller || false,
                        isExclusive: data.isExclusive || false,
                        isActive: data.isActive !== undefined ? data.isActive : true,
                        shortDescription: data.shortDescription || '',
                        shippingInfo: data.shippingInfo || '',
                        galleryImages: Array.isArray(data.images) ? data.images.join('\n') : (data.images || ''),
                        specifications: Array.isArray(data.specifications)
                            ? data.specifications.map(s => `${s.name}: ${s.value}`).join('\n')
                            : '',
                        discount: data.discount || 0,
                        salePrice: data.salePrice || data.price
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

    const handlePriceChange = (e) => {
        const price = Number(e.target.value);
        setFormData(prev => {
            const discount = Number(prev.discount) || 0;
            const salePrice = price - (price * (discount / 100));
            return { ...prev, price: e.target.value, salePrice: parseFloat(salePrice.toFixed(2)) };
        });
    };

    const handleDiscountChange = (e) => {
        const discount = Number(e.target.value);
        setFormData(prev => {
            const price = Number(prev.price) || 0;
            const salePrice = price - (price * (discount / 100));
            return { ...prev, discount: e.target.value, salePrice: parseFloat(salePrice.toFixed(2)) };
        });
    };

    const handleSalePriceChange = (e) => {
        const salePrice = Number(e.target.value);
        setFormData(prev => {
            const price = Number(prev.price) || 0;
            let discount = 0;
            if (price > 0) {
                discount = ((price - salePrice) / price) * 100;
            }
            return { ...prev, salePrice: e.target.value, discount: parseFloat(discount.toFixed(2)) };
        });
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
            images: formData.galleryImages.split('\n').map(s => s.trim()).filter(Boolean),
            specifications: formData.specifications.split('\n').map(line => {
                const [key, ...rest] = line.split(':');
                if (key && rest.length) return { name: key.trim(), value: rest.join(':').trim() };
                return null;
            }).filter(Boolean),
            discount: Number(formData.discount),
            salePrice: Number(formData.salePrice)
        };

        try {
            const url = isEditMode
                ? `${API_BASE_URL}/products/${id}`
                : `${API_BASE_URL}/products`;

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user-id': user?.email || ''
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
                navigate('/admin/products');
            } else {
                const data = await response.json();
                console.error("Backend failed to save:", data);
                alert(`Error: ${data.message || 'Failed to save product'}`);
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Network error trying to save product. Check console.");
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
                {/* Left Column Wrapper */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

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
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Description (Main Tab)</label>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleDiscountChange}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Sale Price (₹)</label>
                                <input
                                    type="number"
                                    name="salePrice"
                                    value={formData.salePrice}
                                    onChange={handleSalePriceChange}
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                    placeholder="Calculated..."
                                />
                            </div>
                        </div>

                        <div style={{ margin: '0 0 20px 0' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Count In Stock</label>
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={formData.countInStock}
                                    onChange={handleChange}
                                    required
                                    className="admin-input"
                                    style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                    placeholder="e.g. 100"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Variants</label>

                            {/* Sizes Section */}
                            <div style={{ marginBottom: '20px' }}>
                                <small style={{ color: 'var(--admin-text-muted)', display: 'block', marginBottom: '8px' }}>Sizes (Select or Type & Enter)</small>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                const currentSizes = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                if (!currentSizes.includes(size)) {
                                                    const updated = [...currentSizes, size];
                                                    setFormData(prev => ({ ...prev, sizes: updated.join(',') }));
                                                }
                                            }}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid var(--admin-border)',
                                                borderRadius: '20px',
                                                background: (formData.sizes?.split(',').map(s => s.trim()).includes(size)) ? 'var(--primary)' : 'var(--admin-bg)',
                                                color: (formData.sizes?.split(',').map(s => s.trim()).includes(size)) ? '#fff' : 'var(--admin-text)',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* Active Tags Area */}
                                <div style={{
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    background: 'var(--admin-bg)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    minHeight: '42px'
                                }}>
                                    {formData.sizes && formData.sizes.split(',').map((size, idx) => size.trim() && (
                                        <div key={idx} style={{
                                            background: 'var(--admin-bg-light)',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.9rem',
                                            border: '1px solid var(--admin-border)'
                                        }}>
                                            {size}
                                            <FaTimes
                                                size={10}
                                                style={{ cursor: 'pointer', color: 'var(--danger)' }}
                                                onClick={() => {
                                                    const current = formData.sizes.split(',').map(s => s.trim());
                                                    const updated = current.filter((_, i) => i !== idx);
                                                    setFormData(prev => ({ ...prev, sizes: updated.join(',') }));
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="Add custom size..."
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                            color: 'var(--admin-text)',
                                            fontSize: '0.9rem',
                                            minWidth: '120px',
                                            flex: 1
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim().toUpperCase();
                                                if (val) {
                                                    const current = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                    if (!current.includes(val)) {
                                                        const updated = [...current, val];
                                                        setFormData(prev => ({ ...prev, sizes: updated.join(',') }));
                                                    }
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Colors Section */}
                            <div>
                                <small style={{ color: 'var(--admin-text-muted)', display: 'block', marginBottom: '8px' }}>Colors (Optional - Select or Type & Enter)</small>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                    {[
                                        { name: 'Black', hex: '#000000' },
                                        { name: 'White', hex: '#FFFFFF' },
                                        { name: 'Red', hex: '#EF4444' },
                                        { name: 'Blue', hex: '#3B82F6' },
                                        { name: 'Green', hex: '#10B981' },
                                        { name: 'Navy', hex: '#1E3A8A' },
                                        { name: 'Beige', hex: '#F5F5DC' }
                                    ].map(color => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => {
                                                const current = formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                // Check case-insensitive
                                                if (!current.some(c => c.toLowerCase() === color.name.toLowerCase())) {
                                                    const updated = [...current, color.name];
                                                    setFormData(prev => ({ ...prev, colors: updated.join(',') }));
                                                }
                                            }}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid var(--admin-border)',
                                                borderRadius: '20px',
                                                background: 'var(--admin-bg)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <span style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: color.hex,
                                                border: color.name === 'White' ? '1px solid #ddd' : 'none'
                                            }}></span>
                                            {color.name}
                                        </button>
                                    ))}
                                </div>

                                <div style={{
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    background: 'var(--admin-bg)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    minHeight: '42px'
                                }}>
                                    {formData.colors && formData.colors.split(',').map((color, idx) => color.trim() && (
                                        <div key={idx} style={{
                                            background: 'var(--admin-bg-light)',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.9rem',
                                            border: '1px solid var(--admin-border)'
                                        }}>
                                            {color}
                                            <FaTimes
                                                size={10}
                                                style={{ cursor: 'pointer', color: 'var(--danger)' }}
                                                onClick={() => {
                                                    const current = formData.colors.split(',').map(s => s.trim());
                                                    const updated = current.filter((_, i) => i !== idx);
                                                    setFormData(prev => ({ ...prev, colors: updated.join(',') }));
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="Add custom color..."
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                            color: 'var(--admin-text)',
                                            fontSize: '0.9rem',
                                            minWidth: '120px',
                                            flex: 1
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim();
                                                if (val) {
                                                    const current = formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                    if (!current.some(c => c.toLowerCase() === val.toLowerCase())) {
                                                        const updated = [...current, val];
                                                        setFormData(prev => ({ ...prev, colors: updated.join(',') }));
                                                    }
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rich Details Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Rich Details (Product Page)</h3>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Short Description (Preview)</label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows="2"
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="Brief summary shown below title..."
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Specifications (Details Tab)</label>
                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleChange}
                                rows="5"
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px', fontFamily: 'monospace' }}
                                placeholder={`Material: 100% Cotton\nFit: Regular\nCare: Machine Wash`}
                            ></textarea>
                            <small style={{ color: 'var(--admin-text-muted)' }}>Format: "Label: Value" (one per line)</small>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Shipping Info (Delivery Tab)</label>
                            <textarea
                                name="shippingInfo"
                                value={formData.shippingInfo}
                                onChange={handleChange}
                                rows="3"
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                placeholder="Free shipping over ₹8,350..."
                            ></textarea>
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

                            {/* Upload Button Main */}
                            <div style={{ marginBottom: '10px' }}>
                                <label
                                    htmlFor="main-image-upload"
                                    className="admin-btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}
                                >
                                    <FaCloudUploadAlt /> {uploading ? 'Uploading...' : 'Upload Main Image'}
                                </label>
                                <input
                                    id="main-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadMainImageHandler}
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
                                    <FaImages size={30} style={{ marginBottom: '10px' }} />
                                    <p>Enter URL to preview</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Gallery Images</label>

                            {/* Upload Button */}
                            <div style={{ marginBottom: '15px' }}>
                                <label
                                    htmlFor="gallery-upload"
                                    className="admin-btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}
                                >
                                    <FaCloudUploadAlt /> {uploading ? 'Uploading...' : 'Upload from Device'}
                                </label>
                                <input
                                    id="gallery-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={uploadFileHandler}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Add New Input */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    value={newGalleryUrl}
                                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                                    placeholder="Add Image URL..."
                                    className="admin-input"
                                    style={{ flex: 1, padding: '10px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGalleryImage(); } }}
                                />
                                <button
                                    type="button"
                                    onClick={addGalleryImage}
                                    className="admin-btn-secondary"
                                    style={{ padding: '0 15px' }}
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            {/* Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                {formData.galleryImages && formData.galleryImages.split('\n').map((url, index) => url.trim() && (
                                    <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                                        <img src={url} alt={`Gallery ${index}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

                                        {/* Replace Icon */}
                                        <label
                                            style={{
                                                position: 'absolute', top: '4px', right: '35px',
                                                background: 'rgba(0,0,0,0.6)', color: '#fff',
                                                border: 'none', borderRadius: '4px',
                                                width: '26px', height: '26px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: uploading ? 'not-allowed' : 'pointer'
                                            }}
                                            title="Replace Image"
                                        >
                                            <FaCloudUploadAlt size={14} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => replaceGalleryImageHandler(e, index)}
                                                disabled={uploading}
                                            />
                                        </label>

                                        {/* Delete Icon */}
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                background: 'rgba(255,0,0,0.8)', color: '#fff',
                                                border: 'none', borderRadius: '4px',
                                                width: '26px', height: '26px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            title="Remove Image"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <small style={{ color: 'var(--admin-text-muted)', display: 'block', marginTop: '5px' }}>
                                {(!formData.galleryImages || !formData.galleryImages.trim()) && "No gallery images added yet."}
                            </small>
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)', marginBottom: '15px' }}>Organization</h3>

                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Category</label>
                            <AdminSelect
                                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                                value={formData.categories && formData.categories.length > 0 ? formData.categories : (formData.category ? [formData.category] : [])}
                                onChange={(val) => setFormData(prev => ({
                                    ...prev,
                                    categories: val,
                                    category: val.length > 0 ? val[0] : '' // Sync primary category
                                }))}
                                placeholder="Select Categories"
                                isMulti={true}
                                isSearchable={true}
                            />
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
