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
    const [appliedCoupon, setAppliedCoupon] = useState(null);

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

    // Load cart and coupon from local storage on init
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

        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (e) {
                localStorage.removeItem('appliedCoupon');
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Save coupon to local storage whenever it changes
    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('appliedCoupon');
        }
    }, [appliedCoupon]);

    // Validate coupon when cart changes
    useEffect(() => {
        if (appliedCoupon && cart.length > 0) {
            const currentTotal = cart.reduce((total, item) => {
                const effectivePrice = item.salePrice || item.price;
                return total + (effectivePrice * item.quantity);
            }, 0);

            // Check if coupon has minimum cart value requirement
            if (appliedCoupon.minCartValue && currentTotal < appliedCoupon.minCartValue) {
                setAppliedCoupon(null);
                setToast({
                    message: `Coupon removed: Cart total (₹${currentTotal.toFixed(2)}) is below minimum required (₹${appliedCoupon.minCartValue})`,
                    type: 'info'
                });
            }
            // Check if discount would result in negative total
            else if (appliedCoupon.discount >= currentTotal) {
                setAppliedCoupon(null);
                setToast({
                    message: `Coupon removed: Discount (₹${appliedCoupon.discount}) exceeds cart total (₹${currentTotal.toFixed(2)})`,
                    type: 'info'
                });
            }
        }
        // Remove coupon if cart is empty
        else if (appliedCoupon && cart.length === 0) {
            setAppliedCoupon(null);
        }
    }, [cart, appliedCoupon]);

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
        return cart.reduce((total, item) => {
            // Use salePrice if available (when product has discount), otherwise use regular price
            const effectivePrice = item.salePrice || item.price;
            return total + (effectivePrice * item.quantity);
        }, 0);
    };

    const applyCoupon = async (code, userId = null) => {
        try {
            const response = await fetch('http://localhost:5001/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    cartTotal: getCartTotal(),
                    cartItems: cart.map(item => ({
                        productId: item.id, // Backend model expects 'productId'
                        qty: item.quantity,
                        price: item.salePrice || item.price, // Use effective price
                        category: item.category
                    })),
                    userId
                })
            });

            const data = await response.json();
            if (data.success) {
                setAppliedCoupon(data.data);
                setToast({ message: 'Coupon applied successfully!', type: 'success' });
                return { success: true };
            } else {
                setToast({ message: data.message || 'Invalid coupon', type: 'error' });
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Coupon validation error:", error);
            setToast({ message: 'Error applying coupon', type: 'error' });
            return { success: false, message: 'Server error' };
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setToast({ message: 'Coupon removed', type: 'info' });
    };

    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null);
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedCoupon');
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
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isTrackOrderOpen,
        openTrackOrder: () => setIsTrackOrderOpen(true),
        closeTrackOrder: () => setIsTrackOrderOpen(false),
        showToast: (message, type = 'success') => setToast({ message, type })
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
