import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import axios from '../utility/axiosHelper';
import { handleError } from '../utility/errorHandler';
import router from '../router';

// Define interfaces for the ticket data
interface Ticket {
  id: number;
  user_id: number;
  ticket_number: string;
  issue: string;
  status: string;
  clientname: string;
  kategori_name: string;
  subject: string;
  attachment: string | null;
  created_at: string;
  updated_at: string;
}

interface TicketStoreState {
  tickets: Ticket[];
  ticket: Ticket | null;
}

export const useTicketStore = defineStore('ticket', () => {
  const state = reactive<TicketStoreState>({
    tickets: [],
    ticket: null,
  });

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/auth/tickets');
      state.tickets = response.data.data;
    } catch (error) {
      handleError(error);
    }
  };

  const fetchTicket = async (ticketNumber: string) => {
    try {
      const response = await axios.get(`/api/auth/tickets/${ticketNumber}`);
      state.ticket = response.data.data;
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  const addTicket = async (issue: string, subject: string, kategori_id: number, attachment?: File) => {
    try {
      const formData = new FormData();
      formData.append('issue', issue);
      formData.append('subject', subject);
      formData.append('kategori_id', kategori_id.toString());
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await axios.post('/api/auth/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      state.tickets.push(response.data);
      router.push({ name: 'Home' });
    } catch (error) {
      handleError(error);
    }
  };

  const updateTicket = async (ticketNumber: string, status: string) => {
    try {
      await axios.put(`/api/auth/tickets/${ticketNumber}`, { status });
      await fetchTickets();
    } catch (error) {
      handleError(error);
    }
  };

  const deleteTicket = async (ticketNumber: string) => {
    try {
      await axios.delete(`/api/auth/tickets/${ticketNumber}`);
      state.tickets = state.tickets.filter(ticket => ticket.ticket_number !== ticketNumber);
    } catch (error) {
      handleError(error);
    }
  };

  const downloadAttachment = async (ticketNumber: string) => {
    try {
      const ticket = state.tickets.find(t => t.ticket_number === ticketNumber);
      if (!ticket || !ticket.attachment) {
        console.error('Attachment not found for this ticket');
        return;
      }

      const response = await axios.get(`/api/auth/tickets/download/${ticketNumber}`, {
        responseType: 'blob', // Important for handling file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', ticket.attachment); // Adjust the filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      handleError(error);
    }
  };

  return {
    ...toRefs(state),
    fetchTickets,
    fetchTicket,
    addTicket,
    updateTicket,
    deleteTicket,
    downloadAttachment, // Return the downloadAttachment function
  };
});
