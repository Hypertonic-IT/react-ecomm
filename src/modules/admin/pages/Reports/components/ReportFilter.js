import React, { useState } from 'react';
import AdminSelect from '../../../components/AdminSelect'; // Fixed path
import { FaCalendarAlt, FaDownload, FaFilter } from 'react-icons/fa';
import '../Reports.css';

const ReportFilter = ({ onFilterChange, showProductFilters = true }) => {
    const [dateRange, setDateRange] = useState('month');
    const [category, setCategory] = useState('all');

    const handleDateChange = (val) => {
        setDateRange(val);
        onFilterChange({ dateRange: val, category });
    };

    const handleCategoryChange = (val) => {
        setCategory(val);
        onFilterChange({ dateRange, category: val });
    };

    return (
        <div className="report-filter-bar">
            <div className="filter-group">
                <div className="filter-item">
                    <span className="filter-label"><FaCalendarAlt /> Date Range</span>
                    <div style={{ width: '180px' }}>
                        <AdminSelect
                            options={[
                                { value: 'today', label: 'Today' },
                                { value: 'week', label: 'This Week' },
                                { value: 'month', label: 'This Month' },
                                { value: 'quarter', label: 'This Quarter' },
                                { value: 'year', label: 'This Year' },
                                { value: 'custom', label: 'Custom Range' }
                            ]}
                            value={dateRange}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                {showProductFilters && (
                    <div className="filter-item">
                        <span className="filter-label"><FaFilter /> Category</span>
                        <div style={{ width: '200px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'all', label: 'All Categories' },
                                    { value: 'men', label: 'Men' },
                                    { value: 'women', label: 'Women' },
                                    { value: 'kids', label: 'Kids' },
                                    { value: 'accessories', label: 'Accessories' }
                                ]}
                                value={category}
                                onChange={handleCategoryChange}
                            />
                        </div>
                    </div>
                )}
            </div>

            <button className="export-btn" onClick={() => alert('Exporting data to CSV...')}>
                <FaDownload /> Export Report
            </button>
        </div>
    );
};

export default ReportFilter;
