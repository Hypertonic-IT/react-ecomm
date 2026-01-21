import React from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import AuthButton from './AuthButton';
import './SocialLogin.css';

const SocialLogin = ({ onGoogleLogin, onAppleLogin, loading = false }) => {
    return (
        <div className="social-login">
            <div className="divider">
                <span>or continue with</span>
            </div>

            <div className="social-buttons">
                <AuthButton
                    variant="social"
                    onClick={onGoogleLogin}
                    loading={loading === 'google'}
                    icon={<FaGoogle />}
                    fullWidth
                >
                    Google
                </AuthButton>

                <AuthButton
                    variant="social"
                    onClick={onAppleLogin}
                    loading={loading === 'apple'}
                    icon={<FaApple />}
                    fullWidth
                >
                    Apple
                </AuthButton>
            </div>
        </div>
    );
};

export default SocialLogin;
