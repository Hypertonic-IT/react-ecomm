const { sendOTPEmail } = require('../services/EmailService');
const Otp = require('../models/Otp');
const User = require('../models/User');
const BusinessApplication = require('../models/BusinessApplication');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kayaroop_secret_key_123';
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

const getBusinessStatus = async (userId) => {
    const app = await BusinessApplication.findOne({ user_id: userId });
    return app ? app.status : null;
};

const sendOTP = async (req, res) => {
    let { email } = req.body;

    if (email) email = email.toLowerCase();

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if user exists first
    try {
        const user = await User.findOne({ emailOrMobile: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Calculate expiry (5 minutes from now)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP to DB (upsert: update if exists, else insert)
        await Otp.findOneAndUpdate(
            { emailOrMobile: email },
            { otp: otpCode, expiresAt: expiresAt },
            { upsert: true, new: true }
        );

        const emailSent = await sendOTPEmail(email, otpCode);

        // DEV HELPER: Only pass OTP back if NOT using real credentials (Mock Mode)
        // Now that we have real credentials, this will correctly be undefined
        const isMockMode = !process.env.SMTP_USER || process.env.SMTP_USER.includes('your-email');
        const debugOtp = isMockMode ? otpCode : undefined;

        if (emailSent) {
            res.status(200).json({ success: true, message: 'OTP sent successfully', debugOtp });
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

            // Check user status (Pending Approval or Rejected)
            if (user.status === 'Pending Approval') {
                return res.status(400).json({ success: false, message: 'Your business account is currently under review.' });
            }
            if (user.status === 'Rejected') {
                return res.status(400).json({ success: false, message: 'Your business account application was not approved. Please contact support for further assistance.' });
            }

            // DO NOT DELETE OTP HERE. It is needed for the resetPassword step.
            // await Otp.deleteOne({ _id: storedOtp._id });

            const businessStatus = await getBusinessStatus(user._id);

            // Return user info (and token in real app)
            res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                user: {
                    id: user._id,
                    email: user.emailOrMobile,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    role: user.role,
                    accountType: user.accountType || 'personal',
                    businessStatus
                },
                token: generateToken(user._id)
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
                mobile: newUser.mobile,
                accountType: newUser.accountType || 'personal',
                businessStatus: null
            },
            token: generateToken(newUser._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const businessRegister = async (req, res) => {
    const {
        business_name,
        contact_person,
        email,
        phone,
        gst_number,
        business_address,
        business_type,
        city,
        state,
        password
    } = req.body;

    if (!email || !password || !contact_person) {
        return res.status(400).json({ success: false, message: 'Email, password, and contact person name are required.' });
    }

    try {
        const existingUser = await User.findOne({ emailOrMobile: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name: contact_person,
            emailOrMobile: email.toLowerCase(),
            mobile: phone,
            password,
            accountType: 'business',
            status: 'Pending Approval'
        });

        await BusinessApplication.create({
            user_id: user._id,
            business_name,
            contact_person,
            email: email.toLowerCase(),
            phone,
            gst_number,
            business_address,
            business_type,
            city,
            state,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Your business account application has been submitted successfully and is awaiting admin approval.'
        });
    } catch (error) {
        console.error('Error in business register:', error);
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

        // Check user status (Pending Approval or Rejected)
        if (user.status === 'Pending Approval') {
            return res.status(400).json({ success: false, message: 'Your business account is currently under review.' });
        }
        if (user.status === 'Rejected') {
            return res.status(400).json({ success: false, message: 'Your business account application was not approved. Please contact support for further assistance.' });
        }

        const businessStatus = await getBusinessStatus(user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.emailOrMobile,
                mobile: user.mobile,
                isAdmin: user.isAdmin,
                role: user.role,
                accountType: user.accountType || 'personal',
                businessStatus
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = req.user; // Populated by protect middleware

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { name, mobile } = req.body;

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
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
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
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addToWishlist = async (req, res) => {
    const { productId, name, price, image, inStock } = req.body;

    try {
        const user = req.user;
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
    const { productId } = req.params;

    try {
        const user = req.user;
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
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Don't allow deleting self? (Optional check)
            await user.deleteOne();
            res.json({ success: true, message: 'User removed' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const resetPassword = async (req, res) => {
    let { email, otp, newPassword } = req.body;
    if (email) email = email.toLowerCase();

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        // Verify OTP
        const storedOtp = await Otp.findOne({ emailOrMobile: email });

        if (!storedOtp) {
            return res.status(400).json({ success: false, message: 'OTP not found or expired' });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (Date.now() > storedOtp.expiresAt) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // OTP Valid. Update Password.
        const user = await User.findOne({ emailOrMobile: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        // Delete OTP
        await Otp.deleteOne({ _id: storedOtp._id });

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const createStaff = async (req, res) => {
    let { name, email, password, role, isAdmin } = req.body;
    if (email) email = email.toLowerCase();

    try {
        const existingUser = await User.findOne({ emailOrMobile: email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            emailOrMobile: email,
            password,
            role: role || 'product_manager', // Default to a manager role if not specified
            isAdmin: isAdmin !== undefined ? isAdmin : true
        });

        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.emailOrMobile,
                role: newUser.role,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const googleLogin = async (req, res) => {
    let { email, name, googleId } = req.body;
    if (email) email = email.toLowerCase();

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        let user = await User.findOne({ emailOrMobile: email });

        if (!user) {
            // Create new user if not exists
            user = await User.create({
                name: name || 'Google User',
                emailOrMobile: email,
                password: 'GOOGLE_LOGIN_' + Math.random().toString(36).slice(-8), // Dummy password
                mobile: '',
                isSocialLogin: true,
                googleId: googleId
            });
        }

        // Check user status (Pending Approval or Rejected)
        if (user.status === 'Pending Approval') {
            return res.status(400).json({ success: false, message: 'Your business account is currently under review.' });
        }
        if (user.status === 'Rejected') {
            return res.status(400).json({ success: false, message: 'Your business account application was not approved. Please contact support for further assistance.' });
        }

        const businessStatus = await getBusinessStatus(user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.emailOrMobile,
                mobile: user.mobile,
                isAdmin: user.isAdmin,
                role: user.role,
                accountType: user.accountType || 'personal',
                businessStatus
            },
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    signup,
    login,
    businessRegister,
    googleLogin,
    updateProfile,
    changePassword,
    resetPassword,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getAllUsers,
    deleteUser,
    createStaff
};

