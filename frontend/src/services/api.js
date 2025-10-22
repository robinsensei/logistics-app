import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
});

// Create a persistent log array
window.requestLogs = [];

window.addLog = (message, data) => {
    const log = { timestamp: new Date().toISOString(), message, data };
    window.requestLogs.push(log);
    // Keep only last 50 logs
    if (window.requestLogs.length > 50) window.requestLogs.shift();
    // Also log to console
    console.log(`${log.timestamp}: ${message}`, data);
};

// Expose logs globally for debugging
window.viewAuthLogs = () => {
    console.table(window.requestLogs);
};

// Add a request interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token; // Token already includes 'Bearer '
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear local storage only, AuthContext will handle the redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;