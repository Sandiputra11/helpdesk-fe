<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
      <div class="container mx-auto mt-8">
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h1 class="mb-4 text-3xl font-bold text-gray-900">Add Category</h1>
  
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="nama_kategori" class="block text-gray-700">Category Name</label>
              <input
                type="text"
                id="nama_kategori"
                v-model="nama_kategori"
                required
                class="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              />
            </div>
  
            <div class="mb-4">
              <label for="status" class="block text-gray-700">Status</label>
              <select
                id="status"
                v-model="status"
                required
                class="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="nonactive">Non-Active</option>
              </select>
            </div>
  
            <div class="flex justify-end">
              <button
                type="submit"
                class="inline-block px-6 py-3 font-medium text-white transition duration-300 bg-green-600 border-2 border-green-600 rounded-lg hover:bg-green-700"
              >
                Add Category
              </button>
              <router-link
  :to="{ name: 'Kategori' }"
  class="inline-block px-6 py-3 ml-4 font-medium text-gray-600 transition duration-300 border-2 border-gray-300 rounded-lg hover:bg-gray-100"
>
  Cancel
</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import { ref } from 'vue';
  import { useKategoriStore } from '../stores/kategoriStore';
  import { useRouter } from 'vue-router';
  
  const kategoriStore = useKategoriStore();
  const router = useRouter();
  
  const nama_kategori = ref<string>();
  const status= ref<string>();
  
 
  const submitForm = async () => {
    await kategoriStore.createKategori(nama_kategori.value , status.value);
    router.push({ name: 'Kategori' }); 
  };
  </script>
  
 
  