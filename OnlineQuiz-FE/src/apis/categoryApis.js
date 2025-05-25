import { useQueryEnhancer } from '~/hooks/core/useRequestProcessor';
import { axiosClient } from './axiosClient';
import { QUERY_KEYS } from '~/constants/query';

export const createCategory = async (data) => await axiosClient.post('/category/add', data);

export const getAllCategories = async () => await axiosClient.get('/category/');

export const deleteCategoryById = async (id) => await axiosClient.delete(`/category/delete/${id}`);

export const searchCategory = async (body) => await axiosClient.post('/category/search', body);

export const useFetchAllCategories = () => {
  return useQueryEnhancer({
    queryKey: [QUERY_KEYS.categories],
    initialData: [],
    queryFn: async () => {
      const data = await getAllCategories();

      const _data = (data || []).map((x) => {
        return {
          display: x?.title ?? '',
          value: x?.id ?? '',
        };
      });

      console.log(_data, '_data123');

      return _data;
    },
  });
};
