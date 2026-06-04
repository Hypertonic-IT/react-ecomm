import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import SocialLogin from '../../components/Auth/SocialLogin';
import PasswordStrength from '../../components/Auth/PasswordStrength';
import { validateName, validateEmail, validatePassword, validateConfirmPassword, validateOTP } from '../../../../utils/authValidation';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signup, sendOTP, verifyOTP, loginWithGoogle, loginWithApple, isAuthenticated } = useAuth();

    const [step, setStep] = useState(1); // 1: Account Info, 2: Verification, 3: Done
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null);
    const [success, setSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
            navigate(redirectTo);
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = null;

        switch (name) {
            case 'name':
                error = validateName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(formData.password, value);
                break;
            default:
                break;
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (confirmError) newErrors.confirmPassword = confirmError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep1()) return;

        setLoading(true);

        try {
            // Create account immediately
            await signup(formData);

            setSuccess(true);
            setStep(3); // Go straight to success

            // Redirect after success
            setTimeout(() => {
                const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
                navigate(redirectTo);
            }, 1500);
        } catch (error) {
            setErrors({ submit: error.message });
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await sendOTP(formData.email, 'verification');
            setErrors({});
            // Show success message
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const handleSocialSignup = async (provider) => {
        setSocialLoading(provider);

        try {
            if (provider === 'google') {
                await loginWithGoogle();
            } else if (provider === 'apple') {
                await loginWithApple();
            }

            setSuccess(true);
            setTimeout(() => {
                const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';
                navigate(redirectTo);
            }, 1000);
        } catch (error) {
            setErrors({ submit: error.message });
            setSocialLoading(null);
        }
    };

    return (
        <AuthLayout
            title={
                step === 1 ? 'Create Your Account' :
                    step === 2 ? 'Verify Your Email' :
                        'Welcome!'
            }
            subtitle={
                step === 1 ? 'Join us for a better shopping experience' :
                    step === 2 ? `We sent a code to ${formData.email}` :
                        'Your account has been created successfully'
            }
        >
            {/* Step 1: Account Information - Now the only step */}
            {step === 1 && (
                <form onSubmit={handleSubmit} className="auth-form">
                    <AuthInput
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name}
                        placeholder="Enter your full name"
                        autoFocus
                    />

                    <AuthInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        placeholder="Enter your email"
                    />

                    <AuthInput
                        label="Mobile Number (Optional)"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter your mobile number"
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        placeholder="Create a password"
                        showPasswordToggle
                    />

                    <PasswordStrength password={formData.password} />

                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.confirmPassword}
                        placeholder="Confirm your password"
                        showPasswordToggle
                    />

                    <AuthButton
                        type="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        Create Account
                    </AuthButton>

                    <SocialLogin
                        onGoogleLogin={() => handleSocialSignup('google')}
                        onAppleLogin={() => handleSocialSignup('apple')}
                        loading={socialLoading}
                    />

                    <div className="auth-switch">
                        <span>Already have an account?</span>
                        <Link to={new URLSearchParams(location.search).get('redirect') ? `/login?redirect=${encodeURIComponent(new URLSearchParams(location.search).get('redirect'))}` : '/login'} className="auth-switch-link">
                            Login
                        </Link>
                    </div>
                </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h3>Account Created!</h3>
                    <p>Welcome to Kayaroop. Redirecting you to the homepage...</p>
                </div>
            )}
        </AuthLayout>
    );
};

export default Signup;
