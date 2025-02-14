import axios from 'axios';
import { getAuthToken } from './authService';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

// ✅ Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
