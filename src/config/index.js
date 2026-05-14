import apiUrl from './api';

export const API_BASE_URL = apiUrl();
export const BASE_URL = apiUrl();

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
