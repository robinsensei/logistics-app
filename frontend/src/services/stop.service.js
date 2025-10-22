import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class StopService {
  getAllStops() {
    return axios.get(`${API_URL}/stops`, { headers: authHeader() });
  }

  getStop(id) {
    return axios.get(`${API_URL}/stops/${id}`, { headers: authHeader() });
  }

  createStop(stop) {
    return axios.post(`${API_URL}/stops`, stop, { headers: authHeader() });
  }

  updateStop(id, stop) {
    return axios.put(`${API_URL}/stops/${id}`, stop, { headers: authHeader() });
  }

  deleteStop(id) {
    return axios.delete(`${API_URL}/stops/${id}`, { headers: authHeader() });
  }
}

export default new StopService();