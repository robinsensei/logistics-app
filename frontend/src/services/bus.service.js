import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class BusService {
  getAllBuses() {
    return axios.get(`${API_URL}/buses`, { headers: authHeader() });
  }

  getBus(id) {
    return axios.get(`${API_URL}/buses/${id}`, { headers: authHeader() });
  }

  createBus(bus) {
    return axios.post(`${API_URL}/buses`, bus, { headers: authHeader() });
  }

  updateBus(id, bus) {
    return axios.put(`${API_URL}/buses/${id}`, bus, { headers: authHeader() });
  }

  deleteBus(id) {
    return axios.delete(`${API_URL}/buses/${id}`, { headers: authHeader() });
  }
}

export default new BusService();