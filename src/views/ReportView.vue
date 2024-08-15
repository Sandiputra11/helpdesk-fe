<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="p-6 bg-gray-100 min-h-screen">
        <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg border border-gray-300">
          <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
            Pilih Kriteria Laporan
          </h1>

          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="py-3 px-6 text-left border-b border-gray-200">Pilih Kriteria</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-gray-100">
                <td class="py-3 px-6 border-b border-gray-200">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="selectedOption" value="all" class="form-radio text-indigo-600" />
                    <span class="ml-2">Semua Data</span>
                  </label>
                </td>
              </tr>
              <tr class="bg-white">
                <td class="py-3 px-6 border-b border-gray-200">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="selectedOption" value="date" class="form-radio text-indigo-600" />
                    <span class="ml-2">Tanggal</span>
                  </label>

                  <div class="mt-4">
                    <div class="flex space-x-4">
                      <div class="w-1/2">
                        <label class="block text-gray-700">Dari Tanggal:</label>
                        <input
                          type="date"
                          v-model="startDate"
                          :disabled="selectedOption !== 'date'"
                          class="mt-1 mb-2 block w-full border-2 border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div class="w-1/2">
                        <label class="block text-gray-700">Sampai Tanggal:</label>
                        <input
                          type="date"
                          v-model="endDate"
                          :disabled="selectedOption !== 'date'"
                          class="mt-1 block w-full border-2 border-gray-300 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="bg-gray-100">
                <td class="py-3 px-6">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="selectedOption" value="category" class="form-radio text-indigo-600" />
                    <span class="ml-2">Pencarian Kode Kategori</span>
                  </label>

                  <div class="mt-4">
                    <label class="block text-gray-700">Pilih Kategori:</label>
                    <select
                      v-model="selectedCategory"
                      :disabled="selectedOption !== 'category'"
                      class="mt-1 block w-full border-2 border-gray-300 rounded-lg p-2"
                    >
                      <option value="" disabled>-- Pilih kategori --</option>
                      <option
                        v-for="kategori in kategoriStore.kategoris"
                        :key="kategori.id"
                        :value="kategori.id"
                      >
                        {{ kategori.nama_kategori }}
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-6 flex justify-end">
            <button
              @click="goToReportResult"
              class="px-6 py-3 font-medium text-white bg-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Tampilkan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import { useKategoriStore } from '../stores/kategoriStore';

const router = useRouter();
const kategoriStore = useKategoriStore();
const selectedOption = ref('all');
const startDate = ref('');
const endDate = ref('');
const selectedCategory = ref('');

onMounted(async()=>{
await kategoriStore.fetchActiveKategoris();
});

const goToReportResult = () => {
  router.push({
    name: 'ReportResult',
    query: {
      option: selectedOption.value,
      startDate: startDate.value,
      endDate: endDate.value,
      category: selectedCategory.value,
    },
  });
};
</script>

<style scoped>
/* Tambahkan scoped styles jika diperlukan */
</style>
