import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class EmployeeService {
  getAllEmployees() {
    return axios.get(`${API_URL}/employees`, { headers: authHeader() });
  }

  getEmployee(id) {
    return axios.get(`${API_URL}/employees/${id}`, { headers: authHeader() });
  }

  createEmployee(employee) {
    return axios.post(`${API_URL}/employees`, employee, { headers: authHeader() });
  }

  updateEmployee(id, employee) {
    return axios.put(`${API_URL}/employees/${id}`, employee, { headers: authHeader() });
  }

  deleteEmployee(id) {
    return axios.delete(`${API_URL}/employees/${id}`, { headers: authHeader() });
  }
}

export default new EmployeeService();