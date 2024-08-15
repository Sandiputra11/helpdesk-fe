// src/utils/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { getActivePinia } from 'pinia';

axios.defaults.baseURL = 'http://192.168.1.221:8000';

// Add a request interceptor
axios.interceptors.request.use(
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
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
);

export default axios;
