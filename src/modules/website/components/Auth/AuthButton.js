import React from 'react';
import { FaSpinner, FaCheck } from 'react-icons/fa';
import './AuthButton.css';

const AuthButton = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    loading = false,
    success = false,
    disabled = false,
    fullWidth = true,
    icon = null
}) => {
    const handleClick = (e) => {
        if (loading || disabled || success) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    return (
        <button
            type={type}
            className={`auth-button ${variant} ${fullWidth ? 'full-width' : ''} ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
            onClick={handleClick}
            disabled={disabled || loading || success}
            aria-busy={loading}
        >
            {loading && (
                <span className="button-icon spinning">
                    <FaSpinner />
                </span>
            )}
            {success && (
                <span className="button-icon">
                    <FaCheck />
                </span>
            )}
            {!loading && !success && icon && (
                <span className="button-icon">
                    {icon}
                </span>
            )}
            <span className="button-text">{children}</span>
        </button>
    );
};

export default AuthButton;
