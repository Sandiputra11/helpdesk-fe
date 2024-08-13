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
      state.tickets = response.data;
    } catch (error) {
      handleError(error);
    }
  };

  const fetchTicket = async (ticketNumber: string) => {
    try {
      const response = await axios.get(`/api/auth/tickets/${ticketNumber}`);
      state.ticket = response.data;
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

  return {
    ...toRefs(state),
    fetchTickets,
    fetchTicket,
    addTicket,
    updateTicket,
    deleteTicket,
  };
});
