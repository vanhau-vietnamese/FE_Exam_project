import { axiosClient } from './axiosClient';

export const createAccoutAdmin = async (body) => await axiosClient.post('/admin/create/adminAccount', body);