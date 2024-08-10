<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded-lg shadow-md w-96">
      <h2 class="mb-4 text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" id="email" type="email" required class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" id="password" type="password" required class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" class="w-full py-2 text-white bg-blue-500 rounded-lg">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const login = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (error) {
    console.error('Login failed', error);
  } 
};
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
