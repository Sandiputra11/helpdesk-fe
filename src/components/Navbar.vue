<template>
  <nav class="flex items-center justify-between p-4 bg-white shadow-sm">
    <div class="flex items-center space-x-6">
      <!-- Logo -->
      <div class="text-xl font-bold text-gray-700">
        NexTix
      </div>
      <ul class="flex space-x-4 font-medium text-gray-700">
        <li class="transition-colors duration-300 hover:text-blue-500">
              <router-link to="/" class="block">Ticket</router-link>
            </li>
            <li v-if="canAccessCategory" class="transition-colors duration-300 hover:text-blue-500">
              <router-link to="/kategori" class="block">Kategori</router-link>
            </li>
        <!-- Other links -->
        <li><router-link to="/solving" class="transition-colors duration-300 hover:text-blue-500">Solving</router-link></li>
        <li v-if="canAccessReport"><router-link to="/report" class="transition-colors duration-300 hover:text-blue-500">Report</router-link></li>
        <li v-if="canAccessUserManagement"><router-link to="/user-management" class="transition-colors duration-300 hover:text-blue-500">User Management</router-link></li>
      </ul>
    </div>
    <div class="flex items-center space-x-4">
      <div v-if="isLoggedIn" class="text-gray-700">
        Hai, {{ authStore.user.name }}!
      </div>
      <div>
        <button @click="handleLogout" v-if="isLoggedIn" class="px-4 py-2 text-gray-700 transition duration-300 rounded-full">Logout</button>
        <div v-else>
          <router-link to="/login" class="px-4 py-2 text-gray-700 transition duration-300 rounded-full">Login</router-link>
          <router-link to="/register" class="px-4 py-2 text-gray-700 transition duration-300 rounded-full">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';

// Setup auth store
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);
const userRoles = computed(() => authStore.user?.role || []);

// Role-based access control
const canAccessReport = computed(() => userRoles.value.includes('admin'));
const canAccessUserManagement = computed(() => userRoles.value.includes('admin'));
const canAccessCategory = computed(() => userRoles.value.includes('admin'));

// Dropdown state
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

// Handle clicks outside the dropdown to close it
const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.relative ul');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
