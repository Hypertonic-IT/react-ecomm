import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthInput.css';

const AuthInput = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    error,
    placeholder,
    autoFocus = false,
    disabled = false,
    showPasswordToggle = false,
    icon = null
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
        <div className="auth-input-wrapper">
            {label && (
                <label htmlFor={name} className="auth-input-label">
                    {label}
                </label>
            )}
            <div className={`auth-input-container ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
                {icon && <span className="auth-input-icon">{icon}</span>}
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    className="auth-input"
                    aria-label={label || placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    autoComplete={
                        type === 'email' ? 'email' :
                            type === 'password' ? 'current-password' :
                                name === 'confirmPassword' ? 'new-password' :
                                    name === 'name' ? 'name' :
                                        'off'
                    }
                    inputMode={
                        type === 'email' ? 'email' :
                            type === 'tel' ? 'tel' :
                                name === 'mobile' ? 'tel' :
                                    'text'
                    }
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
            {error && (
                <span id={`${name}-error`} className="auth-input-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default AuthInput;
