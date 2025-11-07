import axios from 'axios';

// Prefer VITE_API_URL; otherwise use current origin for proxy-friendly same-site calls
const apiBaseUrl =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ''
    ? import.meta.env.VITE_API_URL
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
const baseURL = `${apiBaseUrl}/api`;

const http = axios.create({
  baseURL,
  withCredentials: true, // Importante para sessões/cookies
});

export default http;
