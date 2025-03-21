import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = (email, password, role) => {
    return axios.post(`${API_URL}/register`, { email, password, role });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

export default { register, login };