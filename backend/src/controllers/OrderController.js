const Order = require('../models/Order');
const User = require('../models/User');

const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        couponCode,
        totalPrice
    } = req.body;

    try {
        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
            return;
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                discountPrice,
                couponCode,
                totalPrice
            });

            const createdOrder = await order.save();

            // Record coupon usage if a coupon code was applied
            if (couponCode) {
                try {
                    const Coupon = require('../models/Coupon');
                    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
                    if (coupon) {
                        await coupon.recordUsage(req.user._id, createdOrder._id, discountPrice || 0);
                    }
                } catch (couponError) {
                    console.error('Error recording coupon usage:', couponError);
                }
            }

            res.status(201).json({ success: true, order: createdOrder });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

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
        // Get all orders then filter to exclude business account orders
        const allOrders = await Order.find({})
            .populate('user', 'id name emailOrMobile accountType')
            .sort({ createdAt: -1 });

        // Show only normal (personal) user orders in the admin Orders section
        const normalOrders = allOrders.filter(o => {
            if (!o.user) return true; // guest orders always shown
            return o.user.accountType !== 'business';
        });

        res.json(normalOrders);
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

const trackOrder = async (req, res) => {
    let { orderId, email } = req.body;

    if (!orderId || !email) {
        return res.status(400).json({ success: false, message: 'Please enter both Order ID and Email.' });
    }

    try {
        // Sanitize Order ID (strip leading # and ORD-)
        let cleanOrderId = orderId.replace(/^#/, '').replace(/^ORD-/, '').trim();

        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(cleanOrderId)) {
            return res.status(400).json({ success: false, message: 'Order not found. Please check your Order ID and try again.' });
        }

        const order = await Order.findById(cleanOrderId).populate('user', 'emailOrMobile');
        if (!order) {
            return res.status(400).json({ success: false, message: 'Order not found. Please check your Order ID and try again.' });
        }

        // Validate email address
        if (!order.user || !order.user.emailOrMobile || order.user.emailOrMobile.toLowerCase() !== email.toLowerCase().trim()) {
            return res.status(400).json({ success: false, message: 'The provided email address does not match this order.' });
        }

        // Map status to active/date timeline steps for display
        const statuses = [
            'Pending',
            'Processing',
            'Packed',
            'Shipped',
            'Out for Delivery',
            'Delivered'
        ];

        const currentStatusIndex = statuses.indexOf(order.status);
        
        // Estimate delivery (e.g. 5 days after creation)
        const estDate = new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000);
        const estDateStr = estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const timeline = statuses.map((statusName, idx) => {
            let active = idx <= currentStatusIndex;
            let date = 'Pending';

            if (idx === 0) {
                // Order Placed date is order creation date
                date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } else if (idx <= currentStatusIndex) {
                // Use updated timestamp for current/past steps
                date = new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }

            return {
                status: statusName,
                date,
                active
            };
        });

        res.json({
            success: true,
            order: {
                id: order._id,
                status: order.status,
                estimatedDelivery: estDateStr,
                currentLocation: order.status === 'Delivered' ? 'Delivered to Destination' : (order.status === 'Shipped' || order.status === 'Out for Delivery' ? 'In Transit' : 'Warehouse'),
                timeline: timeline
            }
        });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getB2BOrders = async (req, res) => {
    try {
        const allOrders = await Order.find({})
            .populate('user', 'id name emailOrMobile accountType')
            .sort({ createdAt: -1 });

        const businessOrders = allOrders.filter(o => {
            return o.user && o.user.accountType === 'business';
        });

        res.json(businessOrders);
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
    getB2BOrders,
    updateOrderStatus,
    trackOrder
};
