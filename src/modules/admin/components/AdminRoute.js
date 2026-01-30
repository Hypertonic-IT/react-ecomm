
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const AdminRoute = ({ children, requiredRoles }) => {
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

    // Role hierarchies or groups
    const isStaff = user && (
        user.isAdmin ||
        ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(user.role)
    );

    // If roles are specified, check if user has one of them
    const hasRequiredRole = !requiredRoles || (user && requiredRoles.includes(user.role));

    if (!isAuthenticated || !isStaff || !hasRequiredRole) {
        // Redirect to ADMIN login, not customer login
        // If they are logged in but don't have the role, maybe redirect to dashboard with a warning?
        // For now, simple redirect
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // User is authorized
    return children;
};

export default AdminRoute;
