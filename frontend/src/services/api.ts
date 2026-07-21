import axios from 'axios';

// API Axios Instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to attach bearer token
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to centralize handling and error normalization
api.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;
    const message = payload?.message || error.message || 'An unexpected error occurred';

    // Centralized handling for common HTTP statuses
    if (status === 401 || status === 422) {
      // unauthorized/invalid token — remove local token and let callers handle redirect
      localStorage.removeItem('access_token');
    }


    // Build normalized error object
    const normalized = {
      success: false,
      status: status || 0,
      message,
      data: payload?.data ?? null,
      errors: payload?.errors ?? null,
      raw: error
    };

    return Promise.reject(normalized);
  }
);

export default api;
