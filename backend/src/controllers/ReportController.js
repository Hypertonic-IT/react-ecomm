const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * Get Dashboard Summary Statistics
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Revenue
        const revenue = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } }, // Match AdminController logic: Revenue = All non-cancelled orders
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        // 2. Total Orders
        const totalOrders = await Order.countDocuments();

        // 3. Products Sold (Total Qty of items in all orders)
        const productsSold = await Order.aggregate([
            { $unwind: "$orderItems" },
            { $group: { _id: null, totalQty: { $sum: "$orderItems.qty" } } }
        ]);

        // 4. Total Customers
        const totalCustomers = await User.countDocuments({ isAdmin: false });

        res.json({
            success: true,
            data: {
                totalRevenue: revenue[0] ? revenue[0].total : 0,
                totalOrders: totalOrders,
                productsSold: productsSold[0] ? productsSold[0].totalQty : 0,
                totalCustomers: totalCustomers
            }
        });
    } catch (error) {
        console.error('Report Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get Sales Reports (Chart Data)
 */
exports.getSalesReports = async (req, res) => {
    try {
        const { dateRange } = req.query; // 'week', 'month', 'year', etc.

        let startDate = new Date();
        let groupFormat = "%Y-%m-%d";

        if (dateRange === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (dateRange === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (dateRange === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupFormat = "%Y-%m"; // Group by month for yearly view
        } else {
            startDate.setMonth(startDate.getMonth() - 1); // Default to month
        }

        // Aggregate Daily Sales
        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: { $nin: ['Cancelled'] } // Exclude cancelled
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 },
                    // Assuming tax/shipping as standard overhead, netSales can be total - tax
                    // For now, using totalPrice as revenue
                    netSales: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Transform for Chart (Recharts expects array of objects with 'name' key)
        const chartData = salesData.map(item => ({
            name: item._id,
            revenue: Math.round(item.revenue),
            orders: item.orders,
            netSales: Math.round(item.netSales)
        }));

        res.json({
            success: true,
            data: chartData
        });
    } catch (error) {
        console.error('Sales Report Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get Order Reports Stats
 */
exports.getOrderStats = async (req, res) => {
    try {
        // Aggregate counts by status
        const statusCounts = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const stats = {
            total: 0,
            delivered: 0,
            cancelled: 0,
            returned: 0,
            pending: 0,
            processing: 0
        };

        statusCounts.forEach(item => {
            stats.total += item.count;
            const status = item._id.toLowerCase();
            if (status === 'delivered') stats.delivered = item.count;
            else if (status === 'cancelled') stats.cancelled = item.count;
            else if (status === 'returned' || status === 'return requested') stats.returned += item.count;
            else if (status === 'pending') stats.pending = item.count;
            else if (status === 'processing') stats.processing = item.count;
        });

        // Also get recent orders for the table
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        res.json({
            success: true,
            data: {
                stats,
                orders: recentOrders
            }
        });
    } catch (error) {
        console.error('Order Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get Product Reports Stats
 */
exports.getProductStats = async (req, res) => {
    try {
        // 1. Best Selling Products (from Orders)
        const bestSelling = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product", // Note: This stores name or ID depending on schema
                    name: { $first: "$orderItems.name" },
                    soldQty: { $sum: "$orderItems.qty" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
                }
            },
            { $sort: { soldQty: -1 } },
            { $limit: 5 }
        ]);

        // 2. Low Stock Products
        const lowStock = await Product.find({ countInStock: { $lt: 20 } }) // Threshold < 20
            .sort({ countInStock: 1 })
            .limit(5)
            .select('name countInStock price image category');

        // 3. Top Rated
        const topRated = await Product.find({})
            .sort({ rating: -1 })
            .limit(5)
            .select('name rating numReviews image');

        res.json({
            success: true,
            data: {
                bestSelling,
                lowStock,
                topRated
            }
        });
    } catch (error) {
        console.error('Product Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats: exports.getDashboardStats,
    getSalesReports: exports.getSalesReports,
    getOrderStats: exports.getOrderStats,
    getProductStats: exports.getProductStats
};
