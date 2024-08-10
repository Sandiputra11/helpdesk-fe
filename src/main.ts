import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Import createPinia

import axios from './utility/axiosHelper';

const app = createApp(App);

const pinia = createPinia(); // Create pinia instance

// Use the router and pinia before mounting the app
app.use(router);
app.use(pinia); // Add pinia to the app

app.mount('#app');
