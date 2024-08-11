<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <!-- Title on the left -->
        <h1 class="text-3xl font-bold text-gray-900">
          Ticket All
        </h1>

        <!-- Add button on the right -->
        <button
          @click="addTicket"
          class="relative inline-block px-6 py-3 font-medium text-green-600 border-2 border-green-600 group rounded-lg bg-white hover:bg-green-600 hover:text-white transition duration-300"
        >
          <span class="relative">Add</span>
        </button>
      </div>
    </div>
    <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="py-3 px-6 text-left">No</th>
            <th class="py-3 px-6 text-left">Ticket ID</th>
            <th class="py-3 px-6 text-left">Client Name</th>
            <th class="py-3 px-6 text-left">Status</th>
            <th class="py-3 px-6 text-left">Issue</th>
            <th class="py-3 px-6 text-left">Date</th>
            <th class="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ticket, index) in ticketStore.tickets" :key="ticket.id" class="border-t hover:bg-gray-100 transition-colors duration-300">
            <td class="py-4 px-6">{{ index + 1 }}</td>
            <td class="py-4 px-6">{{ ticket.ticket_number }}</td>
            <td class="py-4 px-6">{{ ticket.clientname }}</td>
            <td class="py-4 px-6">
              <span
                :class="{
                  'text-green-600 bg-green-100 px-2 py-1': ticket.status === 'open',
                  'text-yellow-500 bg-yellow-100 px-2 py-1': ticket.status === 'in_progress',
                  'text-red-600 bg-red-100 px-2 py-1': ticket.status === 'closed'
                }"
              >
                {{ ticket.status }}
              </span>
            </td>
            <td class="py-4 px-6">{{ ticket.issue }}</td>
            <td class="py-4 px-6">{{ new Date(ticket.created_at).toLocaleDateString() }}</td>
            <td class="py-4 px-6">
              <button
                @click="editTicket(ticket.ticket_number)"
                class="relative inline-block px-6 py-3 font-medium text-yellow-600 border-2 border-yellow-600 group rounded-lg bg-white hover:bg-yellow-600 hover:text-white transition duration-300"
              >
                <span class="relative">Edit</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';


import {  onMounted } from 'vue';
import { useTicketStore } from '../stores/ticketStore'; // Update the path as necessary
import { useRouter } from 'vue-router';

const ticketStore = useTicketStore();
const router = useRouter();


onMounted(() => {
  ticketStore.fetchTickets();
});

const addTicket = () => {
  // Logic for adding a new ticket (e.g., opening a modal)
  router.push({ name: 'addticket' }); // Assuming you have a route for adding a ticket
};

const editTicket = (ticketNumber: string) => {
  // Logic for editing a ticket (e.g., opening a modal)
  router.push({ name: 'editticket', params: { ticketNumber } }); // Assuming you have a route for editing a ticket
};
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
