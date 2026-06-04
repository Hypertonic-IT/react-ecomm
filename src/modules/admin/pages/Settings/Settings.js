import React, { useState, useEffect } from 'react';
import { FaSave, FaGlobe, FaCreditCard, FaShareAlt, FaLock } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';
import { API_BASE_URL, BASE_URL } from 'config';

const Settings = () => {
    const { user, token } = useAdminAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        siteName: '',
        supportEmail: '',
        currencySymbol: '$',
        shippingFee: 0,
        freeShippingThreshold: 0,
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/settings`);
                const data = await response.json();

                setFormData({
                    siteName: data.siteName || '',
                    supportEmail: data.supportEmail || '',
                    currencySymbol: data.currencySymbol || '$',
                    shippingFee: data.shippingFee || 0,
                    freeShippingThreshold: data.freeShippingThreshold || 0,
                    socialLinks: {
                        facebook: data.socialLinks?.facebook || '',
                        twitter: data.socialLinks?.twitter || '',
                        instagram: data.socialLinks?.instagram || '',
                        linkedin: data.socialLinks?.linkedin || ''
                    }
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching settings:", error);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialKey = name.replace('social_', '');
            setFormData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await fetch(`${API_BASE_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            alert('Settings updated successfully!');
        } catch (error) {
            console.error("Error updating settings:", error);
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords don't match");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Password changed successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert('Failed to change password');
        }
    };

    if (loading) {
        return <div className="admin-page-container fade-in">Loading settings...</div>;
    }

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header-actions" style={{ marginBottom: '25px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Admin Settings</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>

                {/* General Settings */}
                <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                        <FaGlobe className="text-primary" />
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text)', margin: 0 }}>General Information</h3>
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Store Name</label>
                        <input
                            type="text"
                            name="siteName"
                            value={formData.siteName}
                            onChange={handleChange}
                            className="admin-input"
                            style={{ width: '100%', padding: '8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Support Email</label>
                        <input
                            type="email"
                            name="supportEmail"
                            value={formData.supportEmail}
                            onChange={handleChange}
                            className="admin-input"
                            style={{ width: '100%', padding: '8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                {/* Commerce Settings */}
                <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                        <FaCreditCard className="text-primary" />
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text)', margin: 0 }}>Commerce Settings</h3>
                    </div>

                    <div className="admin-grid-3" style={{ gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Currency Symbol</label>
                            <input
                                type="text"
                                name="currencySymbol"
                                value={formData.currencySymbol}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Shipping Fee</label>
                            <input
                                type="number"
                                name="shippingFee"
                                value={formData.shippingFee}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Free Shipping Over</label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={formData.freeShippingThreshold}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                        <FaShareAlt className="text-primary" />
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text)', margin: 0 }}>Social Media</h3>
                    </div>

                    <div className="admin-grid-2" style={{ gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Facebook URL</label>
                            <input
                                type="text"
                                name="social_facebook"
                                value={formData.socialLinks.facebook}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Twitter URL</label>
                            <input
                                type="text"
                                name="social_twitter"
                                value={formData.socialLinks.twitter}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Instagram URL</label>
                            <input
                                type="text"
                                name="social_instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>LinkedIn URL</label>
                            <input
                                type="text"
                                name="social_linkedin"
                                value={formData.socialLinks.linkedin}
                                onChange={handleChange}
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={saving}
                    style={{ justifySelf: 'start', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <FaSave />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>

            </form>

            {/* Password Change Section */}
            <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '24px', maxWidth: '800px', marginTop: '40px' }}>
                <div className="admin-card" style={{ background: 'var(--admin-card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                        <FaLock className="text-primary" />
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--admin-text)', margin: 0 }}>Change Password</h3>
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="admin-input"
                            style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                        />
                    </div>

                    <div className="admin-grid-2" style={{ gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                className="admin-input"
                                style={{ width: '100%', padding: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="admin-btn-primary"
                    style={{ justifySelf: 'start', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <FaLock />
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default Settings;
