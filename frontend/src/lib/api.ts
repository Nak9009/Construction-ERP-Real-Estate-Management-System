import axios from 'axios';

// The Laravel backend API URL (assuming it runs on port 8000 locally)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Ensure we send cookies for Sanctum CSRF protection when needed
  withCredentials: true,
});

// Response interceptor for generic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    // You could trigger a toast notification system here
    return Promise.reject(error);
  }
);

export default api;
