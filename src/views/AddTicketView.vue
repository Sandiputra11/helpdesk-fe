<template>
    <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
        <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">Add Ticket</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="issue" class="block text-sm font-medium text-gray-700">Issue</label>
          <input
            type="text"
            id="issue"
            v-model="issue"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe the issue..."
            required
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Ticket
          </button>
        </div>
      </form>
    </div>
    </div>
  </div>
  
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useTicketStore } from '../stores/ticketStore';
import Navbar from '../components/Navbar.vue';


  
  const ticketStore = useTicketStore();
  const issue = ref('');
  
  const handleSubmit = async () => {
    if (issue.value.trim()) {
      await ticketStore.addTicket(issue.value);
      issue.value = '';
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
  </style>
  