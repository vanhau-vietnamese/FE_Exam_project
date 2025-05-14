import { axiosClient } from './axiosClient';

export const getStatistic = async () => await axiosClient.get('/admin/statistics/monthly');
