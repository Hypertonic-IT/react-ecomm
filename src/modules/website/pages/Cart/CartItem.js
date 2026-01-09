
import React from 'react';
import { FaTrash, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { useShop } from '../../../../context/ShopContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart, toggleWishlist, wishlist } = useShop();

    const handleRemove = () => {
        removeFromCart(item.id, item.selectedColor, item.selectedSize);
        // Toast logic could go here
    };

    return (
        <div className="cart-item-card">
            <div className="item-image-wrap">
                <Link to={`/product/${item.id}`}>
                    <img src={item.image} alt={item.name} className="item-image" />
                </Link>
            </div>

            <div className="item-details">
                <div className="item-cat">{item.category}</div>
                <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>

                <div className="item-variants">
                    <div className="variant-badge">
                        <span
                            className="color-dot"
                            style={{ backgroundColor: item.selectedColor === 'navy' ? '#000080' : item.selectedColor === 'beige' ? '#f5f5dc' : item.selectedColor }}
                        ></span>
                        {item.selectedColor}
                    </div>
                    <div className="variant-badge">
                        Size: {item.selectedSize}
                    </div>
                </div>

                <div className="item-actions-row">
                    <div className="qty-control">
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)}
                            disabled={item.quantity <= 1}
                        >
                            <FaMinus size={10} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)}
                        >
                            <FaPlus size={10} />
                        </button>
                    </div>

                    <div className="item-price-area">
                        <span className="current-price">${(item.price * item.quantity).toFixed(2)}</span>
                        {/* Mocking original price logic for demo */}
                        {item.price > 50 && (
                            <>
                                <span className="original-price">${((item.price * 1.2) * item.quantity).toFixed(2)}</span>
                                <span className="savings-label">You saved ${(item.price * 0.2 * item.quantity).toFixed(2)}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div className="action-btns">
                    <button
                        className="action-icon"
                        onClick={() => toggleWishlist(item.id)}
                        style={{ color: wishlist.includes(item.id) ? 'red' : '#999' }}
                        title="Move to Wishlist"
                    >
                        <FaHeart />
                    </button>
                    <button
                        className="action-icon remove"
                        onClick={handleRemove}
                        title="Remove Item"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
