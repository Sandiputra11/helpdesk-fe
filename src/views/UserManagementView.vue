<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="min-h-screen p-6 bg-gray-100">
        <div class="px-4 py-6 max-w-8xl sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <!-- Title on the left -->
            <h1 class="text-3xl font-bold text-gray-900">
              User Management
            </h1>

            <!-- Search input with button -->
            <div class="flex">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by Name, Email, or Role..."
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
              @click="addUser"
              class="relative inline-block px-6 py-3 font-medium text-green-600 transition duration-300 bg-white border-2 border-green-600 rounded-lg group hover:bg-green-600 hover:text-white"
            >
              <span class="relative">Add User</span>
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table class="min-w-full bg-white border">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-3 text-left">User ID</th>
                <th class="px-6 py-3 text-left">Name</th>
                <th class="px-6 py-3 text-left">Email</th>
                <th class="px-6 py-3 text-left">Role</th>
                <th class="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in paginatedUsers"
                :key="user.id"
                class="transition-colors duration-300 border-t hover:bg-gray-100"
              >
                <td class="px-6 py-4">{{ user.id }}</td>
                <td class="px-6 py-4">{{ user.name }}</td>
                <td class="px-6 py-4">{{ user.email }}</td>
                <td class="px-6 py-4">{{ user.role }}</td>
                <td class="px-6 py-4">
                  <button
                    @click="editUser(user.id)"
                    class="relative inline-block px-6 py-3 font-medium text-yellow-600 transition duration-300 bg-white border-2 border-yellow-600 rounded-lg group hover:bg-yellow-600 hover:text-white"
                  >
                    <span class="relative">Edit</span>
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="relative inline-block px-6 py-3 font-medium text-red-600 transition duration-300 bg-white border-2 border-red-600 rounded-lg group hover:bg-red-600 hover:text-white"
                  >
                    <span class="relative">Delete</span>
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
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const userStore = useUserStore();
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust the items per page as needed

// Sample user data (replace with actual data from your store or API)
onMounted(()=>{
userStore.fetchUsers();
});

const filteredUsers = computed(() => {
  let userList = userStore.users;

  if (searchQuery.value) {
    userList = userList.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return userList;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const router = useRouter();

const addUser = () => {
  router.push({ name: 'AddUser' });
};

const editUser = (id: number) => {
  router.push({ name: 'EditUser', params: { id } });
};

const deleteUser = async(id: number) => {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus User ini?');
if (confirmDelete) {
  try {
    await userStore.deleteUser(id);
  } catch (error) {
    console.error('Gagal Hapus',500);
  }
}
  
};

const performSearch = () => {
  currentPage.value = 1; // Reset to first page after search
  // Logic to perform the search can be added here if necessary
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