import axios from 'axios';

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'http://localhost:5000'  // 'https://osintbuddy.com';
export const API_PREFIX = '/api/v1';

export const WS_URL = 'localhost:5000' + API_PREFIX

export const LS_USER_AUTH_KEY = 'user-data';

const api = axios.create({
  baseURL: BASE_URL + API_PREFIX,
});

export const setHeader = () => {
  const user = JSON.parse(localStorage.getItem(LS_USER_AUTH_KEY) || '{}');
  if (user && user.token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    return `Bearer ${user.token}`;
  }
  return null;
};

setHeader();

export default api;
