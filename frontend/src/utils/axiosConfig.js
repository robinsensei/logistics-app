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
    window.addLog('Request Config', {
        url: config.url,
        token: token ? token.substring(0, 20) + '...' : 'none',
        method: config.method
    });

    if (token) {
      config.headers.Authorization = token; // Token already includes 'Bearer '
    }
    return config;
  },
  (error) => {
    window.addLog('Request Error', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    window.addLog('Response Success', {
        url: response.config.url,
        status: response.status,
        data: response.data ? 'Has Data' : 'No Data'
    });
    return response;
  },
  (error) => {
    window.addLog('Response Error', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        details: error.response?.data
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      window.addLog('Auth Error - Clearing credentials', {
        status: error.response.status,
        url: error.config.url
      });
      // Clear local storage only, AuthContext will handle the redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;