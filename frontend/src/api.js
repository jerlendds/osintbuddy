import axios from 'axios';
import { apiUrl } from '@/env';


function authHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const api = {
    async createUser(token, data) {
        return axios.post(`${apiUrl}/api/v1/users/`, data)
    },
    async createSearch(token, data) {
        return axios.post(`${apiUrl}/api/v1/search/`, data, authHeaders(token))
    },
    async getSearchResults(token, searchId, limit, offset) {
        // GET Endpoint: /api/v1/search/
        // Example filter: localhost/api/v1/search/?searchId=5&limit=500&offset=6500
        return axios.get(`${apiUrl}/api/v1/search/?searchId=${searchId}&limit=${limit}&offset=${offset}`, authHeaders(token))
    },
    async getSearchHisory(token) {
        // GET Endpoint: /api/v1/search/
        // Example filter: localhost/api/v1/search/?searchId=5&limit=500&offset=6500
        return axios.get(`${apiUrl}/api/v1/search/history`, authHeaders(token))
    }
}

