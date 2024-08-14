import { defineStore } from 'pinia';
import axios from '../utility/axiosHelper';
import { ref, computed } from 'vue';
import router from '../router';
import Cookies from 'js-cookie';
import { handleError } from '../utility/errorHandler'; // Import error handler

interface User {
  id: number;
  name: string;
  email: string;
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
      const response = await axios.post('/api/auth/login', credentials);
      setToken(response.data.access_token);
      await fetchUser();
      router.push({ name: 'Home' });
    } catch (error) {
      handleError(error);
    }
  };

  const register = async (credentials: { name: string; email: string; password: string }) => {
    try {
      await axios.post('/api/auth/register', credentials);
      await login(credentials);
    } catch (error) {
      handleError(error); // Use error handler
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {});
      clearToken();
      user.value = null;
      router.push({ name: 'Login' });
    } catch (error) {
      handleError(error); // Use error handler
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.post('/api/auth/me', {});
      const { id, name, email } = response.data;
      setUser({ id, name, email });
    } catch (error) {
      handleError(error); // Use error handler
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh', {}, {
        headers: {
          // Authorization: Bearer `${token}`,
          Accept: 'application/json',
        },
      });
      setToken(response.data.access_token);
    } catch (error) {
      handleError(error); // Use error handler
      logout();
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return { user, token, login, register, logout, fetchUser, refreshToken, isAuthenticated, clearToken };
});
