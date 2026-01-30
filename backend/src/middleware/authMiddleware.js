const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    // For MVP, checking the custom header 'user-id' 
    // In a real production app, this should check 'Authorization: Bearer token'

    let userEmail = req.headers['user-id'];

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Future proofing for standard JWT
        /* 
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) { ... } 
        */
        // For now, if bearer exists but we are using user-id header auth in frontend
    }

    if (!userEmail) {
        // Fallback for postman testing, try to find user if we passed a token (mock)
        // For now, fail safe
        // return res.status(401).json({ message: 'Not authorized, no token' });
    }

    if (userEmail) {
        try {
            const user = await User.findOne({ emailOrMobile: userEmail.toLowerCase() });
            if (user) {
                req.user = user;
                next();
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }

    // If we land here, check if we found a user
    if (req.user) return;

    res.status(401).json({ message: 'Not authorized, token failed' });
};

const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin || ['super_admin', 'product_manager', 'sales_manager', 'marketing_manager'].includes(req.user.role))) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: `Forbidden: Access denied for role '${req.user ? req.user.role : 'none'}'`
            });
        }
    };
};

module.exports = { protect, admin, checkRole };
