<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Add Ticket</h2>
        <form @submit.prevent="handleSubmit">
          
          <!-- Issue Field as Textarea -->
          <div class="mb-4">
            <label for="issue" class="block text-sm font-medium text-gray-700">Issue</label>
            <textarea
              id="issue"
              v-model="issue"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe the issue..."
              required
              rows="4"
            ></textarea>
          </div>
          
          <!-- Subject Field -->
          <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              v-model="subject"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the subject..."
              required
            />
          </div>

      <!-- Category Select Field -->
      <div class="mb-4">
            <label for="kategori" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="kategori"
              v-model="kategori_id"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select a category</option>
              <option
                v-for="kategori in kategoriStore.kategoris"
                :key="kategori.id"
                :value="kategori.id"
              >
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>
          <!-- Attachment Field -->
          <div class="mb-4">
            <label for="attachment" class="block text-sm font-medium text-gray-700">Attachment</label>
            <input
              type="file"
              id="attachment"
              @change="handleFileUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div class="flex justify-end">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { useKategoriStore } from '../stores/kategoriStore';
import Navbar from '../components/Navbar.vue';



onMounted(()=>{
  kategoriStore.fetchKategoris()
})
const ticketStore = useTicketStore();
const kategoriStore = useKategoriStore();
const issue = ref('');
const subject = ref('');
const kategori_id = ref<number>();
const attachment = ref<File | null>(null);

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    attachment.value = file;
  }
};

const handleSubmit = async () => {
  if (issue.value.trim() && subject.value.trim() && kategori_id.value !== null) {
    await ticketStore.addTicket(issue.value, subject.value, kategori_id.value, attachment.value);
    issue.value = '';
    subject.value = '';
    attachment.value = null;
  }
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
