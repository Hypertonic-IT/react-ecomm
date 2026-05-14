import apiUrl from '../config/api';

const API_URL = apiUrl('/api/addresses');

export const addressService = {
    getAllAddresses: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';
            const token = localStorage.getItem('authToken');

            const response = await fetch(API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching addresses:', error);
            return { success: false, addresses: [] };
        }
    },

    addAddress: async (addressData) => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';
            const token = localStorage.getItem('authToken');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(addressData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding address:', error);
            return { success: false, message: 'Network error' };
        }
    },

    updateAddress: async (id, addressData) => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(addressData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating address:', error);
            return { success: false, message: 'Network error' };
        }
    },

    deleteAddress: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            const userId = user ? user.email : 'guest';
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting address:', error);
            return { success: false, message: 'Network error' };
        }
    }
};
