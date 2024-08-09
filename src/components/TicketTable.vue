<template>
    <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center">
      <!-- Judul di sebelah kiri -->
      <h1 class="text-3xl font-bold text-gray-900">
        Ticket All
      </h1>

      <!-- Tombol Add di sebelah kanan -->
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
            <tr v-for="(ticket, index) in tickets" :key="ticket.id" class="border-t hover:bg-gray-100 transition-colors duration-300">
              <td class="py-4 px-6">{{ index + 1 }}</td>
              <td class="py-4 px-6">{{ ticket.ticketId }}</td>
              <td class="py-4 px-6">{{ ticket.clientName }}</td>
              <td class="py-4 px-6">
                <span
                  :class="{
                    'text-green-600 bg-green-100 px-2 py-1 ': ticket.status === 'Open',
                    'text-red-600 bg-red-100 px-2 py-1 ': ticket.status === 'Closed'
                  }"
                >
                  {{ ticket.status }}
                </span>
              </td>
              <td class="py-4 px-6">{{ ticket.issue }}</td>
              <td class="py-4 px-6">{{ ticket.date }}</td>
              <td class="py-4 px-6">
                <button
    @click="editTicket(ticket.id)"
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
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Ticket {
    id: number;
    ticketId: string;
    clientName: string;
    status: string;
    issue: string;
    date: string;
  }
  
  const tickets = ref<Ticket[]>([
    { id: 1, ticketId: 'T001', clientName: 'John Doe', status: 'Open', issue: 'Login issue', date: '2024-08-09' },
    { id: 2, ticketId: 'T002', clientName: 'Jane Smith', status: 'Closed', issue: 'Payment issue', date: '2024-08-10' },
    // Add more data as needed
  ]);
  
  const addTicket = () => {
    // Logic to add a new ticket
    console.log('Add ticket');
  };
  
  const editTicket = (id: number) => {
    // Logic to edit the ticket with the given id
    console.log('Edit ticket', id);
  };
  </script>
  
  <style scoped>
  </style>
  