<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <div class="container mx-auto mt-8">
        <div class="min-h-screen p-6 bg-gray-100">
          <div class="px-4 py-6 max-w-8xl sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
  
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search..."
                class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
  
              <button
                @click="addKategori"
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
                  <th class="px-6 py-3 text-left">ID</th>
                  <th class="px-6 py-3 text-left">Category Name</th>
                  <th class="px-6 py-3 text-left">Status</th>
                  <th class="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="kategori in filteredKategoris"
                  :key="kategori.id"
                  class="transition-colors duration-300 border-t hover:bg-gray-100"
                >
                  <td class="px-6 py-4">{{ kategori.id }}</td>
                  <td class="px-6 py-4">{{ kategori.nama_kategori }}</td>
                  <td class="px-6 py-4">{{ kategori.status }}</td>
                  <td class="px-6 py-4">
                    <button
                      @click="editKategori(kategori.id)"
                      class="relative inline-block px-6 py-3 font-medium text-yellow-600 transition duration-300 bg-white border-2 border-yellow-600 rounded-lg group hover:bg-yellow-600 hover:text-white"
                    >
                      <span class="relative">Edit</span>
                    </button>
                    <button
                      @click="deleteKategori(kategori.id)"
                      class="relative inline-block px-6 py-3 font-medium text-red-600 transition duration-300 bg-white border-2 border-red-600 rounded-lg group hover:bg-red-600 hover:text-white"
                    >
                      <span class="relative">Delete</span>
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
  import { ref, computed, onMounted } from 'vue';
  import { useKategoriStore } from '../stores/kategoriStore';
  import { useRouter } from 'vue-router';
  
  const kategoriStore = useKategoriStore();
  const router = useRouter();
  const searchQuery = ref('');
  
  onMounted(() => {
    kategoriStore.fetchKategoris();
  });
  
  const filteredKategoris = computed(() => {
  return kategoriStore.kategoris.filter(kategori =>
    kategori.nama_kategori?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

  
  const addKategori = () => {
    router.push({ name: 'addkategori' });
  };
  
  const editKategori = (id: number) => {
    router.push({ name: 'editkategori', params: { id } });
  };
  
  const deleteKategori = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      await kategoriStore.deleteKategori(id);
    }
  };
  </script>
  
  <style scoped>
  /* Add scoped styles if needed */
  </style>
  