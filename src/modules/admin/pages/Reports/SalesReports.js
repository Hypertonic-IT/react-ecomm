import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import ReportFilter from './components/ReportFilter';
import AdminPagination from '../../components/AdminPagination';
import './Reports.css';
import { API_BASE_URL, BASE_URL } from 'config';

const SalesReports = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDateRange, setFilterDateRange] = useState('month');

    useEffect(() => {
        fetchSalesData();
    }, [filterDateRange]);

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/reports/sales?dateRange=${filterDateRange}`);
            const data = await response.json();
            if (data.success) {
                setSalesData(data.data);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filters) => {
        if (filters.dateRange) {
            setFilterDateRange(filters.dateRange);
        }
    };

    if (loading) {
        return <div className="reports-container"><div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Sales Data...</div></div>;
    }

    return (
        <div className="reports-container fade-in">
            <div className="reports-header">
                <h1 className="reports-title">Sales Reports</h1>
                <p className="reports-subtitle">Revenue, orders, and sales performance</p>
            </div>

            <ReportFilter onFilterChange={handleFilterChange} />

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '32px' }}>

                {/* Revenue Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Revenue Over Time</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                                <YAxis style={{ fontSize: '12px' }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Orders Over Time</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                                <YAxis style={{ fontSize: '12px' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Sales Table (Using Chart Data for Summary) */}
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Sales Data Breakdown</h3>
                </div>
                <div className="report-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Orders</th>
                                <th>Gross Revenue</th>
                                <th>Net Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.length > 0 ? salesData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.name}</td>
                                    <td>{row.orders}</td>
                                    <td>₹{row.revenue.toLocaleString()}</td>
                                    <td style={{ fontWeight: '700' }}>₹{row.netSales.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>No sales data found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesReports;
