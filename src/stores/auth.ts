import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '../router';
import Cookies from 'js-cookie';
import  handleError  from '../utility/errorHandler'; 
import { apiService } from '../utility/apiServices'; // Menggunakan apiService

interface User {
  id: number; 
  name: string;
  email: string;
  role: string;
  // Add any other properties as needed
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null);
  const token = ref<string>(Cookies.get('token') || '');

  const setToken = (newToken: string) => {
    token.value = newToken;
    Cookies.set('token', newToken, { expires: 1 });
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearToken = () => {
    token.value = '';
    Cookies.remove('token');
    localStorage.removeItem('user');
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiService.apiPost('/api/auth/login', credentials); // Menggunakan apiService.apiPost
      setToken(response.data.access_token);
      setUser(response.data.user);
      router.push({ name: 'Home' });
    } catch (error) {
      handleError(error); // Menggunakan handleError
    }
  };

  const register = async (credentials: { name: string; email: string; password: string }) => {
    try {
      await apiService.apiPost('/api/auth/register', credentials); // Menggunakan apiService.apiPost
      await login(credentials);
    } catch (error) {
      handleError(error); // Menggunakan handleError
    }
  };

  const logout = async () => {
    try {
      await apiService.apiPost('/api/auth/logout', {}); // Menggunakan apiService.apiPost
      clearToken();
      user.value = null;
      router.push({ name: 'Login' });
    } catch (error) {
      handleError(error); // Menggunakan handleError
    }
  };

  const fetchUser = async () => {
    try {
      const response = await apiService.apiPost('/api/auth/me', {}); // Menggunakan apiService.apiPost
      const { id, name, email, role } = response.data;
      setUser({ id, name, email, role });
    } catch (error) {
      handleError(error); // Menggunakan handleError
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiService.apiPost('/api/auth/refresh', {}, {
        headers: {
          Accept: 'application/json',
        },
      }); // Menggunakan apiService.apiPost
      setToken(response.data.access_token);
    } catch (error) {
      handleError(error); // Menggunakan handleError
      logout();
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return { user, token, login, register, logout, fetchUser, refreshToken, isAuthenticated, clearToken };
});
