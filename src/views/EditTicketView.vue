<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Edit Ticket</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
import { useTicketStore } from '../stores/ticketStore';
import Navbar from '../components/Navbar.vue';
import { useRoute, useRouter } from 'vue-router';

const ticketStore = useTicketStore();
const status = ref('');
const route = useRoute();
const router = useRouter();

const ticketNumber = route.params.ticketNumber; // Get the ticket number from the route params

onMounted(async () => {
  const ticket = await ticketStore.fetchTicket(ticketNumber); // Fetch the ticket details

  if (ticket) {
    status.value = ticket.status; // Set the status field with the fetched ticket data
  }
});

const handleSubmit = async () => {
  if (status.value) {
    await ticketStore.updateTicket(ticketNumber, status.value); // Update the ticket with the new status
    router.push({ name: 'Home' }); // Redirect to the ticket view page after editing
  }
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
