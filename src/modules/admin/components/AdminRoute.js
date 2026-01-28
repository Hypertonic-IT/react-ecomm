
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAdminAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', background: '#0f172a', color: '#94a3b8'
            }}>
                Checking Permissions...
            </div>
        );
    }

    // Check if user is authenticated AND (isAdmin or has admin role)
    // Adjust logic based on your exact user model structure
    const isAdmin = user && (user.isAdmin || user.role === 'super_admin');

    if (!isAuthenticated || !isAdmin) {
        // Redirect to ADMIN login, not customer login
        return <Navigate to="/admin/login" replace />;
    }

    // User is authorized
    return children;
};

export default AdminRoute;
