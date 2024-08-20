import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../utility/apiServices';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const useReportStore = defineStore('report', () => {
  const reports = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchReports = async ( startDate?: string, endDate?: string, categoryId?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiService.apiGet('/api/auth/report', {
        start_date: startDate,
        end_date: endDate,
        category_id: categoryId,
      });
      reports.value = response.data.data;
    } catch (e) {
      error.value = e.response?.data?.message || 'An error occurred while fetching reports.';
    } finally {
      loading.value = false;
    }
  };

  const exportToExcel = async (option: string, startDate?: string, endDate?: string, selectedCategory: string) => {
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

    reports.value.forEach((report, index) => {
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
  
    switch (option) {
      case 'all':
        fileName += 'Semua.xlsx';
        break;
      case 'date':
        fileName += `${startDate}_Sampai_${endDate}.xlsx`;
        break;
      case 'category':
        fileName += `${selectedCategory}.xlsx`;
        break;
      default:
        fileName = 'Laporan_Ticket.xlsx';
        break;
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

  const exportToPDF = (option: string, startDate?: string, endDate?: string, selectedCategory: string) => {
    const doc = new jsPDF();
    let title = 'Laporan_Tiket_';

switch (option) {
  case 'all':
    title += 'Semua';
    break;
  case 'date':
    title += `${startDate}_Sampai_${endDate}`;
    break;
  case 'category':
    title += `${selectedCategory}`;
    break;
  default:
    title = 'Laporan_Ticket';
    break;
}

    // Add title
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Center the title
    doc.text(title, textX, 20);

    // Add some spacing before the table
    doc.autoTable({
      margin: { top: 30 },
      head: [
        ['Ticket Number', 'Date', 'Client Name', 'Kategori', 'Subject', 'Status']
      ],
      body: reports.value.map(report => [
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
      fileName += `${selectedCategory}.pdf`;
    }
    doc.save(fileName);
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    exportToExcel,
    exportToPDF,
  };
});
