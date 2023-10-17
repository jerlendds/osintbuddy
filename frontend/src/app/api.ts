import axios from 'axios';
import { obSDK } from './openapi';

const DOMAIN = process.env.REACT_APP_BASE_URL?.replace('https://', '').replace('http://', '')
const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : process.env.REACT_APP_BASE_URL;

const API_PREFIX = '/api/v1';

const WS_URL =
  process.env.NODE_ENV === 'development'
    ? 'localhost:8000' + API_PREFIX
    : DOMAIN + API_PREFIX;

const LS_USER_AUTH_KEY = 'user-data';

const api = axios.create({
  baseURL: BASE_URL + API_PREFIX,
});

const setHeader = () => {
  const user = JSON.parse(localStorage.getItem(LS_USER_AUTH_KEY) || '{}');
  if (user && user.token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    return `Bearer ${user.token}`;
  }
  return null;
};

setHeader();

// TODO: Move all api calls to new SDK
export const sdk = new obSDK({
  BASE: BASE_URL
})

export {  BASE_URL, LS_USER_AUTH_KEY, WS_URL, API_PREFIX, setHeader };
export default api;
