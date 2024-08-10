import { createRouter, createWebHistory } from 'vue-router';
import TicketView from '../views/TicketView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TicketView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  // Tambahkan rute lainnya di sini
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
