import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getActivePinia } from 'pinia';
import TicketView from '../views/TicketView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AddTicketView from '../views/AddTicketView.vue';
import DetailTicketView from '../views/DetailTicketView.vue';
import KategoriView from '../views/KategoriView.vue';
import AddKategoriView from '../views/AddKategoriView.vue';
import EditKategoriView from '../views/EditKategoriView.vue';
import ReportView from '../views/ReportView.vue';
import UserManagementView from '../views/UserManagementView.vue';
import AddUserView from '../views/AddUserView.vue';
import EditUserView from '../views/EditUserView.vue';
import ReportResultView from '../views/ReportResultView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TicketView,
    meta: { requiresAuth: true },
  },
  {
    path: '/kategori',
    name: 'Kategori',
    component: KategoriView,
    meta: { requiresAuth: true },
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
  {
    path: '/addticket',
    name: 'AddTicket',
    component: AddTicketView,
    meta: { requiresAuth: true },
  },
  {
    path: '/addkategori',
    name: 'AddKategori',
    component: AddKategoriView,
    meta: { requiresAuth: true },
  },
  {
    path: '/editkategori/:id',
    name: 'EditKategori',
    component: EditKategoriView,
    meta: { requiresAuth: true },
  },
  {
    path: '/detailticket/:ticketNumber',
    name: 'DetailTicket',
    component: DetailTicketView,
    meta: { requiresAuth: true },
  },
  {
    path: '/report',
    name: 'Report',
    component: ReportView,
    meta: { requiresAuth: true },
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresAuth: true },
  },
  {
    path: '/adduser',
    name: 'AddUser',
    component: AddUserView,
    meta: { requiresAuth: true },
  },
  {
    path: '/edituser/:id',
    name: 'EditUser',
    component: EditUserView,
    meta: { requiresAuth: true },
  },
  {
    path: '/report-result',
    name: 'ReportResult',
    component: ReportResultView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const pinia = getActivePinia();
  if (pinia) {
    const authStore = useAuthStore(pinia);

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
