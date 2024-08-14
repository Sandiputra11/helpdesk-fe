<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <div class="container mx-auto mt-8">
        <div class="p-6 bg-gray-100 min-h-screen">
          <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-900">Manajemen Kategori</h1>
  
              <button
                @click="openAddModal"
                class="relative inline-block px-6 py-3 font-medium text-green-600 border-2 border-green-600 group rounded-lg bg-white hover:bg-green-600 hover:text-white transition duration-300"
              >
                <span class="relative">Tambah Kategori</span>
              </button>
            </div>
  
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari..."
              class="mt-4 mb-4 px-4 py-2 border-2 border-gray-300 rounded-lg"
            />
          </div>
  
          <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table class="min-w-full bg-white border">
              <thead class="bg-gray-200">
                <tr>
                  <th class="py-3 px-6 text-left">ID Kategori</th>
                  <th class="py-3 px-6 text-left">Nama Kategori</th>
                  <th class="py-3 px-6 text-left">Status</th>
                  <th class="py-3 px-6 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="category in filteredCategories"
                  :key="category.id_category"
                  class="border-t hover:bg-gray-100 transition-colors duration-300"
                >
                  <td class="py-4 px-6">{{ category.id_category }}</td>
                  <td class="py-4 px-6">{{ category.name }}</td>
                  <td class="py-4 px-6">
                    <select v-model="category.status" class="px-2 py-1 border rounded bg-white text-gray-700">
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </td>
                  <td class="py-4 px-6">
                    <button
                      @click="editCategory(category.id_category)"
                      class="relative inline-block px-6 py-3 font-medium text-yellow-600 border-2 border-yellow-600 group rounded-lg bg-white hover:bg-yellow-600 hover:text-white transition duration-300"
                    >
                      <span class="relative">Edit</span>
                    </button>
                    <button
                      @click="deleteCategory(category.id_category)"
                      class="ml-2 relative inline-block px-6 py-3 font-medium text-red-600 border-2 border-red-600 group rounded-lg bg-white hover:bg-red-600 hover:text-white transition duration-300"
                    >
                      <span class="relative">Hapus</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Modal untuk Tambah Kategori -->
      <div v-if="showAddModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-xl font-bold mb-4">Tambah Kategori</h2>
          <input
            type="text"
            v-model="newCategoryName"
            placeholder="Nama Kategori"
            class="w-full px-4 py-2 mb-4 border-2 border-gray-300 rounded-lg"
          />
          <div class="flex justify-end">
            <button @click="addCategory" class="px-6 py-3 font-medium text-green-600 border-2 border-green-600 rounded-lg bg-white hover:bg-green-600 hover:text-white transition duration-300">
              Tambah
            </button>
            <button @click="closeAddModal" class="ml-4 px-6 py-3 font-medium text-gray-600 border-2 border-gray-600 rounded-lg bg-white hover:bg-gray-600 hover:text-white transition duration-300">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import Navbar from '../components/Navbar.vue';
  
  const searchQuery = ref('');
  const showAddModal = ref(false);
  const newCategoryName = ref('');
  
  const categories = ref([
    { id_category: '01', name: 'IT Support', status: 'active' },
    { id_category: '02', name: 'Multimedia Design', status: 'inactive' },
    { id_category: '03', name: 'Software Development', status: 'active' }
  ]);
  
  const filteredCategories = computed(() => {
    return categories.value.filter(category => 
      category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const openAddModal = () => {
    showAddModal.value = true;
  };
  
  const closeAddModal = () => {
    showAddModal.value = false;
  };
  
  const addCategory = () => {
    if (newCategoryName.value.trim() !== '') {
      categories.value.push({
        id_category: String(categories.value.length + 1).padStart(2, '0'),
        name: newCategoryName.value,
        status: 'active'
      });
      newCategoryName.value = '';
      closeAddModal();
    }
  };
  
  const deleteCategory = (id_category: string) => {
    const index = categories.value.findIndex(category => category.id_category === id_category);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  };
  
  const editCategory = (id_category: string) => {
    alert(`Fitur edit untuk ID Kategori: ${id_category} belum diimplementasikan.`);
  };
  </script>
  
  