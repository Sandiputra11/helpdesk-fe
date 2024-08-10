<template>
  <nav class="flex items-center justify-between p-4 bg-white shadow-sm">
    <div class="flex items-center space-x-6">
      <ul class="flex space-x-4 font-medium text-gray-700">
        <li><router-link to="/" class="transition-colors duration-300 hover:text-blue-500">Ticket</router-link></li>
        <li><router-link to="#" class="transition-colors duration-300 hover:text-blue-500">Solving</router-link></li>
        <li><router-link to="#" class="transition-colors duration-300 hover:text-blue-500">Report</router-link></li>
      </ul>
    </div>
    <div>
      <button @click="handleLogout" v-if="isLoggedIn" class="px-4 py-2 text-gray-700 transition duration-300 rounded-full">Logout</button>
      <div v-else>
        <router-link to="/login" class="px-4 py-2 text-gray-700 transition duration-300 rounded-full">Login</router-link>
        <router-link to="/register" class="px-4 py-2 text-gray-700 transition duration-300 rounded-full">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { logout } from '../utility/axiosHelper';
import { useRouter } from 'vue-router';

const router = useRouter();

const isLoggedIn = computed(() => !!localStorage.getItem('token'));

const handleLogout = () => {
  logout().then(() => {
    localStorage.removeItem('token');
    router.push('/login');
  }).catch(error => {
    console.error('Error logging out:', error);
  });
};
</script>

<style scoped>
</style>
