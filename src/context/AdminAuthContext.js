import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState([]);

    // Load admin session from localStorage on mount
    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedToken = localStorage.getItem('adminAuthToken');
                const savedUser = localStorage.getItem('adminAuthUser');
                const expiresAt = localStorage.getItem('adminAuthExpiresAt');

                if (savedToken && savedUser && expiresAt) {
                    // Check if token is expired
                    if (Date.now() < parseInt(expiresAt)) {
                        // In a real app, verify admin token specifically
                        const isValid = await authService.verifyToken(savedToken);

                        if (isValid.valid) {
                            setToken(savedToken);
                            const parsedUser = JSON.parse(savedUser);
                            const isStaff = parsedUser.isAdmin ||
                                ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(parsedUser.role);

                            if (isStaff) {
                                setToken(savedToken);
                                setUser(parsedUser);
                            } else {
                                clearSession();
                            }
                        } else {
                            clearSession();
                        }
                    } else {
                        clearSession();
                    }
                }
            } catch (error) {
                console.error('Failed to load admin session:', error);
                clearSession();
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    // Clear session data
    const clearSession = () => {
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminAuthUser');
        localStorage.removeItem('adminAuthExpiresAt');
        setToken(null);
        setUser(null);
    };

    // Save session to localStorage
    const saveSession = (userData, authToken, expiresAt) => {
        localStorage.setItem('adminAuthToken', authToken);
        localStorage.setItem('adminAuthUser', JSON.stringify(userData));
        localStorage.setItem('adminAuthExpiresAt', expiresAt.toString());
        setToken(authToken);
        setUser(userData);
    };

    // Rate limiting check
    const checkRateLimit = () => {
        const now = Date.now();
        const fifteenMinutesAgo = now - (15 * 60 * 1000);
        const recentAttempts = loginAttempts.filter(timestamp => timestamp > fifteenMinutesAgo);

        if (recentAttempts.length >= 5) {
            const oldestAttempt = Math.min(...recentAttempts);
            const waitTime = Math.ceil((oldestAttempt + (15 * 60 * 1000) - now) / 60000);
            throw new Error(`Too many login attempts. Please try again in ${waitTime} minute(s).`);
        }

        setLoginAttempts([...recentAttempts, now]);
    };

    // Login function
    const login = async (emailOrMobile, password, rememberMe = false) => {
        try {
            checkRateLimit();

            // Using the same authService as user for now, but separating the session storage
            const response = await authService.login(emailOrMobile, password, rememberMe);

            if (response.success) {
                // Check if user is actually a staff member
                const isStaff = response.user.isAdmin ||
                    ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(response.user.role);

                if (isStaff) {
                    saveSession(response.user, response.token, response.expiresAt);
                    setLoginAttempts([]);
                    return { success: true };
                } else {
                    return { success: false, message: 'Unauthorized access. Staff privileges required.' };
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout(); // Optional: notify backend
            clearSession();
            return { success: true };
        } catch (error) {
            clearSession();
            throw error;
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};
