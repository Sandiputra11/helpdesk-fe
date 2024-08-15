<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      
      <!-- New Card at the Top -->
      <div class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
        <div class="flex justify-between items-center">
          <!-- Left Side: Ticket ID and Client Name -->
          <div class="flex space-x-4">
            <h3 class="text-lg font-bold">Ticket Number: {{ ticket.ticket_number }}</h3>
            <h3 class="text-lg font-bold">Client Name: {{ ticket.client_name }}</h3>
          </div>
          <!-- Right Side: Date -->
          <div>
            <p class="text-gray-500">{{ new Date(ticket.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
        <button @click="toggleReadMore" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Read More
        </button>

        <!-- Conditionally Render Additional Information -->
        <div v-if="isReadMore" class="mt-4">
          <p><strong>Subject:</strong> {{ ticket.subject }}</p>
          <p><strong>Issue:</strong> {{ ticket.issue }}</p>
          <p><strong>Attachment:</strong> 
            <a :href="ticket.attachment_url" class="text-blue-500 underline">
              {{ ticket.attachment_name }}
            </a>
          </p>
        </div>
      </div>

      <!-- Loop through client comments -->
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <h3 class="text-lg font-bold mb-2">{{ comment.name }}</h3>
        <hr class="my-4">
        <h4 class="text-md font-semibold mb-2">{{ comment.text }}</h4>
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Read More
        </button>
      </div>

      <!-- Loop through admin replies -->
      <div
        v-for="(reply, index) in replies"
        :key="index"
        class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <h3 class="text-lg font-bold mb-2">Admin Reply</h3>
        <p class="text-gray-700">{{ reply.text }}</p>
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Attachment
        </button>
      </div>

      <!-- Add Comment and Attachment Section -->
      <div class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
        <h4 class="text-md font-semibold mb-2">Add Comment</h4>
        <textarea
          v-model="newComment.text"
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>s

        <h4 class="text-md font-semibold mt-4 mb-2">Add Attachment</h4>
        <input
          type="file"
          @change="handleFileChange"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <button @click="addComment" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Comment
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import Navbar from '../components/Navbar.vue';
import { useRoute, useRouter } from 'vue-router';

const ticketStore = useTicketStore();
const comments = ref<{ name: string; text: string; attachmentFile?: File | null }[]>([]);
const replies = ref<{ text: string }[]>([]);
const newComment = ref<{ text: string; attachmentFile?: File | null }>({ text: '', attachmentFile: null });
const route = useRoute();
const router = useRouter();

const ticketNumber = route.params.ticketNumber;
const ticket = ref<any>({});
const isReadMore = ref(false);

onMounted(async () => {
  try {
    const response = await ticketStore.fetchTicket(ticketNumber);

    if (response && response.data) {
      // Populate initial ticket data
      ticket.value = {
        id_ticket: response.data.id,
        ticket_number: response.data.ticket_number,
        client_name: response.data.clientname,
        created_at: response.data.created_at,
        subject: response.data.subject,
        issue: response.data.issue,
        attachment_url: response.data.attachment_url,
        attachment_name: response.data.attachment_name, // Ensure this data is available from the API
      };
      comments.value = response.data.comments || [];
      replies.value = response.data.replies || [];
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
  }
});

const toggleReadMore = () => {
  isReadMore.value = !isReadMore.value;
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    newComment.value.attachmentFile = input.files[0];
  }
};

const addComment = () => {
  if (newComment.value.text.trim()) {
    const comment = {
      name: 'Client',  // You can set the client name dynamically if needed
      text: newComment.value.text.trim(),
      attachmentFile: newComment.value.attachmentFile || null
    };

    // Add the new comment to the list of comments
    comments.value.push(comment);

    // Clear the form fields
    newComment.value.text = '';
    newComment.value.attachmentFile = null;
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
