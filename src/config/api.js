// Central API URL helper
// Priority of configuration:
// 1. window.__APP_CONFIG__.REACT_APP_API_URL (runtime override placed in public/env.js)
// 2. process.env.REACT_APP_API_URL (build-time env via Create React App)
// 3. fallback to http://localhost:5001 for local development
const runtimeApi = (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.REACT_APP_API_URL) ? window.__APP_CONFIG__.REACT_APP_API_URL : null;
const BASE_API = (runtimeApi || process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export const apiUrl = (path = '') => {
    if (!path) return BASE_API;
    // ensure path starts with '/'
    return `${BASE_API}${path.startsWith('/') ? path : `/${path}`}`;
};

export default apiUrl;
