import { useQueryEnhancer } from '~/hooks/core/useRequestProcessor';
import { axiosClient } from './axiosClient';
import { QUERY_KEYS } from '~/constants/query';

export const getHistory = async () => await axiosClient.get('/history/');

export const searchHistory = async (body) => await axiosClient.post('/history/search', body);

export const getHistoryDetail = async (id) => await axiosClient.get(`/history/detail/${id}`);

export const deleteHistory = async (id) => await axiosClient.delete(`/history/delete/${id}`);

export const useFetchSearchHistory = (searchContent) => {
  return useQueryEnhancer({
    queryKey: [QUERY_KEYS.searchHistory, searchContent],
    initialData: [],
    queryFn: async () => {
      const data = await searchHistory({ searchContent: searchContent });
      return data || [];
    },
  });
};

export const useFetchHistoryDetail = (id) => {
  return useQueryEnhancer({
    queryKey: [QUERY_KEYS.historyDetail, id],
    initialData: {},
    queryFn: async () => {
      const data = await getHistoryDetail(id);
      console.log(data, 'shvhsvh');
      return data ?? {};
    },
    enable: !!id,
  });
};
