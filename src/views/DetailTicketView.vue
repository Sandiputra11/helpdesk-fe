<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto mt-8">
      
      <!-- Ticket Information -->
      <div class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
        <div class="flex justify-between items-center">
          <div class="flex space-x-4">
            <h3 class="text-lg font-bold">Ticket Number: {{ ticket.ticket_number }}</h3>
            <h3 class="text-lg font-bold">Client Name: {{ ticket.client_name }}</h3>
          </div>
          <div>
            <p class="text-gray-500">{{ new Date(ticket.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
        <div class="text-xl"><h2><strong>Subject:</strong> {{ ticket.subject }}</h2></div>
        <button @click="toggleReadMore" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Show Issue
        </button>

        <div v-if="isReadMore" class="mt-4">
          <div>
            <h1 class="text-xl font-bold">Issue:</h1>
            <textarea
              class="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              v-model="ticket.issue"
              readonly
            ></textarea>
          </div>
          <div class="mt-4">
    <p><strong>Attachment:</strong></p>
    <div v-if="isImage(ticket.attachment_name)">
      <img :src="ticket.attachment_url" alt="Attachment Image" class="mt-2 max-w-full rounded-md" />
      <button
        @click="ticketStore.downloadAttachment(ticketNumber);"
        class="mt-2 inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Download {{ ticket.attachment_name }}
      </button>
    </div>
    <div v-else>
      <a
        :href="ticket.attachment_url"
        download
        class="mt-2 inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Download {{ ticket.attachment_name }}
      </a>
    </div>
  </div>
        </div>
      </div>

      <!-- Client Comments -->
      <div
  v-for="(comment, index) in commentStore.comments"
  :key="comment.id"
  class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md"
>
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-bold mb-2">{{ comment.user_name }}</h3>
    <p class="text-gray-500 text-sm">{{ new Date(comment.created_at).toLocaleString() }}</p>
  </div>
  <hr class="my-4">
  <h4 class="text-md font-semibold mb-2">{{ comment.comment }}</h4>
  <!-- <a v-if="comment.attachment_url" :href="comment.attachment_url" class="text-blue-500 underline">
    {{ comment.attachment_name }}
  </a> -->
  <div v-if="comment.attachment_url">
    <div v-if="isCommentImage(comment.attachment_name)">
      <img :src="comment.attachment_url" alt="Attachment Image" class="mt-2 max-w-full rounded-md" />
      <button
        @click="commentStore.downloadCommentAttachment(comment.id)"
        class="mt-2 inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Download {{ comment.attachment_name }}
      </button>
    </div>
    <div v-else>
      <button
        @click="commentStore.downloadCommentAttachment(comment.id)"
        class="mt-2 inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Download {{ comment.attachment_name }}
      </button>
    </div>
  </div>

</div>

      <!-- Add Comment and Attachment Section -->
      <div class="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
        <h4 class="text-md font-semibold mb-2">Add Comment</h4>
        <textarea
          v-model="newComment"
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>

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
import { useCommentStore } from '../stores/commentStore'; // Import the comment store
import Navbar from '../components/Navbar.vue';
import { useRoute } from 'vue-router';

const ticketStore = useTicketStore();
const commentStore = useCommentStore(); // Use the comment store

const route = useRoute();

const ticketNumber = <string>route.params.ticketNumber;
const ticket = ref<any>({});
const isReadMore = ref(false);

const newComment = ref<string>('');
const attachment = ref<File | null>(null);

onMounted(async () => {
  try {
    const response = await ticketStore.fetchTicket(ticketNumber);
    if (response && response.data) {
      ticket.value = {
        id_ticket: response.data.id_ticket,
        ticket_number: response.data.ticket_number,
        client_name: response.data.clientname,
        created_at: response.data.created_at,
        subject: response.data.subject,
        issue: response.data.issue,
        attachment_url: response.data.attachment_url,
        attachment_name: response.data.attachment,
      };
      await commentStore.fetchComments(response.data.id_ticket);
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
 attachment.value = input.files[0];
  }
};

const addComment = async () => {
    try {
      await commentStore.createComment(ticket.value.id_ticket, newComment.value, attachment.value);
      newComment.value = '';
      attachment.value=null
    } catch (error) {
      console.error('Error adding comment:', error);
  }
};


const isImage = (fileName:string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = fileName.split('.').pop()?.toLowerCase();
  return imageExtensions.includes(extension || '');
}
const isCommentImage = (attachmentName: string | undefined) => {
  if (!attachmentName) return false;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = attachmentName.split('.').pop()?.toLowerCase();
  return imageExtensions.includes(extension || '');
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
