import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiService } from '../utility/apiServices';

interface User {
  id: number;
  name: string;
  role_id:number;
  role: string;
  email: string;
}
interface Role {
  id:number;
  name:string;
}

// Define the Pinia store
export const useUserStore = defineStore('user', () => {
  // State variables
  const users = ref<User[]>([]); // Array of users
  const user = ref<User | null>(null); // Single user object or null
  const roles = ref<Role[]>([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await apiService.apiGet('/api/auth/users'); // Use apiService.apiGet
      users.value = response.data;
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  // Fetch a specific user by ID
  const fetchUserById = async (id: number) => {
    try {
      const response = await apiService.apiGet(`/api/auth/users/${id}`); // Use apiService.apiGet
      user.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  // Register (add a new user)
  const registerUser = async (newUser: { name: string; email: string; role_id: number; password: string }) => {
    try {
      const response = await apiService.apiPost('/api/auth/register', newUser); // Use apiService.apiPost
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
      const response = await apiService.apiPut(`/api/auth/users/${id}`, updatedUser); // Use apiService.apiPut
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
      const response = await apiService.apiDelete(`/api/auth/users/${id}`, {}); // Use apiService.apiDelete
      if (response.data.message === 'USER DELETED!') {
        await fetchUsers(); // Refresh the user list after deletion
      }
      return response.data.message;
    } catch (error) {
      console.error('Failed to delete user', error);
      return 'Failed to delete user';
    }
  };

  const fetchRole = async () => {
    try {
      const response = await apiService.apiGet("/api/auth/users/roles");
      roles.value = response.data;
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    
  }

  return {
    users,
    roles,
    user,
    fetchUsers,
    fetchUserById,
    fetchRole,
    registerUser,
    updateUser,
    deleteUser,
  };
});
