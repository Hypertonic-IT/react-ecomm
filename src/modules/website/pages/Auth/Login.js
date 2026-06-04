import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import SocialLogin from '../../components/Auth/SocialLogin';
import { validateEmailOrMobile, validatePassword } from '../../../../utils/authValidation';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle, loginWithApple, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        emailOrMobile: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null);
    const [success, setSuccess] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            const redirectTo = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/';
            navigate(redirectTo);
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = null;

        if (name === 'emailOrMobile') {
            error = validateEmailOrMobile(value);
        } else if (name === 'password') {
            error = validatePassword(value);
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmailOrMobile(formData.emailOrMobile);
        if (emailError) newErrors.emailOrMobile = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            await login(formData.emailOrMobile, formData.password, formData.rememberMe);
            setSuccess(true);

            // Redirect after success animation
            setTimeout(() => {
                const redirectTo = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/';
                navigate(redirectTo);
            }, 1000);
        } catch (error) {
            setErrors({ submit: error.message });
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider, data) => {
        setSocialLoading(provider);

        try {
            if (provider === 'google') {
                // 'data' is the tokenResponse from Google
                await loginWithGoogle(data);
            } else if (provider === 'apple') {
                await loginWithApple();
            }

            setSuccess(true);
            setTimeout(() => {
                const redirectTo = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/';
                navigate(redirectTo);
            }, 1000);
        } catch (error) {
            setErrors({ submit: error.message });
            setSocialLoading(null);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to continue shopping"
        >
            <form onSubmit={handleSubmit} className="auth-form">
                {errors.submit && (
                    <div className="auth-error-banner" role="alert">
                        {errors.submit}
                    </div>
                )}

                <AuthInput
                    label="Email or Mobile Number"
                    type="text"
                    name="emailOrMobile"
                    value={formData.emailOrMobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.emailOrMobile}
                    placeholder="Enter your email or mobile"
                    autoFocus
                />

                <AuthInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    placeholder="Enter your password"
                    showPasswordToggle
                />

                <div className="auth-form-options">
                    <label className="remember-me">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <span>Remember me</span>
                    </label>

                    <Link to="/forgot-password" className="forgot-password-link">
                        Forgot Password?
                    </Link>
                </div>

                <AuthButton
                    type="submit"
                    loading={loading}
                    success={success}
                    disabled={loading || success}
                >
                    {success ? 'Success!' : 'Login'}
                </AuthButton>

                <SocialLogin
                    onGoogleLogin={(tokenResponse) => handleSocialLogin('google', tokenResponse)}
                    onAppleLogin={() => handleSocialLogin('apple')}
                    loading={socialLoading}
                />

                <div className="auth-switch">
                    <span>New here?</span>
                    <Link to={new URLSearchParams(location.search).get('redirect') ? `/signup?redirect=${encodeURIComponent(new URLSearchParams(location.search).get('redirect'))}` : '/signup'} className="auth-switch-link">
                        Create an account
                    </Link>
                </div>

                <div className="auth-switch" style={{ marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                    <Link to="/business/register" className="auth-switch-link business-register-link" style={{ color: '#d97706', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                        Register as a Business Account
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
