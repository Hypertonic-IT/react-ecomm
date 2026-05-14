import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaPlus, FaSearch, FaEdit, FaTrash
} from 'react-icons/fa';
import { useAdminAuth } from '../../../../context/AdminAuthContext';
import '../../admin.css';
import AdminSelect from '../../components/AdminSelect';
import AdminPagination from '../../components/AdminPagination';
import { API_BASE_URL, BASE_URL, getImageUrl } from 'config';

const BlogList = () => {
    const { user } = useAdminAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/blogs`);
            const data = await response.json();
            setBlogs(data.blogs || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
                    }
                });
                if (response.ok) {
                    fetchBlogs();
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || blog.status === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
        <div className="admin-page-container fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Blog Posts</h1>
                    <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                        Manage your blog posts and news
                    </p>
                </div>
            </div>

            <div className="table-container" style={{ marginTop: '24px' }}>
                <div className="table-toolbar" style={{ marginBottom: '16px' }}>
                    <div className="entries-wrapper">
                        <span>Showing</span>
                        <AdminSelect
                            options={[
                                { value: 10, label: '10' },
                                { value: 25, label: '25' },
                                { value: 50, label: '50' }
                            ]}
                            value={entriesPerPage}
                            onChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
                            styles={{
                                control: (base) => ({ ...base, minHeight: '32px', width: '70px', fontSize: '12px' })
                            }}
                            isSearchable={false}
                        />
                        <span>entries</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by title..."
                                className="search-input-modern"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <FaSearch className="search-icon-modern" size={14} />
                        </div>
                        <div style={{ width: '180px' }}>
                            <AdminSelect
                                options={[
                                    { value: 'All', label: 'All Status' },
                                    { value: 'published', label: 'Published' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'archived', label: 'Archived' }
                                ]}
                                value={filterStatus}
                                onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
                                placeholder="Filter Status"
                            />
                        </div>
                    </div>

                    <Link to="/admin/blogs/new" className="admin-btn-outline">
                        <FaPlus size={12} /> Create Post
                    </Link>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading blogs...
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Blogs Found</h3>
                        <Link to="/admin/blogs/new" className="admin-btn-outline">
                            <FaPlus /> Create First Post
                        </Link>
                    </div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Category</th>
                                    <th>Published</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBlogs.map(blog => (
                                    <tr key={blog._id}>
                                        <td>
                                            {blog.image ? (
                                                <img src={getImageUrl(blog.image)} alt={blog.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                            ) : (
                                                <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }}></div>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{blog.title}</td>
                                        <td>
                                            <span className={`status-badge status-${blog.status === 'published' ? 'success' :
                                                    blog.status === 'draft' ? 'warning' :
                                                        'neutral'
                                                }`}>
                                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{blog.category}</td>
                                        <td>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <Link to={`/admin/blogs/edit/${blog._id}`} className="admin-btn-icon" title="Edit">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(blog._id)} className="admin-btn-danger" title="Delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredBlogs.length}
                            itemsPerPage={entriesPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogList;
