<template>
  <nav class="flex items-center justify-between p-4 bg-white shadow-sm">
    <div class="flex items-center space-x-6">
      <ul class="flex space-x-4 font-medium text-gray-700">
        <li class="relative">
          <button @click="toggleDropdown" class="transition-colors duration-300 hover:text-blue-500">
            Ticket
          </button>
          <!-- Dropdown Menu -->
          <ul v-if="dropdownOpen" class="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-40">
            <li class="px-4 py-2 transition-colors duration-300 hover:bg-gray-100">
              <router-link to="/" class="block">Ticket</router-link>
            </li>
            <li class="px-4 py-2 transition-colors duration-300 hover:bg-gray-100">
              <router-link to="/kategori" class="block">Kategori</router-link>
            </li>
          </ul>
        </li>
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
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => !!localStorage.getItem('token'));

const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Optional: Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
});
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
