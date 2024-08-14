<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <div class="container mx-auto mt-8">
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-gray-900">Add New User</h2>
  
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-gray-700">Name</label>
              <input type="text" v-model="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
  
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-gray-700">Email</label>
              <input type="email" v-model="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
  
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-gray-700">Password</label>
              <input type="password" v-model="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
  
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-gray-700">Role</label>
              <select v-model="role" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="admin">Admin</option>
                <option value="support">Support</option>
                <option value="client">Client</option>
              </select>
            </div>
  
            <div class="flex justify-between">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-2 font-medium text-gray-600 transition duration-300 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
              <button
                type="submit"
                class="px-6 py-2 font-medium text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/userStore';
  import Navbar from '../components/Navbar.vue';
  const userStore= useUserStore();
  const name = ref('');
  const email = ref('');
  const password = ref('');  // Added password field
  const role = ref('client');
  const router = useRouter();
  
  const submitForm = async() => {
    try {
      await userStore.registerUser({
        name: name.value,
        email: email.value,
        role: role.value,
        password: password.value,
      });
      router.push({ name: 'UserManagement' });
    } catch (error) {
      console.error("Add User failed", error);
    }
  
  };
  
  const goBack = () => {
    router.push({ name: 'UserManagement' });
  };
  </script>
  
  <style scoped>
  /* Add scoped styles if needed */
  </style>
  