import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'https://shoppingonline-server.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

export default API;