import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './PasswordStrength.css';

const PasswordStrength = ({ password, showRequirements = true }) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let strength = 'weak';
    let strengthColor = '#e74c3c';

    if (score >= 4) {
        strength = 'strong';
        strengthColor = '#27ae60';
    } else if (score >= 3) {
        strength = 'medium';
        strengthColor = '#f39c12';
    }

    const strengthPercentage = (score / 4) * 100;

    if (!password) return null;

    return (
        <div className="password-strength">
            {/* Strength Bar */}
            <div className="strength-bar-container">
                <div
                    className="strength-bar"
                    style={{
                        width: `${strengthPercentage}%`,
                        backgroundColor: strengthColor
                    }}
                />
            </div>

            <div className="strength-label">
                Password strength: <span style={{ color: strengthColor, fontWeight: 600 }}>{strength}</span>
            </div>

            {/* Requirements Checklist */}
            {showRequirements && (
                <div className="requirements-list">
                    <RequirementItem
                        met={requirements.minLength}
                        text="At least 8 characters"
                    />
                    <RequirementItem
                        met={requirements.hasUppercase}
                        text="One uppercase letter"
                    />
                    <RequirementItem
                        met={requirements.hasLowercase}
                        text="One lowercase letter"
                    />
                    <RequirementItem
                        met={requirements.hasNumber}
                        text="One number"
                    />
                </div>
            )}
        </div>
    );
};

const RequirementItem = ({ met, text }) => (
    <div className={`requirement-item ${met ? 'met' : ''}`}>
        <span className="requirement-icon">
            {met ? <FaCheck /> : <FaTimes />}
        </span>
        <span className="requirement-text">{text}</span>
    </div>
);

export default PasswordStrength;
