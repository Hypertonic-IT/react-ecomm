import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaPercentage, FaRupeeSign } from 'react-icons/fa';
import '../../admin.css';
import './Coupons.css';

const CouponAddEdit = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscount: '',
        applicableTo: 'all',
        applicableCategories: [],
        applicableProducts: [],
        minOrderValue: '',
        usageLimit: '',
        perUserLimit: '1',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        if (isEditMode) {
            fetchCoupon();
        }
    }, [id, isEditMode]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCoupon = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/coupons/${id}`);
            const result = await response.json();
            if (result.success) {
                const coupon = result.data;
                setFormData({
                    code: coupon.code,
                    name: coupon.name,
                    description: coupon.description || '',
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                    maxDiscount: coupon.maxDiscount || '',
                    applicableTo: coupon.applicableTo,
                    applicableCategories: coupon.applicableCategories || [],
                    applicableProducts: coupon.applicableProducts.map(p => p._id) || [],
                    minOrderValue: coupon.minOrderValue || '',
                    usageLimit: coupon.usageLimit || '',
                    perUserLimit: coupon.perUserLimit || '1',
                    startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
                    endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
                    isActive: coupon.isActive
                });
            }
        } catch (error) {
            console.error("Error fetching coupon:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryToggle = (categoryName) => {
        setFormData(prev => ({
            ...prev,
            applicableCategories: prev.applicableCategories.includes(categoryName)
                ? prev.applicableCategories.filter(c => c !== categoryName)
                : [...prev.applicableCategories, categoryName]
        }));
    };

    const handleProductToggle = (productId) => {
        setFormData(prev => ({
            ...prev,
            applicableProducts: prev.applicableProducts.includes(productId)
                ? prev.applicableProducts.filter(p => p !== productId)
                : [...prev.applicableProducts, productId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditMode
                ? `http://localhost:5001/api/coupons/${id}`
                : 'http://localhost:5001/api/coupons';

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': 'admin'
                },
                body: JSON.stringify({
                    ...formData,
                    discountValue: Number(formData.discountValue),
                    maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                    minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
                    usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                    perUserLimit: Number(formData.perUserLimit)
                })
            });

            const result = await response.json();

            if (result.success) {
                navigate('/admin/coupons');
            } else {
                alert(result.message || 'Error saving coupon');
            }
        } catch (error) {
            console.error("Error saving coupon:", error);
            alert('Error saving coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <button
                    onClick={() => navigate('/admin/coupons')}
                    className="admin-btn-secondary"
                >
                    <FaArrowLeft /> Back
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>
                    {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="coupon-form-container">

                {/* Section 1: Basic Info */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-number">1</div>
                        <h3 className="section-title">Basic Information</h3>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Coupon Code *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g. SAVE20"
                                required
                                style={{ textTransform: 'uppercase' }}
                            />
                            <span className="form-field-hint">Use uppercase letters and numbers only</span>
                        </div>

                        <div className="form-field">
                            <label>Coupon Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. 20% Off Sale"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Description (Optional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of this coupon..."
                        />
                    </div>
                </div>

                {/* Section 2: Discount Setup */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-number">2</div>
                        <h3 className="section-title">Discount Configuration</h3>
                    </div>

                    <div className="discount-type-selector">
                        <div
                            className={`discount-type-option ${formData.discountType === 'percentage' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, discountType: 'percentage' }))}
                        >
                            <div className="discount-type-icon"><FaPercentage /></div>
                            <div className="discount-type-label">Percentage</div>
                        </div>

                        <div
                            className={`discount-type-option ${formData.discountType === 'flat' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, discountType: 'flat' }))}
                        >
                            <div className="discount-type-icon"><FaRupeeSign /></div>
                            <div className="discount-type-label">Flat Amount</div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Discount Value *</label>
                            <input
                                type="number"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleChange}
                                placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                                required
                                min="0"
                                step={formData.discountType === 'percentage' ? '1' : '0.01'}
                            />
                            <span className="form-field-hint">
                                {formData.discountType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount in ₹'}
                            </span>
                        </div>

                        {formData.discountType === 'percentage' && (
                            <div className="form-field">
                                <label>Maximum Discount Cap (Optional)</label>
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleChange}
                                    placeholder="e.g. 1000"
                                    min="0"
                                    step="0.01"
                                />
                                <span className="form-field-hint">Maximum discount amount in ₹</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Applicability */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-number">3</div>
                        <h3 className="section-title">Applicability</h3>
                    </div>

                    <div className="applicability-options">
                        <div
                            className={`applicability-option ${formData.applicableTo === 'all' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, applicableTo: 'all' }))}
                        >
                            <input
                                type="radio"
                                name="applicableTo"
                                value="all"
                                checked={formData.applicableTo === 'all'}
                                onChange={handleChange}
                            />
                            <span className="applicability-label">All Products</span>
                        </div>

                        <div
                            className={`applicability-option ${formData.applicableTo === 'categories' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, applicableTo: 'categories' }))}
                        >
                            <input
                                type="radio"
                                name="applicableTo"
                                value="categories"
                                checked={formData.applicableTo === 'categories'}
                                onChange={handleChange}
                            />
                            <span className="applicability-label">Selected Categories</span>
                        </div>

                        <div
                            className={`applicability-option ${formData.applicableTo === 'products' ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, applicableTo: 'products' }))}
                        >
                            <input
                                type="radio"
                                name="applicableTo"
                                value="products"
                                checked={formData.applicableTo === 'products'}
                                onChange={handleChange}
                            />
                            <span className="applicability-label">Selected Products</span>
                        </div>
                    </div>

                    {formData.applicableTo === 'categories' && (
                        <div className="selected-items-display">
                            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
                                Select Categories:
                            </div>
                            {categories.map(cat => (
                                <div key={cat._id} className="selected-item-chip">
                                    <input
                                        type="checkbox"
                                        checked={formData.applicableCategories.includes(cat.name)}
                                        onChange={() => handleCategoryToggle(cat.name)}
                                    />
                                    <span>{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {formData.applicableTo === 'products' && (
                        <div className="selected-items-display">
                            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
                                Select Products:
                            </div>
                            {products.slice(0, 20).map(product => (
                                <div key={product._id} className="selected-item-chip">
                                    <input
                                        type="checkbox"
                                        checked={formData.applicableProducts.includes(product._id)}
                                        onChange={() => handleProductToggle(product._id)}
                                    />
                                    <span>{product.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 4: Usage Rules */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-number">4</div>
                        <h3 className="section-title">Usage Rules</h3>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Minimum Order Value (₹)</label>
                            <input
                                type="number"
                                name="minOrderValue"
                                value={formData.minOrderValue}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                step="0.01"
                            />
                            <span className="form-field-hint">Minimum cart value to apply coupon</span>
                        </div>

                        <div className="form-field">
                            <label>Total Usage Limit</label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                placeholder="Unlimited"
                                min="1"
                            />
                            <span className="form-field-hint">Leave empty for unlimited</span>
                        </div>

                        <div className="form-field">
                            <label>Per User Limit *</label>
                            <input
                                type="number"
                                name="perUserLimit"
                                value={formData.perUserLimit}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                            <span className="form-field-hint">How many times each user can use</span>
                        </div>
                    </div>
                </div>

                {/* Section 5: Validity */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-number">5</div>
                        <h3 className="section-title">Validity Period</h3>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>End Date *</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Section 6: Status */}
                <div className="form-section">
                    <div className="section-header">
                        <div className="section-number">6</div>
                        <h3 className="section-title">Status</h3>
                    </div>

                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        <label htmlFor="isActive" className="toggle-label">
                            {formData.isActive ? 'Active (Visible to users)' : 'Inactive (Hidden from users)'}
                        </label>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky-footer">
                    <button
                        type="button"
                        className="admin-btn-secondary"
                        onClick={() => navigate('/admin/coupons')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="admin-btn-outline"
                        disabled={loading}
                    >
                        <FaSave /> {loading ? 'Saving...' : (isEditMode ? 'Update Coupon' : 'Create Coupon')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CouponAddEdit;
