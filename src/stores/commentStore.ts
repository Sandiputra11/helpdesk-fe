import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiService } from '../utility/apiServices';

interface Comment {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  attachment?: string;
  attachment_name?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  user_name: string;
}

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchComments = async (ticket_id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.apiGet(`/api/auth/comment/${ticket_id}`); // Use apiService.apiGet
      comments.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch comments';
    } finally {
      loading.value = false;
    }
  };

  const createComment = async (ticket_id: number, comment: string, attachment?: File) => {
    const formData = new FormData();
    formData.append('ticket_id', ticket_id.toString());
    formData.append('comment', comment);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await apiService.apiPost('/api/auth/comment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Use apiService.apiPost
      comments.value.push(response.data);
      fetchComments(ticket_id);
    } catch (err) {
      console.log(err);
      error.value = 'Failed to create comment';
    }
  };

  const downloadCommentAttachment = async (id: number) => {
    try {
      const comment = comments.value.find(c => c.id === id);
      if (!comment || !comment.attachment_name) {
        console.error('Attachment not found for this comment');
        return;
      }

      const response = await apiService.apiDownload(`/api/auth/comment/download/${id}`, {}, comment.attachment_name); // Use apiService.apiDownload

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', comment.attachment_name); // Adjust the filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading comment attachment:', error);
    }
  };

  return {
    downloadCommentAttachment,
    comments,
    loading,
    error,
    fetchComments,
    createComment,
  };
});
