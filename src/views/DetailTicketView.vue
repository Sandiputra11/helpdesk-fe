<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <div class="container mx-auto mt-8">
        <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Ticket Details</h2>
          <div class="mb-4">
            <label for="issue" class="block text-sm font-medium text-gray-700">Issue</label>
            <input
              type="text"
              id="issue"
              v-model="issue"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readonly
            />
          </div>
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              id="status"
              v-model="status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readonly
            />
          </div>
          <div class="flex justify-end">
            <button @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useTicketStore } from '../stores/ticketStore';
  import Navbar from '../components/Navbar.vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const ticketStore = useTicketStore();
  const issue = ref('');
  const status = ref('');
  const route = useRoute();
  const router = useRouter();
  
  const ticketNumber = route.params.ticketNumber;
  
  onMounted(async () => {
  try {
    const response = await ticketStore.fetchTicket(ticketNumber); 

    if (response && response.data) {
      issue.value = response.data.issue || ''; 
      status.value = response.data.status || ''; 
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
  }
});
  
  const goBack = () => {
    router.push({ name: 'Home' }); 
  };
  </script>
  
 