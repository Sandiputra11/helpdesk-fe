import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import axios from '../utility/axiosHelper';
import { handleError } from '../utility/errorHandler';

// Define an interface for Kategori
interface Kategori {
  id?: number;
  nama_kategori: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const useKategoriStore = defineStore('kategori', () => {
  // Use reactive for state
  const state = reactive({
    kategoris: [] as Kategori[],
    // kategori: null as Kategori | null,
  });

  const fetchKategoris = async () => {
    try {
      const response = await axios.get('/api/auth/kategoris');
      state.kategoris = response.data;
    } catch (error) {
      handleError(error);
    }
  };
  const fetchKategori = async (id :number) => {
  try {
    const response = await axios.get(`/api/auth/kategoris/${id}`);
    console.log(response.data[0]); // Log data untuk melihat strukturnya
    return response.data[0];
  } catch (error) {
    handleError(error);
  }
};

  const createKategori = async (nama_kategori: string, status: string) => {
    try {
      const response = await axios.post('/api/auth/kategoris', { nama_kategori, status });
      state.kategoris.push(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const updateKategori = async (id: number, nama_kategori: string, status: string) => {
  try {
    const response = await axios.put(`/api/auth/kategoris/${id}`, { nama_kategori, status });
    console.log('Update successful:', response.data);
    // Bisa menambahkan logika lain seperti notifikasi sukses
  } catch (error) {
    handleError(error);
  }
};


  const deleteKategori = async (id: number) => {
    try {
      await axios.delete(`/api/auth/kategoris/${id}`);
      state.kategoris = state.kategoris.filter(kategori => kategori.id !== id);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    ...toRefs(state),
    fetchKategoris,
    fetchKategori,
    createKategori,
    updateKategori,
    deleteKategori,
  };
});
