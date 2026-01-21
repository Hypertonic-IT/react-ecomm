const API_URL = 'http://localhost:5001/api/orders';

export const orderService = {
    createOrder: async (orderData) => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify(orderData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, message: 'Network error' };
        }
    },

    getOrderById: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';

            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching order:', error);
            return { success: false, message: 'Network error' };
        }
    },

    getMyOrders: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';

            const response = await fetch(`${API_URL}/myorders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching my orders:', error);
            return { success: false, message: 'Network error' };
        }
    }
};
