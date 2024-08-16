// src/utility/errorHandler.ts
import Swal from 'sweetalert2';

const handleError = (error: any) => {
  console.error(error);

  let message = 'Terjadi kesalahan. Silakan coba lagi.';
  let title = 'Error';
  let icon: 'error' | 'warning' | 'info' = 'error';

  if (error.response) {
    const { status, data, statusText } = error.response;

    switch (true) {
      case status >= 500:
        message = 'Terjadi kesalahan di server. Silakan coba lagi nanti.';
        break;
      case status === 404:
        message = 'Sumber daya yang Anda minta tidak ditemukan.';
        break;
      case status === 403:
        message = 'Anda tidak memiliki izin untuk melakukan aksi ini.';
        break;
      case status === 401:
        message = 'Anda harus login untuk melakukan aksi ini.';
        break;
      default:
        message = data && data.message ? data.message : `Terjadi kesalahan: ${statusText}`;
        break;
    }
  } else if (error.request) {
    message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    icon = 'warning';
  } else if (error.message) {
    message = error.message;
  }

  // Tampilkan pesan error menggunakan SweetAlert2
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
  });
};

export default handleError;
