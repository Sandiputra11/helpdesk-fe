<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <div class="container mx-auto mt-8">
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-gray-900">Edit User</h2>
  
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
              <label class="block mb-1 font-semibold text-gray-700">Change Password</label>
              <input type="password" v-model="password" placeholder="Leave blank if no change" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
  
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-gray-700">Role</label>
              <select v-model="role_id" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option
                v-for="role in userStore.roles"
                :key="role.id"
                :value="role.id"
              >
                {{ role.name }}
              </option>
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
                class="px-6 py-2 font-medium text-white transition duration-300 bg-yellow-600 rounded-lg hover:bg-yellow-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import { useUserStore } from '../stores/userStore';
  
  const userStore = useUserStore();
 
  
  const name = ref('');
  const email = ref('');
  const password = ref('');  // Added password field
  const role_id = ref();
  const router = useRouter();
  const route = useRoute();
  
  const userId: number = Number(route.params.id);
    onMounted(async() => {
    const user = await userStore.fetchUserById(userId);
    if (user) {
      name.value = user.name;
      email.value = user.email;
      role_id.value = user.role_id;
    }
  });
  
  const submitForm = async () => {
  try {
    // Call the updateUser method from the store with the updated user data
    await userStore.updateUser(userId, {
      name: name.value,
      email: email.value,
      role_id: role_id.value,
      password: password.value , // Only include password if it's provided
    });
    
    // After successful update, navigate back to User Management
    router.push({ name: 'UserManagement' });
  } catch (error) {
    console.error('Failed to update user', error);
  }
};
  onMounted(()=>{
    userStore.fetchRole();
  });
  const goBack = () => {
    router.push({ name: 'UserManagement' });
  };
  </script>
  
  <style scoped>
  /* Add scoped styles if needed */
  </style>
  