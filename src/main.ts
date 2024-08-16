import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Import createPinia

import axios from 'axios';
import { useAuthStore } from './stores/auth';
import { getActivePinia } from 'pinia';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

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

const app = createApp(App);

const pinia = createPinia(); // Create pinia instance



// Use the router and pinia before mounting the app
app.use(router);
app.use(pinia); // Add pinia to the app

app.mount('#app');
