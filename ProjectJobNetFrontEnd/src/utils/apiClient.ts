import axios from 'axios';
import  store  from '../store.ts'; // Adjust the path based on your project structure
import { logout } from '../slices/authSlice.ts'; // Adjusted path
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: 'https://localhost:6969/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(logout());
      toast.error('Session expired. Please sign in again.');
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
