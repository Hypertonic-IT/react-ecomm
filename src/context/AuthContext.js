import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState([]);

    // Load user session from localStorage on mount
    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedToken = localStorage.getItem('authToken');
                const savedUser = localStorage.getItem('authUser');
                const expiresAt = localStorage.getItem('authExpiresAt');

                if (savedToken && savedUser && expiresAt) {
                    // Check if token is expired
                    if (Date.now() < parseInt(expiresAt)) {
                        // Verify token with backend (in real app)
                        const isValid = await authService.verifyToken(savedToken);

                        if (isValid.valid) {
                            setToken(savedToken);
                            const parsedUser = JSON.parse(savedUser);
                            const isStaff = parsedUser.isAdmin ||
                                ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(parsedUser.role);

                            if (isStaff) {
                                // Prevent staff from accessing as regular user
                                clearSession();
                            } else {
                                setToken(savedToken);
                                setUser(parsedUser);
                            }
                        } else {
                            // Token invalid, clear session
                            clearSession();
                        }
                    } else {
                        // Token expired, clear session
                        clearSession();
                    }
                }
            } catch (error) {
                console.error('Failed to load session:', error);
                clearSession();
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    // Clear session data
    const clearSession = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('authExpiresAt');
        setToken(null);
        setUser(null);
    };

    // Save session to localStorage
    const saveSession = (userData, authToken, expiresAt) => {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authExpiresAt', expiresAt.toString());
        setToken(authToken);
        setUser(userData);
    };

    // Rate limiting check - max 5 attempts per 15 minutes
    const checkRateLimit = () => {
        const now = Date.now();
        const fifteenMinutesAgo = now - (15 * 60 * 1000);

        // Filter attempts from last 15 minutes
        const recentAttempts = loginAttempts.filter(timestamp => timestamp > fifteenMinutesAgo);

        if (recentAttempts.length >= 5) {
            const oldestAttempt = Math.min(...recentAttempts);
            const waitTime = Math.ceil((oldestAttempt + (15 * 60 * 1000) - now) / 60000);
            throw new Error(`Too many login attempts. Please try again in ${waitTime} minute(s).`);
        }

        // Update attempts
        setLoginAttempts([...recentAttempts, now]);
    };

    // Login function
    const login = async (emailOrMobile, password, rememberMe = false) => {
        try {
            // Check rate limiting
            checkRateLimit();

            const response = await authService.login(emailOrMobile, password, rememberMe);

            if (response.success) {
                // RESTRICTION: Prevent Admin/Staff from logging into Storefront
                const isStaff = response.user.isAdmin ||
                    ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(response.user.role);

                if (isStaff) {
                    return {
                        success: false,
                        message: 'Staff account detected. Please login via the Admin Panel.'
                    };
                }

                saveSession(response.user, response.token, response.expiresAt);
                // Clear login attempts on success
                setLoginAttempts([]);
                return { success: true };
            }
        } catch (error) {
            throw error;
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            const response = await authService.signup(userData);

            if (response.success) {
                saveSession(response.user, response.token, response.expiresAt);
                return { success: true };
            }
        } catch (error) {
            throw error;
        }
    };

    // Social login
    const loginWithGoogle = async () => {
        try {
            const response = await authService.loginWithGoogle();

            if (response.success) {
                saveSession(response.user, response.token, response.expiresAt);
                return { success: true };
            }
        } catch (error) {
            throw error;
        }
    };

    const loginWithApple = async () => {
        try {
            const response = await authService.loginWithApple();

            if (response.success) {
                saveSession(response.user, response.token, response.expiresAt);
                return { success: true };
            }
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            clearSession();

            // Clear cart and wishlist if needed
            localStorage.removeItem('cart');

            return { success: true };
        } catch (error) {
            // Even if API call fails, clear local session
            clearSession();
            throw error;
        }
    };

    // Send OTP
    const sendOTP = async (emailOrMobile, purpose = 'verification') => {
        try {
            const response = await authService.sendOTP(emailOrMobile, purpose);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Verify OTP
    const verifyOTP = async (emailOrMobile, otp) => {
        try {
            const response = await authService.verifyOTP(emailOrMobile, otp);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Request password reset
    const requestPasswordReset = async (emailOrMobile) => {
        try {
            const response = await authService.requestPasswordReset(emailOrMobile);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Reset password
    const resetPassword = async (emailOrMobile, otp, newPassword) => {
        try {
            const response = await authService.resetPassword(emailOrMobile, otp, newPassword);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Update user profile
    const updateProfile = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithApple,
        sendOTP,
        verifyOTP,
        requestPasswordReset,
        resetPassword,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
