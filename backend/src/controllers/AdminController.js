
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Orders
        const totalOrders = await Order.countDocuments();

        // 2. Total Revenue (Sum of totalPrice of all orders that are not cancelled)
        // Aggregation to sum totalPrice
        // Assuming status 'Cancelled' exists. Even if not, we sum everything for now or exclude Cancelled.
        const totalRevenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        // 3. Total Customers
        const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' }, isAdmin: { $ne: true } });

        // 4. Total Products
        const totalProducts = await Product.countDocuments();

        // 5. Order Status Breakdown
        const statusBreakdown = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Normalize status breakdown into a map
        // Statuses usually: Pending, Processing, Packed, Shipped, Delivered, Cancelled
        // Also handle legacy 'isDelivered' if status is missing.
        // Actually, let's refine the breakdown.
        // We can iterate and map them. 
        let statusStats = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };

        // Note: aggregation above gives counts per explicit status field.
        // If status is empty, fallback to isDelivered logic in frontend or here?
        // Let's rely on the counts we got. 
        // We can just return the raw array and let frontend map it, or improved structure.

        // Fetch specific counts for simplicity and robustness
        const pendingCount = await Order.countDocuments({
            $or: [{ status: 'Pending' }, { status: { $exists: false } }]
        });
        const processingCount = await Order.countDocuments({ status: 'Processing' });
        const shippedCount = await Order.countDocuments({ status: 'Shipped' });
        const deliveredCount = await Order.countDocuments({
            $or: [{ status: 'Delivered' }, { isDelivered: true }]
        });
        const cancelledCount = await Order.countDocuments({ status: 'Cancelled' });

        statusStats = {
            pending: pendingCount,
            processing: processingCount,
            shipped: shippedCount,
            delivered: deliveredCount,
            cancelled: cancelledCount
        };

        res.json({
            success: true,
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalProducts,
            statusStats
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats
};
