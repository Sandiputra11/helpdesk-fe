<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto mt-8">
      <div class="p-6 bg-gray-100 min-h-screen">
        <div class="max-w-8xl py-6 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg border border-gray-300 relative">
          <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
            Hasil Laporan
          </h1>

          <div class="absolute top-6 right-6 flex space-x-2">
            <button @click="exportToExcel" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Export to Excel
            </button>
            <button @click="exportToPDF" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Export to PDF
            </button>
          </div>

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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  reportStore.reports.forEach((report, index) => {
    const rowIndex = index + 2;
    worksheet.addRow({
      ticket_number: report.ticket_number,
      date: new Date(report.created_at).toLocaleDateString(),
      clientname: report.clientname,
      kategori_name: report.kategori_name,
      subject: report.subject,
      status: report.status,
    });
  });

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

const exportToPDF = () => {
  const doc = new jsPDF();
let title = 'Laporan_Tiket_';
  if (option === 'all') {
    title += 'All';
  } else if (option === 'date') {
    title += `${startDate}_to_${endDate}`;
  } else if (option === 'category') {
    title += `${selectedCategory.value}`;
  }

  // Add title
  
  doc.setFontSize(18);
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const textX = (pageWidth - textWidth) / 2; // Center the title
  doc.text(title, textX, 20); // Position the title at (textX, 20)

  // Add some spacing before the table
  doc.autoTable({
    margin: { top: 30 }, // Space after the title
    head: [
      ['Ticket Number', 'Date', 'Client Name', 'Kategori', 'Subject', 'Status']
    ],
    body: reportStore.reports.map(report => [
      report.ticket_number,
      new Date(report.created_at).toLocaleDateString(),
      report.clientname,
      report.kategori_name,
      report.subject,
      report.status,
    ]),
  });

  // Save the PDF
  let fileName = 'Laporan_Tiket_';

  if (option === 'all') {
    fileName += 'All.pdf';
  } else if (option === 'date') {
    fileName += `${startDate}_to_${endDate}.pdf`;
  } else if (option === 'category') {
    fileName += `${selectedCategory.value}.pdf`;
  }
  
  doc.save(fileName);
};

</script>

  
  <style scoped>
  /* Tambahkan scoped styles jika diperlukan */
  </style>
  