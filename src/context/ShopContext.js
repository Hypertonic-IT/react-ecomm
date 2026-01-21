import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as productsData } from '../data/fashionData';
import Toast from '../modules/website/components/Toast/Toast';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [products] = useState(productsData);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState({ loggedIn: false, name: null });
    const [toast, setToast] = useState(null); // { message, type }
    const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

    // Load cart from local storage on init
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error("Failed to parse cart data:", error);
                localStorage.removeItem('cart'); // Clear corrupted data
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) =>
                item.id === product.id &&
                item.selectedColor === product.selectedColor &&
                item.selectedSize === product.selectedSize
            );
            if (existing) {
                return prev.map((item) =>
                    (item.id === product.id &&
                        item.selectedColor === product.selectedColor &&
                        item.selectedSize === product.selectedSize)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setToast({ message: 'Item added to cart!', type: 'success' });
    };

    const removeFromCart = (id, selectedColor, selectedSize) => {
        setCart((prev) => prev.filter((item) =>
            !(item.id === id &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize)
        ));
    };

    const updateQuantity = (id, selectedColor, selectedSize, delta) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const toggleWishlist = (productId) => {
        setWishlist((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            }
            return [...prev, productId];
        });
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const value = {
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        wishlist,
        toggleWishlist,
        user,
        setUser,
        user,
        setUser,
        getCartTotal,
        clearCart,
        isTrackOrderOpen,
        openTrackOrder: () => setIsTrackOrderOpen(true),
        closeTrackOrder: () => setIsTrackOrderOpen(false)
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </ShopContext.Provider>
    );
};
