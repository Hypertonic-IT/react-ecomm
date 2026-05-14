import React, { useEffect, useState } from 'react';
import { FaStar, FaExclamationTriangle, FaTrophy } from 'react-icons/fa';
import ReportFilter from './components/ReportFilter';
import './Reports.css';
import { API_BASE_URL, BASE_URL } from '../../../../../config';

const ProductReports = () => {
    const [data, setData] = useState({
        bestSelling: [],
        lowStock: [],
        topRated: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductStats();
    }, []);

    const fetchProductStats = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/reports/products`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching product stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="reports-container"><div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Product Reports...</div></div>;
    }

    return (
        <div className="reports-container fade-in">
            <div className="reports-header">
                <h1 className="reports-title">Product Performance</h1>
                <p className="reports-subtitle">Identify best sellers and inventory needs</p>
            </div>

            <ReportFilter showProductFilters={true} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>

                {/* Best Selling Products */}
                <div className="chart-container" style={{ margin: 0 }}>
                    <div className="chart-header">
                        <h3 className="chart-title"><FaTrophy style={{ color: '#fbbf24', marginRight: '8px' }} /> Best Selling Products</h3>
                    </div>
                    <div className="report-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Sold</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.bestSelling.length > 0 ? data.bestSelling.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '500' }}>{item.name}</td>
                                        <td>{item.soldQty}</td>
                                        <td style={{ fontWeight: '700' }}>₹{item.revenue.toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" style={{ textAlign: 'center' }}>No sales data yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Rated Products */}
                <div className="chart-container" style={{ margin: 0 }}>
                    <div className="chart-header">
                        <h3 className="chart-title"><FaStar style={{ color: '#3b82f6', marginRight: '8px' }} /> Top Rated Products</h3>
                    </div>
                    <div className="report-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Rating</th>
                                    <th>Reviews</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.topRated.length > 0 ? data.topRated.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '500' }}>{item.name}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FaStar size={12} color="#fbbf24" />
                                                {item.rating}
                                            </div>
                                        </td>
                                        <td>{item.numReviews}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" style={{ textAlign: 'center' }}>No rated products</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title" style={{ color: '#ef4444' }}>
                        <FaExclamationTriangle style={{ marginRight: '8px' }} /> Low Stock Alerts
                    </h3>
                </div>
                <div className="report-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock Level</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.lowStock.length > 0 ? data.lowStock.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: '500' }}>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>₹{item.price.toLocaleString()}</td>
                                    <td style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.countInStock}</td>
                                    <td>
                                        <span className="status-badge cancelled">Restock Needed</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#10b981' }}>Inventory levels are healthy!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductReports;
