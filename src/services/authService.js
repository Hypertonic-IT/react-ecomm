// Persistent Authentication Service
// Calls the backend API for all auth operations

const AUTH_API_URL = 'http://localhost:5001/api/auth';

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

    // Reset password (mock placeholder logic for now, or implement backend route)
    resetPassword: async (emailOrMobile, otp, newPassword) => {
        // Verify OTP first
        const verifyRes = await authService.verifyOTP(emailOrMobile, otp);
        if (verifyRes.success) {
            // In a real app, you would call a /reset-password endpoint here
            return { success: true, message: 'Password updated (Mock)' };
        }
        throw new Error('Invalid OTP');
    },

    // Social login (Google) - Mock
    loginWithGoogle: async () => {
        const mockGoogleUser = {
            id: 'google_user_1',
            name: 'Google User',
            email: 'googleuser@gmail.com',
            mobile: ''
        };
        const token = `mock_token_google_${Date.now()}`;
        return {
            success: true,
            user: mockGoogleUser,
            token,
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
        };
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
        // Simple mock check - Match backend format 'mock-jwt-token-'
        if (token && (token.startsWith('mock_token_') || token.startsWith('mock-jwt-token-'))) {
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
            // Get current user for ID header
            const currentUser = JSON.parse(localStorage.getItem('authUser'));
            const userId = currentUser ? currentUser.email : '';

            const response = await fetch(`${AUTH_API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
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
            const currentUser = JSON.parse(localStorage.getItem('authUser'));
            const userId = currentUser ? currentUser.email : '';

            const response = await fetch(`${AUTH_API_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
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
            const currentUser = JSON.parse(localStorage.getItem('authUser'));
            const userId = currentUser ? currentUser.email : '';
            if (!userId) return [];

            const response = await fetch(`${AUTH_API_URL}/wishlist`, {
                headers: { 'user-id': userId }
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
            const currentUser = JSON.parse(localStorage.getItem('authUser'));
            const userId = currentUser ? currentUser.email : '';
            if (!userId) return { success: false, message: 'Please login' };

            const response = await fetch(`${AUTH_API_URL}/wishlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
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
            const currentUser = JSON.parse(localStorage.getItem('authUser'));
            const userId = currentUser ? currentUser.email : '';
            if (!userId) return { success: false };

            const response = await fetch(`${AUTH_API_URL}/wishlist/${productId}`, {
                method: 'DELETE',
                headers: { 'user-id': userId }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Remove wishlist error:', error);
            return { success: false };
        }
    }
};
