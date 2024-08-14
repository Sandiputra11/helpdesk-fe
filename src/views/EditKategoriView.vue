<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="p-6 bg-white rounded-lg shadow-lg">
        <h1 class="mb-4 text-3xl font-bold text-gray-900">Edit Category</h1>

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
              class="inline-block px-6 py-3 font-medium text-white transition duration-300 bg-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-700"
            >
              Update Category
            </button>
            <router-link
              to="/kategori"
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
import { ref, onMounted } from 'vue';
import { useKategoriStore } from '../stores/kategoriStore';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();


const kategoriStore = useKategoriStore();
const router = useRouter();

// Define a reactive object to hold category data
const nama_kategori = ref('')
const status = ref('');

const categoryId = route.params.id; // Assuming 'id' is passed as a route parameter
onMounted(async () => {
  const existingKategori = await kategoriStore.fetchKategori(categoryId);
  console.log('Fetched Category:', existingKategori); // Tambahkan log ini
  
  if (existingKategori) {
    nama_kategori.value = existingKategori.nama_kategori;
    status.value = existingKategori.status;
  }
});

// Function to submit the form
const submitForm = async () => {
  await kategoriStore.updateKategori(categoryId,nama_kategori.value,status.value);
  router.push({ name: 'Kategori' }); // Navigate back to Kategori view
};


</script>

<style scoped>
/* Add scoped styles if needed */
</style>