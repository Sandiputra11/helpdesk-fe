import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from '../utility/axiosHelper';

// Define the interface for a user
interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

// Define the Pinia store
export const useUserStore = defineStore('user', () => {
  // State variables
  const users = ref<User[]>([]); // Array of users
  const user = ref<User | null>(null); // Single user object or null

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users');
      users.value = response.data;
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  // Fetch a specific user by ID
  const fetchUserById = async (id: number) => {
    try {
      const response = await axios.get(`/api/auth/users/${id}`);
      user.value = response.data;
      return response.data
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  // Register (add a new user)
  const registerUser = async (newUser: { name: string; email: string; role: string; password: string }) => {
    try {
      const response = await axios.post('/api/auth/register', newUser);
      if (response.data.message === 'Registrasi Sukses') {
        await fetchUsers(); // Refresh the user list after registration
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to register user', error);
      return 'Failed to register user';
    }
  };

  // Update a user by ID
  const updateUser = async (id: number, updatedUser: { name: string; email: string; role: string; password?: string }) => {
    try {
      const response = await axios.put(`/api/auth/users/${id}`, updatedUser);
      if (response.data.message === 'User updated successfully') {
        await fetchUsers(); // Refresh the user list after update
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to update user', error);
      return 'Failed to update user';
    }
  };

  // Delete a user by ID
  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`/api/auth/users/${id}`);
      if (response.data.message === 'USER DELETED!') {
        await fetchUsers(); // Refresh the user list after deletion
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to delete user', error);
      return 'Failed to delete user';
    }
  };

  return {
    users,
    user,
    fetchUsers,
    fetchUserById,
    registerUser,
    updateUser,
    deleteUser,
  };
});
