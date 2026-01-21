const Address = require('../models/Address');
const User = require('../models/User');

const getAllAddresses = async (req, res) => {
    // Expecting userId in headers for now (mock auth)
    // In production, extract user from req.user (JWT middleware)
    // In production, extract user from req.user (JWT middleware)
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const addresses = await Address.find({ user: user._id });

        // Transform _id to id for frontend compatibility
        const formattedAddresses = addresses.map(addr => ({
            id: addr._id,
            ...addr._doc
        }));

        res.status(200).json({ success: true, addresses: formattedAddresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addAddress = async (req, res) => {
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();
    const addressData = req.body;

    if (!addressData) {
        return res.status(400).json({ success: false, message: 'Address data required' });
    }

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const newAddress = await Address.create({
            user: user._id,
            ...addressData
        });

        res.status(201).json({
            success: true,
            message: 'Address added',
            address: { id: newAddress._id, ...newAddress._doc }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateAddress = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Address updated',
            address: { id: updatedAddress._id, ...updatedAddress._doc }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const deleteAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAddress = await Address.findByIdAndDelete(id);

        if (!deletedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        res.status(200).json({ success: true, message: 'Address deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getAllAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};
