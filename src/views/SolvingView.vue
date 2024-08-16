<template>
    <div class="min-h-screen bg-gray-100">
    <Navbar />
      <div class="container mx-auto mt-8">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">FAQ</h1>
  
          <Accordion
            v-for="(faq, index) in faqs"
            :key="index"
            :question="faq.question"
            :answer="faq.answer"
          />
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Accordion from '../components/Accordion.vue';
  import Navbar from '../components/Navbar.vue';
  

  const faqs= [
      {
        question: "Apa itu Sistem Ticketing?",
        answer: "Sistem Ticketing adalah sebuah platform yang digunakan untuk mengelola, melacak, dan menyelesaikan permintaan atau masalah yang diajukan oleh pengguna atau pelanggan. Setiap permintaan dibuat dalam bentuk 'ticket' yang kemudian ditangani oleh tim terkait."
      },
      {
        question: "Bagaimana cara membuat ticket baru?",
        answer: "Untuk membuat ticket baru, pengguna perlu login ke dalam sistem, mengisi formulir yang disediakan, dan menyertakan detail masalah atau permintaan. Setelah formulir diisi, ticket akan dikirim ke tim yang bertanggung jawab untuk diproses."
      },
      {
        question: "Apa yang harus dilakukan setelah ticket dibuat?",
        answer: "Setelah ticket dibuat, sistem akan memberikan nomor ticket yang bisa digunakan untuk melacak status dari permintaan tersebut. Pengguna dapat memantau status ticket melalui dashboard atau notifikasi yang dikirim oleh sistem."
      },
      {
        question: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan ticket?",
        answer: "Waktu penyelesaian ticket bervariasi tergantung pada kompleksitas masalah dan ketersediaan tim. Sistem biasanya menyediakan estimasi waktu penyelesaian setelah ticket dibuat."
      },
      {
        question: "Bagaimana cara menambahkan lampiran ke dalam ticket?",
        answer: "Ketika membuat atau memperbarui ticket, Anda dapat menambahkan lampiran seperti gambar atau dokumen yang relevan dengan masalah yang dilaporkan. Pastikan lampiran tersebut tidak melebihi batas ukuran file yang ditentukan oleh sistem."
      },
      {
        question: "Apakah saya dapat mengedit ticket yang sudah dibuat?",
        answer: "Anda dapat mengedit detail ticket selama ticket tersebut belum ditangani atau belum dalam status 'sedang diproses'. Jika ticket sudah dalam proses, Anda mungkin perlu menghubungi tim support untuk melakukan perubahan."
      },
      {
        question: "Bagaimana cara menutup ticket?",
        answer: "Setelah masalah atau permintaan Anda ditangani dan Anda puas dengan solusinya, Anda dapat menutup ticket melalui dashboard. Jika tidak puas, Anda juga dapat meminta revisi atau pembukaan kembali ticket."
      },
      {
        question: "Apa yang harus dilakukan jika tidak ada tanggapan pada ticket?",
        answer: "Jika ticket Anda tidak mendapat tanggapan dalam waktu yang wajar, Anda bisa menghubungi tim support langsung melalui kontak yang disediakan atau mengirim pengingat melalui sistem ticketing."
      }
    ];

  </script>
  
  <style scoped>
  /* Tambahkan style tambahan jika diperlukan */
  </style>
  