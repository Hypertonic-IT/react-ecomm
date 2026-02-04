
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import { useAuth } from '../../../../context/AuthContext';
import './AdminAuth.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAdminAuth();
    const { logout: userLogout } = useAuth(); // Get user logout function

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Ensure no user session exists when logging in as admin
            await userLogout();

            // Re-using the main login for now, but in a real app this would be a specific admin endpoint
            // allowing us to check roles before even issuing a token
            const result = await login(email, password);

            if (result.success) {
                // Successful login, redirect to dashboard
                // Using window.location to force a full refresh and state update if needed, or stick to SPA nav
                // navigate('/admin/dashboard'); 
                // Let's use window.location to ensure fresh slate
                window.location.href = '/admin/dashboard';
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-auth-container">
            <div className="admin-auth-card">
                <div className="admin-auth-header">
                    <h2>Hypertonic<span style={{ color: '#3b82f6' }}>.Admin</span></h2>
                    <p>Enter your credentials to access the control panel</p>
                </div>

                {error && <div className="admin-auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>

                    <button type="submit" className="admin-btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
