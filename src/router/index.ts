import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getActivePinia } from 'pinia';
import TicketView from '../views/TicketView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TicketView,
    meta: { requiresAuth: true }
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

router.beforeEach(async (to, from, next) => {
  const pinia = getActivePinia();
  if (pinia) {
    const authStore = useAuthStore(pinia);

    // Refresh the token if it's present in cookies but not in the store
    if (authStore.token && !authStore.isAuthenticated) {
      try {
        await authStore.refreshToken();
        await authStore.fetchUser();
      } catch (error) {
        authStore.clearToken();
        next({ name: 'Login' });
        return;
      }
    }

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
