// Authentication form validation utilities

export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

export const validateMobile = (mobile) => {
    if (!mobile) {
        return 'Mobile number is required';
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/[\s-]/g, ''))) {
        return 'Please enter a valid 10-digit mobile number';
    }
    return null;
};

export const validateEmailOrMobile = (value) => {
    if (!value) {
        return 'Email or mobile number is required';
    }

    // Check if it's a number (mobile)
    const isNumber = /^[0-9\s-]+$/.test(value);

    if (isNumber) {
        return validateMobile(value);
    } else {
        return validateEmail(value);
    }
};

export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    return null;
};

export const validatePasswordStrength = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let strength = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 3) strength = 'medium';

    return {
        strength,
        requirements,
        score
    };
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
};

export const validateName = (name) => {
    if (!name) {
        return 'Full name is required';
    }
    if (name.trim().length < 2) {
        return 'Please enter your full name';
    }
    return null;
};

export const validateOTP = (otp) => {
    if (!otp) {
        return 'OTP is required';
    }
    if (!/^[0-9]{6}$/.test(otp)) {
        return 'Please enter a valid 6-digit OTP';
    }
    return null;
};

// Real-time validation helper
export const getFieldError = (fieldName, value, additionalValue = null) => {
    switch (fieldName) {
        case 'email':
            return validateEmail(value);
        case 'mobile':
            return validateMobile(value);
        case 'emailOrMobile':
            return validateEmailOrMobile(value);
        case 'password':
            return validatePassword(value);
        case 'confirmPassword':
            return validateConfirmPassword(additionalValue, value);
        case 'name':
            return validateName(value);
        case 'otp':
            return validateOTP(value);
        default:
            return null;
    }
};
