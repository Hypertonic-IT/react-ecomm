// Central API URL helper
// Reads REACT_APP_API_URL from environment (Create React App convention).
// Falls back to http://localhost:5001 when not provided for local development.
const BASE_API = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export const apiUrl = (path = '') => {
    if (!path) return BASE_API;
    // ensure path starts with '/'
    return `${BASE_API}${path.startsWith('/') ? path : `/${path}`}`;
};

export default apiUrl;
