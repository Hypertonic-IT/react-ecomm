import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as productsData } from '../data/fashionData';
import Toast from '../modules/website/components/Toast/Toast';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    // Start with empty array, fetch from API. Fallback to static if needed or empty.
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState({ loggedIn: false, name: null });
    const [toast, setToast] = useState(null); // { message, type }
    const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

    const [categories, setCategories] = useState([]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/products');
                if (response.ok) {
                    const data = await response.json();
                    // If backend is empty, maybe use static data as seed? 
                    // For now, let's use backend preferred.
                    // Map backend data to frontend structure if needed (e.g. _id -> id)
                    const mappedProducts = data.map(p => ({
                        id: p._id, // Map _id to id for frontend compatibility
                        ...p,
                        price: parseFloat(p.price)
                    }));

                    if (mappedProducts.length > 0) {
                        // Only show active products on the website
                        const activeProducts = mappedProducts.filter(p => p.isActive !== false);
                        setProducts(activeProducts);
                    } else {
                        setProducts([]); // No products in DB
                    }
                } else {
                    setProducts([]); // API error
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]); // Fetch error
            }
        };
        fetchProducts();
    }, []);

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
        // Find existing quantity in cart to check total
        const existingItem = cart.find(item =>
            item.id === product.id &&
            item.selectedColor === product.selectedColor &&
            item.selectedSize === product.selectedSize
        );

        const currentQty = existingItem ? existingItem.quantity : 0;

        if (currentQty + 1 > product.countInStock) {
            setToast({ message: `Cannot add more. Data currently not available (Only ${product.countInStock} in stock)`, type: 'error' });
            return;
        }

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
        setCart((prev) => {
            return prev.map((item) => {
                if (item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize) {
                    const newQuantity = item.quantity + delta;

                    // Check stock limit if increasing
                    if (delta > 0 && newQuantity > item.countInStock) {
                        setToast({ message: `Cannot add more. Only ${item.countInStock} available.`, type: 'error' });
                        return item;
                    }

                    return { ...item, quantity: Math.max(1, newQuantity) };
                }
                return item;
            });
        });
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
        categories,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        wishlist,
        toggleWishlist,
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
