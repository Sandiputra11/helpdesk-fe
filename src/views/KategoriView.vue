<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="min-h-screen p-6 bg-gray-100">
        <div class="px-4 py-6 max-w-8xl sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Kategori</h1>

            <div class="flex">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari..."
                class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-l-lg"
              />
              <select
                v-model="filterStatus"
                class="relative inline-block px-4 py-2 border-2 border-gray-300 rounded-none"
              >
                <option value="">Semua</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
              <button
                @click="performSearch"
                class="relative inline-block px-6 py-2 font-medium text-white transition duration-300 bg-green-600 border-2 border-green-600 rounded-r-lg hover:bg-green-700"
              >
                Cari
              </button>
            </div>

            <button
              @click="addKategori"
              class="relative inline-block px-6 py-3 font-medium text-green-600 transition duration-300 bg-white border-2 border-green-600 rounded-lg group hover:bg-green-600 hover:text-white"
            >
              <span class="relative">Tambah</span>
            </button>
          </div>
        </div>

        <!-- Tabel Data -->
        <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table class="min-w-full bg-white border">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-3 text-left cursor-pointer" @click="sortTable('id')">
                  <div class="flex items-center">
                    ID
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 ml-2"
                      :class="sortKey === 'id' && sortOrder === 'asc' ? 'transform rotate-180' : ''"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-3 text-left">Nama Kategori</th>
                <th class="px-6 py-3 text-left">Status</th>
                <th class="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="kategori in paginatedKategoris"
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
                    <span class="relative">Hapus</span>
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
            Sebelumnya
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 bg-gray-200 border rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Selanjutnya
          </button>
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
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10); 
const sortKey = ref<'id' | 'nama_kategori' | 'status'>('id');
const sortOrder = ref('asc');

onMounted(() => {
  kategoriStore.fetchKategoris();
});

const filteredKategoris = computed(() => {
  let kategoris = kategoriStore.kategoris;

  if (searchQuery.value) {
    kategoris = kategoris.filter(kategori =>
      kategori.nama_kategori?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterStatus.value) {
    kategoris = kategoris.filter(kategori =>
      kategori.status === filterStatus.value
    );
  }

  if (sortKey.value) {
    kategoris = kategoris.sort((a, b) => {
      let result = 0;
      if (a[sortKey.value] < b[sortKey.value]) {
        result = -1;
      } else if (a[sortKey.value] > b[sortKey.value]) {
        result = 1;
      }
      return sortOrder.value === 'asc' ? result : -result;
    });
  }

  return kategoris;
});

const paginatedKategoris = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredKategoris.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredKategoris.value.length / itemsPerPage.value);
});

const addKategori = () => {
  router.push({ name: 'addkategori' });
};

const editKategori = (id: number) => {
  router.push({ name: 'editkategori', params: { id } });
};

const deleteKategori = async (id: number) => {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus kategori ini?');
  if (confirmDelete) {
    await kategoriStore.deleteKategori(id);
  }
};

const sortTable = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const performSearch = () => {
  currentPage.value = 1;
  kategoriStore.fetchKategoris();
};

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
/* Tambahkan style scoped jika diperlukan */
</style>