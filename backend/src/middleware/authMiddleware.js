const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hypertonic_secret_key_123');

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
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
