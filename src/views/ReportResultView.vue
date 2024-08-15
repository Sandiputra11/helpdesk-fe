<template>
    <div class="min-h-screen bg-gray-100">
      <div class="container mx-auto mt-8">
        <div class="p-6 bg-gray-100 min-h-screen">
          <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg border border-gray-300 relative">
            <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
              Hasil Laporan
            </h1>
  
            <button @click="exportToExcel" class="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Export to Excel
            </button>
  
            <div v-if="reportStore.reports.length > 0" class="mt-6">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Ticket Number</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Date</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Client Name</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Kategori</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Subject</th>
                    <th class="py-3 px-6 text-left border-b border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="report in reportStore.reports" :key="report.ticket_number" class="hover:bg-gray-100">
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.ticket_number }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ new Date(report.created_at).toLocaleDateString() }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.clientname }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.kategori_name }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.subject }}</td>
                    <td class="py-3 px-6 border-b border-gray-200">{{ report.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <div v-else class="mt-6 text-center text-gray-500">
              Tidak ada data yang ditemukan sesuai kriteria.
            </div>
  
            <div class="flex justify-end">
              <button @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useReportStore } from '../stores/reportStore';
  import ExcelJS from 'exceljs';
import { useKategoriStore } from '../stores/kategoriStore';
  
  const route = useRoute();
  const router = useRouter();
  const reportStore = useReportStore();
  const kategoriStore= useKategoriStore();
  const selectedCategory= ref<string>('');
  
  const { option, startDate, endDate, category } = route.query;
  onMounted(async () => {
    await reportStore.fetchReports(option, startDate, endDate, category);
    const fetchKategori=await kategoriStore.fetchKategori(category);
    if (fetchKategori) {
      selectedCategory.value= fetchKategori.nama_kategori
    }
  });
  
  const goBack = () => {
    router.push({ name: 'Report' });
  };
  
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reports');
  
    worksheet.columns = [
      { header: 'Ticket Number', key: 'ticket_number', width: 15 },
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Client Name', key: 'clientname', width: 20 },
      { header: 'Kategori', key: 'kategori_name', width: 15 },
      { header: 'Subject', key: 'subject', width: 30 },
      { header: 'Status', key: 'status', width: 10 }
    ];
  
    worksheet.getRow(1).font = { bold: true };
    // worksheet.getRow(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FF00B0F0' } // Biru Muda
    // };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  
    reportStore.reports.forEach((report, index) => {
      const rowIndex = index + 2; // Mulai dari baris kedua
      worksheet.addRow({
        ticket_number: report.ticket_number,
        date: new Date(report.created_at).toLocaleDateString(),
        clientname: report.clientname,
        kategori_name: report.kategori_name,
        subject: report.subject,
        status: report.status,
      });
  
       worksheet.getRow(rowIndex); });
    let fileName = 'Laporan_Tiket_';

if (option === 'all') {
  fileName += 'All.xlsx';
} else if (option === 'date') {
  fileName += `${startDate}_to_${endDate}.xlsx`;
} else if (option === 'category') {
  fileName += `${selectedCategory.value}.xlsx`;
}
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  </script>
  
  <style scoped>
  /* Tambahkan scoped styles jika diperlukan */
  </style>
  