import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { authService } from '../../../../../services/authService';
import { getImageUrl } from 'config';

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const items = await authService.getWishlist();
            setWishlistItems(items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (e, id) => {
        e.stopPropagation();
        try {
            await authService.removeFromWishlist(id);
            // Optimistic update or refetch
            setWishlistItems(prev => prev.filter(item => item.productId !== id));
        } catch (error) {
            alert('Failed to remove item');
        }
    };

    const handleItemClick = (id) => {
        navigate(`/product/${id}`);
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Wishlist...</div>;

    if (wishlistItems.length === 0) {
        return (
            <div style={{
                background: '#fff', borderRadius: '8px', padding: '50px',
                textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <FaHeart style={{ fontSize: '40px', color: '#eee', marginBottom: '15px' }} />
                <h3>Your Wishlist is Empty</h3>
                <p style={{ color: '#666' }}>Save items you love to buy later.</p>
            </div>
        );
    }

    return (
        <div style={{
            background: '#fff', borderRadius: '8px', padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                My Wishlist ({wishlistItems.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {wishlistItems.map(item => (
                    <div
                        key={item.productId}
                        onClick={() => handleItemClick(item.productId)}
                        style={{
                            border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden',
                            position: 'relative', transition: 'transform 0.2s', cursor: 'pointer'
                        }}
                    >
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                            <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <button
                            onClick={(e) => removeFromWishlist(e, item.productId)}
                            style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: '#fff', border: 'none', borderRadius: '50%',
                                width: '30px', height: '30px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                color: '#e74c3c'
                            }}
                            title="Remove"
                        >
                            <FaTrash size={12} />
                        </button>

                        <div style={{ padding: '15px' }}>
                            <h4 style={{ margin: '0 0 5px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#333' }}>₹{item.price}</span>
                                <span style={{
                                    fontSize: '12px',
                                    color: item.inStock ? '#27ae60' : '#e74c3c'
                                }}>
                                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <button style={{
                                width: '100%', marginTop: '15px', padding: '8px',
                                background: item.inStock ? '#000' : '#eee', // Updated to Black theme
                                color: item.inStock ? '#fff' : '#999',
                                border: 'none', borderRadius: '4px',
                                cursor: item.inStock ? 'pointer' : 'not-allowed'
                            }}>
                                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
