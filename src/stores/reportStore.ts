// stores/reportStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '../utility/axiosHelper';

export const useReportStore = defineStore('report', () => {
  const reports = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchReports = async (option: string, startDate?: string, endDate?: string, categoryId?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get('/api/auth/report', {
        params: {
          option,
          start_date: startDate,
          end_date: endDate,
          category_id: categoryId,
        },
      });
      reports.value = response.data.data;
    } catch (e) {
      error.value = e.response?.data?.message || 'An error occurred while fetching reports.';
    } finally {
      loading.value = false;
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
  };
});
