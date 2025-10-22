import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class RouteService {
  getAllRoutes() {
    return axios.get(`${API_URL}/routes`, { headers: authHeader() });
  }

  getRoute(id) {
    return axios.get(`${API_URL}/routes/${id}`, { headers: authHeader() });
  }

  createRoute(route) {
    return axios.post(`${API_URL}/routes`, route, { headers: authHeader() });
  }

  updateRoute(id, route) {
    return axios.put(`${API_URL}/routes/${id}`, route, { headers: authHeader() });
  }

  deleteRoute(id) {
    return axios.delete(`${API_URL}/routes/${id}`, { headers: authHeader() });
  }
}

export default new RouteService();