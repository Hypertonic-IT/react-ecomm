const { sendOTPEmail } = require('../services/EmailService');
const Otp = require('../models/Otp');
const User = require('../models/User');

const sendOTP = async (req, res) => {
    let { email } = req.body;

    if (email) email = email.toLowerCase();

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate expiry (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
        // Save OTP to DB (upsert: update if exists, else insert)
        await Otp.findOneAndUpdate(
            { emailOrMobile: email },
            { otp: otpCode, expiresAt: expiresAt },
            { upsert: true, new: true }
        );

        const emailSent = await sendOTPEmail(email, otpCode);

        if (emailSent) {
            res.status(200).json({ success: true, message: 'OTP sent successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send OTP. Please check SMTP settings.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const verifyOTP = async (req, res) => {
    let { email, otp } = req.body;

    if (email) email = email.toLowerCase();

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const storedOtp = await Otp.findOne({ emailOrMobile: email });

        if (!storedOtp) {
            return res.status(400).json({ success: false, message: 'OTP not found or expired' });
        }

        if (storedOtp.otp === otp) {
            // Check if OTP is expired (double check, though Mongo index handles cleanup usually)
            if (Date.now() > storedOtp.expiresAt) {
                return res.status(400).json({ success: false, message: 'OTP has expired' });
            }

            // OTP verified. Now Find or Create User
            let user = await User.findOne({ emailOrMobile: email });

            if (!user) {
                user = await User.create({ emailOrMobile: email });
            }

            // Delete OTP after usage
            await Otp.deleteOne({ _id: storedOtp._id });

            // Return user info (and token in real app)
            res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                user: {
                    id: user._id,
                    email: user.emailOrMobile,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    role: user.role
                },
                token: 'mock-jwt-token-' + user._id // Mock token for now
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const signup = async (req, res) => {
    let { name, email, mobile, password } = req.body;
    if (email) email = email.toLowerCase();

    try {
        const existingUser = await User.findOne({ emailOrMobile: email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            emailOrMobile: email,
            password, // Storing plain text for MVP/Demo as per request velocity. In prod, hash this.
            mobile
        });

        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.emailOrMobile,
                mobile: newUser.mobile
            },
            token: 'mock-jwt-token-' + newUser._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const login = async (req, res) => {
    let { emailOrMobile, password } = req.body;
    if (emailOrMobile) emailOrMobile = emailOrMobile.toLowerCase();

    try {
        const user = await User.findOne({ emailOrMobile: emailOrMobile });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password (simple comparison for MVP)
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.emailOrMobile,
                mobile: user.mobile,
                isAdmin: user.isAdmin,
                role: user.role
            },
            token: 'mock-jwt-token-' + user._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    // In production, get user ID from authenticated token/header
    // For now, identifying by email provided in body or header (insecure but consistent with current MVP)
    // Better approach matching getMyOrders: use 'user-id' header
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { name, mobile } = req.body;

        const user = await User.findOne({ emailOrMobile: userEmail });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (mobile) user.mobile = mobile;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.emailOrMobile,
                mobile: updatedUser.mobile
            },
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


const changePassword = async (req, res) => {
    // In production, get user ID from authenticated token/header
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        // Update to new password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getWishlist = async (req, res) => {
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    if (!userEmail) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addToWishlist = async (req, res) => {
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    if (!userEmail) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { productId, name, price, image, inStock } = req.body;

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Initialize wishlist if undefined
        if (!user.wishlist) user.wishlist = [];

        const exists = user.wishlist.find(item => item.productId === productId.toString());
        if (exists) return res.status(400).json({ success: false, message: 'Item already in wishlist' });

        user.wishlist.push({ productId, name, price, image, inStock });
        await user.save();

        res.status(200).json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const removeFromWishlist = async (req, res) => {
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    if (!userEmail) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { productId } = req.params;

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.wishlist) {
            user.wishlist = user.wishlist.filter(item => item.productId !== productId);
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Typically would check for Admin role here, but simplification for now.
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    signup,
    login,
    updateProfile,
    changePassword,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getAllUsers
};

