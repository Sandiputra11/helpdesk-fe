import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getActivePinia } from 'pinia';

const TicketView = (() => import('../views/TicketView.vue'));
const LoginView = (() => import('../views/LoginView.vue'));
const RegisterView = (() => import('../views/RegisterView.vue'));
const AddTicketView = (() => import('../views/AddTicketView.vue'));
const DetailTicketView = (() => import('../views/DetailTicketView.vue'));
const KategoriView = (() => import('../views/KategoriView.vue'));
const AddKategoriView = (() => import('../views/AddKategoriView.vue'));
const EditKategoriView = (() => import('../views/EditKategoriView.vue'));
const ReportView = (() => import('../views/ReportView.vue'));
const UserManagementView = (() => import('../views/UserManagementView.vue'));
const AddUserView = (() => import('../views/AddUserView.vue'));
const EditUserView = (() => import('../views/EditUserView.vue'));
const ReportResultView = (() => import('../views/ReportResultView.vue'));
const SolvingView = (() => import('../views/SolvingView.vue'));

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TicketView,
    meta: { requiresAuth: true, roles: ['client','support', 'admin'] },
  },
  {
    path: '/kategori',
    name: 'Kategori',
    component: KategoriView,
    meta: { requiresAuth: true, roles: ['admin'] },
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
    meta: { requiresAuth: true, roles: ['client','support', 'admin'] },
  },
  {
    path: '/addkategori',
    name: 'AddKategori',
    component: AddKategoriView,
    meta: { requiresAuth: true, roles: [ 'admin'] },
  },
  {
    path: '/editkategori/:id',
    name: 'EditKategori',
    component: EditKategoriView,
    meta: { requiresAuth: true, roles: [ 'admin'] },
  },
  {
    path: '/detailticket/:ticketNumber',
    name: 'DetailTicket',
    component: DetailTicketView,
    meta: { requiresAuth: true, roles: ['client','support', 'admin'] },
  },
  {
    path: '/report',
    name: 'Report',
    component: ReportView,
    meta: { requiresAuth: true, roles: [ 'admin'] },
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresAuth: true, roles: [ 'admin'] },
  },
  {
    path: '/adduser',
    name: 'AddUser',
    component: AddUserView,
    meta: { requiresAuth: true,roles: [ 'admin'] },
  },
  {
    path: '/edituser/:id',
    name: 'EditUser',
    component: EditUserView,
    meta: { requiresAuth: true, roles: [ 'admin'] },
  },
  {
    path: '/report-result',
    name: 'ReportResult',
    component: ReportResultView,
    meta: { requiresAuth: true,roles: ['admin'] },
  },
  {
    path: '/solving',
    name: 'SolvingView',
    component: SolvingView,
    meta: { requiresAuth: true, roles: ['client','support', 'admin'] },
  }  
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
      return;
    }

    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRoles = authStore.user?.role || [];
      const hasRole = to.meta.roles.some(role => userRoles.includes(role));

      if (!hasRole) {
        next({ name: 'Home' }); // Redirect to a safe route or an access denied page
        return;
      }
    }

    next();
  } else {
    next();
  }
});

export default router;
