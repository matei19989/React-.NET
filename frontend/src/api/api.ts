// src/api/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with proper configuration
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5194/api', // Use HTTP port
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // Redirect to login page if needed
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error:', error.message);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;