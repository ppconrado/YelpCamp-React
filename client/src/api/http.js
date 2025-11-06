import axios from 'axios';

// Usa VITE_API_URL do .env, senão usa localhost
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const baseURL = `${apiBaseUrl}/api`;

const http = axios.create({
  baseURL,
  withCredentials: true, // Importante para sessões/cookies
});

export default http;
