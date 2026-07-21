import axios from 'axios';

// API Axios Instance for Admin Panel
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach admin bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token && typeof token === 'string' && token.trim() && config.headers) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    } else {
      // Ensure we never send an empty Authorization header.
      if (config.headers && (config.headers as any).Authorization) {
        delete (config.headers as any).Authorization;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to centralize error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;
    const message = payload?.message || error.message || 'An unexpected error occurred';

    if (status === 401 || status === 422) {
      localStorage.removeItem('access_token');
    }

    return Promise.reject({
      success: false,
      status: status || 0,
      message,
      data: payload?.data ?? null,
      errors: payload?.errors ?? null,
      raw: error,
    });
  }
);

export default api;

