const Order = require('../models/Order');
const User = require('../models/User');

const addOrderItems = async (req, res) => {
    // In production, get user from req.user
    let userEmail = req.headers['user-id'];
    if (userEmail) userEmail = userEmail.toLowerCase();

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ emailOrMobile: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
            return;
        } else {
            const order = new Order({
                orderItems,
                user: user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            const createdOrder = await order.save();

            res.status(201).json({ success: true, order: createdOrder });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    // In production, get user from req.user
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

        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name emailOrMobile');

        if (order) {
            res.json({ success: true, order });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        // Typically would check for Admin role here, but simplification for now.
        const orders = await Order.find({})
            .populate('user', 'id name emailOrMobile')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;

            // Auto-update flags based on status text for backward compatibility if needed, 
            // or just rely on the status enum.
            if (order.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else if (order.status === 'Shipped') {
                order.isDelivered = false; // Just in case
            }

            if (req.body.status === 'Paid' || req.body.isPaid) { // Manual payment override
                order.isPaid = true;
                order.paidAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};
