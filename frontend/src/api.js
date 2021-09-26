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
    }
}