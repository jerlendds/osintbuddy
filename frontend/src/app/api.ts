import { obSDK } from './openapi';

const API_PREFIX = "/api/v1";
const LS_USER_KEY = "ob-user";
const DOMAIN = process.env.REACT_APP_BASE_URL?.replace('https://', '').replace('http://', '')
const BASE_URL = process.env.REACT_APP_BASE_URL;
const WS_URL = DOMAIN + API_PREFIX;

const sdk = new obSDK({
  BASE: BASE_URL,
  CREDENTIALS: "include",
  WITH_CREDENTIALS: true,
});

export { BASE_URL, LS_USER_KEY, WS_URL, API_PREFIX };
export default sdk;