import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';

const ProductList = () => {
    const { user } = useAdminAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/products');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`http://localhost:5001/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'user-id': user?.email
                    }
                });
                setProducts(products.filter(product => product._id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const toggleProductStatus = async (product) => {
        try {
            const updatedStatus = !product.isActive;

            const response = await fetch(`http://localhost:5001/api/products/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user?.email
                },
                body: JSON.stringify({ ...product, isActive: updatedStatus })
            });

            if (response.ok) {
                setProducts(products.map(p =>
                    p._id === product._id ? { ...p, isActive: updatedStatus } : p
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Filter products
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="admin-page-container fade-in">
            <div className="table-container">
                {/* Table Toolbar */}
                <div className="table-toolbar">
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <select className="entries-select" defaultValue="15">
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>

                        <Link to="/admin/products/new" className="admin-btn-outline">
                            <FaPlus size={12} /> Add new
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading inventory...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }}
                                            />
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>ID: {product._id.substring(0, 8)}...</div>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>${product.price}</td>
                                        <td><span className="status-badge status-primary">{product.category}</span></td>
                                        <td>
                                            {product.countInStock > 0 ? (
                                                <span className="status-badge status-success">{product.countInStock} in stock</span>
                                            ) : (
                                                <span className="status-badge status-danger">Out of Stock</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className={`stock-indicator stock-${product.isActive ? 'in' : 'out'}`}></span>
                                                <button
                                                    onClick={() => toggleProductStatus(product)}
                                                    className={`status-badge ${product.isActive ? 'status-success' : 'status-neutral'}`}
                                                    style={{ border: 'none', cursor: 'pointer' }}
                                                >
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <Link to={`/admin/products/edit/${product._id}`} className="admin-btn-icon" title="Edit">
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="admin-btn-danger"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{ padding: '20px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="admin-btn-secondary admin-btn-sm"
                                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    Previous
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--admin-text)' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="admin-btn-secondary admin-btn-sm"
                                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )
                }
            </div >
        </div >
    );
};

export default ProductList;
