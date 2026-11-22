import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';
import { env } from '../config/env';

const API_BASE_URL = env.apiBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    // Auto-logout if token is expired before making request
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
      window.location.href = '/login';
      return Promise.reject(new Error('JWT Token has expired.'));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle HTTP error boundaries
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Auto-logout on 401 Unauthorized status
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
