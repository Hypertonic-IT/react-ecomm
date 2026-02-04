import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import { validateEmailOrMobile, validateOTP, validatePassword, validateConfirmPassword } from '../../../../utils/authValidation';
import './Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { requestPasswordReset, verifyOTP, resetPassword } = useAuth();

    const [step, setStep] = useState(1); // 1: Request Reset, 2: Verify OTP, 3: New Password, 4: Success
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [resendTimer, setResendTimer] = useState(0);

    const handleRequestReset = async (e) => {
        e.preventDefault();

        const error = validateEmailOrMobile(emailOrMobile);
        if (error) {
            setErrors({ emailOrMobile: error });
            return;
        }

        setLoading(true);
        setSuccessMessage(''); // Clear previous messages

        try {
            const response = await requestPasswordReset(emailOrMobile);

            // DEV HELP: Show OTP in alert if getting it back from backend (Mock Mode)
            if (response && response.debugOtp) {
                alert(`[DEV MODE] Your OTP is: ${response.debugOtp}`);
            }

            setStep(2);
            setErrors({});
            startResendTimer();
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        const error = validateOTP(otp);
        if (error) {
            setErrors({ otp: error });
            return;
        }

        setLoading(true);

        try {
            await verifyOTP(emailOrMobile, otp);

            // Replaced alert with inline success message
            setSuccessMessage("OTP Verified Successfully");

            setStep(3);
            setErrors({});
        } catch (error) {
            setErrors({ otp: error.message || 'Invalid OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(newPassword);
        const confirmError = validateConfirmPassword(newPassword, confirmPassword);

        if (passwordError || confirmError) {
            setErrors({
                newPassword: passwordError,
                confirmPassword: confirmError
            });
            return;
        }

        setLoading(true);

        try {
            await resetPassword(emailOrMobile, otp, newPassword);
            setStep(4);
            setErrors({});
            setSuccessMessage(''); // Clear message on final success
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        try {
            await requestPasswordReset(emailOrMobile);
            setErrors({});
            setSuccessMessage('A new verification code has been sent.');
            startResendTimer();
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const startResendTimer = () => {
        setCanResend(false);
        setResendTimer(300); // Increased to 5 minutes as requested

        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <AuthLayout
            title={
                step === 1 ? 'Forgot Password?' :
                    step === 2 ? 'Verify OTP' :
                        step === 3 ? 'Create New Password' :
                            'Password Reset Successful'
            }
            subtitle={
                step === 1 ? 'Enter your email or mobile to receive a reset code' :
                    step === 2 ? `We sent a code to ${emailOrMobile}` :
                        step === 3 ? 'Enter your new password' :
                            'Your password has been updated successfully'
            }
        >
            {errors.submit && (
                <div className="auth-error-banner" role="alert">
                    {errors.submit}
                </div>
            )}

            {successMessage && (
                <div className="auth-success-banner" role="alert">
                    {successMessage}
                </div>
            )}

            {/* Step 1: Request Reset */}
            {step === 1 && (
                <form onSubmit={handleRequestReset} className="auth-form">
                    <AuthInput
                        label="Email or Mobile Number"
                        type="text"
                        name="emailOrMobile"
                        value={emailOrMobile}
                        onChange={(e) => {
                            setEmailOrMobile(e.target.value);
                            if (errors.emailOrMobile) setErrors({});
                        }}
                        error={errors.emailOrMobile}
                        placeholder="Enter your email or mobile"
                        autoFocus
                    />

                    <AuthButton
                        type="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        Send Reset Code
                    </AuthButton>

                    <div className="auth-switch">
                        <Link to="/login" className="auth-switch-link">
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
                <form onSubmit={handleVerifyOTP} className="auth-form">
                    <div className="otp-info">
                        <p>Enter the 6-digit code we sent to verify your identity</p>
                    </div>

                    <AuthInput
                        label="Verification Code"
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            if (errors.otp) setErrors({});
                        }}
                        error={errors.otp}
                        placeholder="Enter 6-digit code"
                        autoFocus
                    />

                    <AuthButton
                        type="submit"
                        disabled={otp.length !== 6}
                    >
                        Verify Code
                    </AuthButton>

                    <div className="resend-otp">
                        <span>Didn't receive the code?</span>
                        {canResend ? (
                            <button type="button" onClick={handleResendOTP} className="resend-link">
                                Resend OTP
                            </button>
                        ) : (
                            <span className="resend-timer">Resend in {resendTimer}s</span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="back-button"
                    >
                        ← Change Email/Mobile
                    </button>
                </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className="auth-form">
                    <AuthInput
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: null }));
                        }}
                        error={errors.newPassword}
                        placeholder="Create a new password"
                        showPasswordToggle
                        autoFocus
                    />

                    <AuthInput
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                        }}
                        error={errors.confirmPassword}
                        placeholder="Confirm your new password"
                        showPasswordToggle
                    />

                    <AuthButton
                        type="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        Reset Password
                    </AuthButton>
                </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
                <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h3>Password Updated!</h3>
                    <p>Your password has been reset successfully</p>

                    <AuthButton onClick={() => navigate('/login')}>
                        Back to Login
                    </AuthButton>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
