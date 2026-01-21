import React, { useState } from 'react';
import { authService } from '../../../../../services/authService';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            const res = await authService.changePassword(formData.currentPassword, formData.newPassword);
            if (res.success) {
                setStatus({ type: 'success', message: 'Password changed successfully!' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#fff', borderRadius: '8px', padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Change Password
            </h2>

            {status.message && (
                <div style={{
                    padding: '12px', borderRadius: '6px', marginBottom: '20px',
                    backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: status.type === 'success' ? '#155724' : '#721c24',
                    display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                    {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                        Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }}><FaLock /></span>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter current password"
                            style={{
                                width: '100%', padding: '10px 10px 10px 40px',
                                border: '1px solid #ddd', borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                        New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }}><FaLock /></span>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                            style={{
                                width: '100%', padding: '10px 10px 10px 40px',
                                border: '1px solid #ddd', borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                        Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }}><FaLock /></span>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm new password"
                            style={{
                                width: '100%', padding: '10px 10px 10px 40px',
                                border: '1px solid #ddd', borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px 30px',
                        background: '#000000', // Black Theme
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: loading ? 'wait' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
