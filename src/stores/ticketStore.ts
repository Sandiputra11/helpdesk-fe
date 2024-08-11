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
    //   console.error('Failed to fetch tickets:', error);
    handleError(error);
    }
  };

  const fetchTicket = async (ticketNumber: string) => {
    try {
      const response = await axios.get(`/api/auth/tickets/${ticketNumber}`);
      state.ticket = response.data;
      return response.data;
    } catch (error) {
    //   console.error('Failed to fetch ticket:', error);
    handleError(error);
}
  };

  const addTicket = async (issue: string) => {
    try {
      const response = await axios.post('/api/auth/tickets', { issue });
      state.tickets.push(response.data);
      router.push({name : 'Home'})
    } catch (error) {
    //   console.error('Failed to add ticket:', error);
    handleError(error);

    }
  };

  const updateTicket = async (ticketNumber: string, issue: string, status: string) => {
    try {
      await axios.put(`/api/auth/tickets/${ticketNumber}`, { issue, status });
      await fetchTickets();
    } catch (error) {
    //   console.error('Failed to update ticket:', error);
    handleError(error);

    }
  };

  const deleteTicket = async (ticketNumber: string) => {
    try {
      await axios.delete(`/api/auth/tickets/${ticketNumber}`);
      state.tickets = state.tickets.filter(ticket => ticket.ticket_number !== ticketNumber);
    } catch (error) {
    //   console.error('Failed to delete ticket:', error);
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
