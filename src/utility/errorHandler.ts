// src/utility/errorHandler.ts
import Swal from 'sweetalert2';

const handleError = (error: any) => {
  console.error(error);

  const {data, status} = error.response

  let message = 'Terjadi kesalahan. Silakan coba lagi.';
  let title = 'Error';
  let icon: 'error' | 'warning' | 'info' = 'error';

  if (error.response) {
    // Kesalahan yang datang dari respons server
    if (status >= 500) {
      message = 'Terjadi kesalahan di server. Silakan coba lagi nanti.';
    } else if (status === 404) {
      message = 'Sumber daya yang Anda minta tidak ditemukan.';
    } else if (status === 403) {
      message = 'Anda tidak memiliki izin untuk melakukan aksi ini.';
    } else if (status === 401) {
      message = 'Anda harus login untuk melakukan aksi ini.';
    } else if (data && data.message) {
      message = data.message;
    } else {
      message = `Terjadi kesalahan: ${statusText}`;
    }
  } else if (error.request) {
    // Kesalahan yang datang dari jaringan atau saat tidak ada respons dari server
    message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    icon = 'warning';
  } else if (error.message) {
    // Kesalahan yang datang dari hal lain (misalnya kesalahan pada kode)
    message = error.message;
  }

  // Tampilkan pesan error menggunakan SweetAlert2
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
  });
};

export default handleError
