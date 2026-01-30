import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminPagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    className
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Logic to show limited page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of sliding window
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust window if close to boundaries
            if (currentPage <= 3) {
                end = 4;
            }
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            // Add ellipsis before window
            if (start > 2) {
                pages.push('...');
            }

            // Add window pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis after window
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={`admin-pagination-container ${className || ''}`}>
            <div className="pagination-info">
                Showing <span>{startItem}</span> to <span>{endItem}</span> of <span>{totalItems}</span> entries
            </div>

            <div className="pagination-controls">
                <button
                    className="pagination-btn nav-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous Page"
                >
                    <FaChevronLeft size={10} />
                </button>

                <div className="pagination-numbers">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="pagination-btn nav-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                >
                    <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default AdminPagination;
