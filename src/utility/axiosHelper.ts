// src/utils/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { getActivePinia } from 'pinia';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from Pinia store
axiosInstance.interceptors.request.use(
  (config) => {
    const pinia = getActivePinia();
    if (pinia) {
      const authStore = useAuthStore(pinia);
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const pinia = getActivePinia();
      if (pinia) {
        const authStore = useAuthStore(pinia);
        try {
          await authStore.refreshToken(); // Refresh the token
          originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
          return axiosInstance(originalRequest); // Retry the request with new token
        } catch (refreshError) {
          // Handle refresh token error if necessary
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Methods
export const getTickets = () => axiosInstance.get('/tickets');
export const addTicket = (ticketData: any) => axiosInstance.post('/tickets', ticketData);
export const editTicket = (id: number, ticketData: any) => axiosInstance.put(`/tickets/${id}`, ticketData);
export const deleteTicket = (id: number) => axiosInstance.delete(`/tickets/${id}`);
export const login = (credentials: { email: string; password: string }) => axiosInstance.post('/auth/login', credentials);
export const register = (userData: any) => axiosInstance.post('/auth/register', userData);
export const logout = () => {
  const pinia = getActivePinia();
  if (pinia) {
    const authStore = useAuthStore(pinia);
    authStore.clearToken(); // Clear token in store
  }
  return axiosInstance.post('/auth/logout');
};
export default axios;
