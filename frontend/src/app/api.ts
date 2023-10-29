import axios from 'axios';
import { obSDK } from './openapi';

const DOMAIN = process.env.REACT_APP_BASE_URL?.replace('https://', '').replace('http://', '')
const BASE_URL = process.env.REACT_APP_BASE_URL;

const API_PREFIX = '/api/v1';

const WS_URL = DOMAIN + API_PREFIX;

const LS_USER_AUTH_KEY = 'user-data';

const api = axios.create({
  baseURL: BASE_URL + API_PREFIX,
});

export const sdk = new obSDK({
  BASE: BASE_URL,
  CREDENTIALS: "include",
  WITH_CREDENTIALS: true,
})

export { BASE_URL, LS_USER_AUTH_KEY, WS_URL, API_PREFIX };
export default api;
