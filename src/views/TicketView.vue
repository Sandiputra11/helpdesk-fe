<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="min-h-screen p-6 bg-gray-100">
        <div class="px-4 py-6 max-w-8xl sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <!-- Title on the left -->
            <h1 class="text-3xl font-bold text-gray-900">
              Ticket All
            </h1>

            <!-- Search input with button -->
            <div class="flex">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search..."
                class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-l-lg"
              />
              <button
                @click="performSearch"
                class="relative inline-block px-6 py-2 font-medium text-white transition duration-300 bg-green-600 border-2 border-green-600 rounded-r-lg hover:bg-green-700"
              >
                Search
              </button>
            </div>

            <!-- Add button on the right -->
            <button
              @click="addTicket"
              class="relative inline-block px-6 py-3 font-medium text-green-600 transition duration-300 bg-white border-2 border-green-600 rounded-lg group hover:bg-green-600 hover:text-white"
            >
              <span class="relative">Add</span>
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table class="min-w-full bg-white border">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-3 text-left cursor-pointer" @click="sortTable('ticket_number')">
                  <div class="flex items-center">
                    Ticket ID
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 ml-2"
                      :class="sortKey === 'ticket_number' && sortOrder === 'asc' ? 'transform rotate-180' : ''"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-3 text-left">Client Name</th>
                <th class="px-6 py-3 text-left">Assign By</th>
                <th class="px-6 py-3 text-left">Category</th>
                <th class="px-6 py-3 text-left cursor-pointer" @click="sortTable('status')">
                  <div class="flex items-center">
                    Status
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 ml-2"
                      :class="sortKey === 'status' && sortOrder === 'asc' ? 'transform rotate-180' : ''"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-3 text-left">Subject</th>
                <th class="px-6 py-3 text-left cursor-pointer" @click="sortTable('created_at')">
                  <div class="flex items-center">
                    Date
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 ml-2"
                      :class="sortKey === 'created_at' && sortOrder === 'asc' ? 'transform rotate-180' : ''"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(ticket, index) in paginatedTickets"
                :key="ticket.id"
                class="transition-colors duration-300 border-t hover:bg-gray-100"
              >
                <td class="px-6 py-4">{{ ticket.ticket_number }}</td>
                <td class="px-6 py-4">{{ ticket.clientname }}</td>
                <td class="px-6 py-4">{{ ticket.assign_by }}</td>
                <td class="px-6 py-4">{{ ticket.kategori_name }}</td>
                <td class="px-6 py-4">
                  <select
                    v-model="ticket.status"
                    @change="updateTicketStatus(ticket)"
                    class="px-2 py-1 text-gray-700 bg-white border rounded"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td class="px-6 py-4">{{ ticket.subject }}</td>
                <td class="px-6 py-4">{{ new Date(ticket.created_at).toLocaleDateString() }}</td>
                <td class="px-6 py-4">
                  <button
                    @click="viewTicketDetail(ticket.ticket_number)"
                    class="relative inline-block px-6 py-3 font-medium text-yellow-600 transition duration-300 bg-white border-2 border-yellow-600 rounded-lg group hover:bg-yellow-600 hover:text-white"
                  >
                    <span class="relative">Detail</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-4">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import { ref, computed, onMounted } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { useRouter } from 'vue-router';


const ticketStore = useTicketStore();
const router = useRouter();
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust the items per page as needed
const sortKey = ref<'ticket_number' | 'clientname' | 'assign_by' | 'kategori_name' | 'status' | 'created_at'>('ticket_number');
const sortOrder = ref('asc'); // asc or desc

onMounted(() => {
  ticketStore.fetchTickets();
});


const filteredTickets = computed(() => {
  let tickets = ticketStore.tickets;

  if (searchQuery.value) {
    tickets = tickets.filter(ticket =>
      ticket.ticket_number?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.clientname?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.assign_by?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.kategori_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.status?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (sortKey.value) {
    tickets = tickets.sort((a, b) => {
      let result = 0;
      if (a[sortKey.value] < b[sortKey.value]) {
        result = -1;
      } else if (a[sortKey.value] > b[sortKey.value]) {
        result = 1;
      }
      return sortOrder.value === 'asc' ? result : -result;
    });
  }

  return tickets;
});

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTickets.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTickets.value.length / itemsPerPage.value);
});

const addTicket = () => {
  router.push({ name: 'AddTicket' });
};

const viewTicketDetail = (ticketNumber: string) => {
  router.push({ name: 'DetailTicket', params: { ticketNumber } });
};

const sortTable = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const updateTicketStatus = (ticket: any) => {
  ticketStore.updateTicket(ticket.ticket_number, ticket.status);
};

// Perform search when search button is clicked
const performSearch = () => {
  currentPage.value = 1; // Reset to first page after search
  ticketStore.fetchTickets(); // Re-fetch tickets or apply the search filter
};

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
