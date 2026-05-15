import apiUrl from './api';

// Compute base once and avoid duplicating `/api` if the provided REACT_APP_API_URL
// already includes it. This makes the build resilient to env values like
// `https://api.kayaroop.com` or `https://api.kayaroop.com/api`.
const API_ROOT = apiUrl();
export const API_BASE_URL = API_ROOT.endsWith('/api') ? API_ROOT : apiUrl('/api');
export const BASE_URL = API_ROOT;

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    // If imagePath is already an absolute path from backend (starts with /), attach base
    if (imagePath.startsWith('/')) return apiUrl(imagePath);
    // otherwise, assume it's a relative path and return as-is
    return imagePath;
};

export default {
    API_BASE_URL,
    BASE_URL,
    getImageUrl
};
