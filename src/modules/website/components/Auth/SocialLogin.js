import React from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import AuthButton from './AuthButton';
import './SocialLogin.css';

const SocialLogin = ({ onGoogleLogin, onAppleLogin, loading = false }) => {

    const login = useGoogleLogin({
        onSuccess: tokenResponse => onGoogleLogin(tokenResponse),
        onError: error => console.log('Login Failed:', error),
    });

    return (
        <div className="social-login">
            {/* <div className="divider">
                <span>or continue with</span>
            </div> */}

            {/* <div className="social-buttons">
                <AuthButton
                    variant="social"
                    onClick={() => login()}
                    loading={loading === 'google'}
                    icon={<FaGoogle />}
                    fullWidth
                    type="button" // Prevent form submission
                >
                    Google
                </AuthButton>

                <AuthButton
                    variant="social"
                    onClick={onAppleLogin}
                    loading={loading === 'apple'}
                    icon={<FaApple />}
                    fullWidth
                    type="button"
                >
                    Apple
                </AuthButton>
            </div> */}
        </div>
    );
};

export default SocialLogin;
