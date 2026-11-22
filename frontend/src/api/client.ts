import axios from 'axios';
import { env } from '../config/env';

export const API_BASE_URL = env.apiBaseUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Attach JWT token and language header to request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  const lang = localStorage.getItem('preferred_language');
  if (lang && config.headers) {
    config.headers.set('Accept-Language', lang);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor with token refresh & error normalization
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isMultipart = (originalRequest?.headers?.['Content-Type'] || '')
      .toString().includes('multipart/form-data');

    if (
      error.response?.status === 401
      && !originalRequest._retry
      && !isMultipart
      && originalRequest.url !== '/auth/login'
      && originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });
        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/?logout=true';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
