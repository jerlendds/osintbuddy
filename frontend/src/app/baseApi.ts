import { createApi, fetchBaseQuery, Api } from '@reduxjs/toolkit/query/react'
import { SdkConfig } from 'casdoor-js-sdk/lib/cjs/sdk';

const API_PREFIX = "/api/v1";
const LS_USER_KEY = "ob-user";
const lUserDefault = (isAuthenticated: boolean) => ({ isAuthenticated})

const DOMAIN = process.env.REACT_APP_BASE_URL?.replace('https://', '').replace('http://', '')
const BASE_URL = process.env.REACT_APP_BASE_URL;
const WS_URL = DOMAIN + API_PREFIX;

const emptyApi = createApi({
  reducerPath: 'ob',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  endpoints:  () => ({}),
})

const CASDOOR_CONFIG: SdkConfig = {
  serverUrl: process.env.REACT_APP_CASDOOR_ENDPOINT ?? 'http://localhost:45910',
  clientId: process.env.REACT_APP_CASDOOR_CLIENT_ID ?? '1d69456af504f585b7bf',
  organizationName: process.env.REACT_APP_CASDOOR_ORG_NAME ?? 'org_osintbuddy',
  appName: process.env.REACT_APP_CASDOOR_APP_NAME ?? 'app_osintbuddy',
  redirectPath: "/callback",
  signinPath: "/api/v1/auth/sign-in",
}

// localStorage utilities
export { LS_USER_KEY, lUserDefault };

// api utilities
export { BASE_URL, WS_URL, API_PREFIX, CASDOOR_CONFIG, emptyApi };