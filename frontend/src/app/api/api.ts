import axios, { AxiosInstance } from 'axios';
import { ApiConstants } from '@/src/app/api/api.constants';

const baseURL = ApiConstants.baseURL;

const api: AxiosInstance = axios.create({ baseURL });

export default api;
