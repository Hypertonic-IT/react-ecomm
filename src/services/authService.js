// Persistent Authentication Service
// Calls the backend API for all auth operations

import apiUrl from '../config/api';

const AUTH_API_URL = apiUrl('/api/auth');

export const authService = {
    // Login with email/mobile and password
    login: async (emailOrMobile, password, rememberMe = false) => {
        try {
            const response = await fetch(`${AUTH_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrMobile, password })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Invalid credentials');
            }

            const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

            return {
                success: true,
                user: data.user,
                token: data.token,
                expiresAt: Date.now() + expiresIn
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Signup new user
    signup: async (userData) => {
        try {
            const response = await fetch(`${AUTH_API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Signup failed');
            }

            return {
                success: true,
                user: data.user,
                token: data.token,
                expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
            };
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    // Send OTP
    sendOTP: async (email, purpose = 'verification') => {
        try {
            const response = await fetch(`${AUTH_API_URL}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to send OTP');

            return data;
        } catch (error) {
            console.error('sendOTP error:', error);
            throw error;
        }
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        try {
            const response = await fetch(`${AUTH_API_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Invalid OTP');

            return data;
        } catch (error) {
            console.error('verifyOTP error:', error);
            throw error;
        }
    },

    // Request password reset (uses OTP flow)
    requestPasswordReset: async (emailOrMobile) => {
        // For now, reusing sendOTP
        return authService.sendOTP(emailOrMobile, 'password_reset');
    },

    // Reset password (Real Backend Implementation)
    resetPassword: async (emailOrMobile, otp, newPassword) => {
        try {
            const response = await fetch(`${AUTH_API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailOrMobile, otp, newPassword })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Password reset failed');

            return data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },

    // Social login (Google) - Real Implementation
    loginWithGoogle: async (tokenResponse) => {
        try {
            if (!tokenResponse || !tokenResponse.access_token) {
                throw new Error("No access token received from Google");
            }

            // 1. Get User Profile from Google directly (Frontend verification)
            // This ensures we have the real email/name before hitting our backend
            const googleProfileRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                    Accept: 'application/json'
                }
            });

            if (!googleProfileRes.ok) throw new Error("Failed to fetch Google Profile");

            const googleProfile = await googleProfileRes.json();

            // 2. Send Profile to Backend to Login/Create Account
            const response = await fetch(`${AUTH_API_URL}/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: googleProfile.email,
                    name: googleProfile.name,
                    googleId: googleProfile.id,
                    picture: googleProfile.picture
                })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Google login failed on server');

            return {
                success: true,
                user: data.user,
                token: data.token,
                expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
            };
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    },

    // Social login (Apple) - Mock
    loginWithApple: async () => {
        const mockAppleUser = {
            id: 'apple_user_1',
            name: 'Apple User',
            email: 'appleuser@icloud.com',
            mobile: ''
        };
        const token = `mock_token_apple_${Date.now()}`;
        return {
            success: true,
            user: mockAppleUser,
            token,
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
        };
    },

    // Verify token validity
    verifyToken: async (token) => {
        // Accept real JWTs (long strings) or legacy mock tokens
        if (token && token.length > 20) {
            return { valid: true };
        }
        return { valid: false };
    },

    // Logout
    logout: async () => {
        return { success: true };
    },

    // Update Profile
    updateProfile: async (userData) => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${AUTH_API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Update failed');

            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // Change Password
    changePassword: async (currentPassword, newPassword) => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${AUTH_API_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Password change failed');

            return data;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    getWishlist: async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return [];

            const response = await fetch(`${AUTH_API_URL}/wishlist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            return data.success ? data.wishlist : [];
        } catch (error) {
            console.error('Get wishlist error:', error);
            return [];
        }
    },

    addToWishlist: async (product) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return { success: false, message: 'Please login' };

            const response = await fetch(`${AUTH_API_URL}/wishlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    inStock: true // default
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Add wishlist error:', error);
            return { success: false };
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return { success: false };

            const response = await fetch(`${AUTH_API_URL}/wishlist/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Remove wishlist error:', error);
            return { success: false };
        }
    }
};
