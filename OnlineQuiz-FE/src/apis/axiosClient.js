import axios from 'axios';
import queryString from 'query-string';
//import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: (params) => queryString.stringify(params, { arrayFormat: 'bracket' }),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export { axiosClient };
