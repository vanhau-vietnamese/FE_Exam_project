import { useMutationEnhancer, useQueryEnhancer } from '~/hooks/core/useRequestProcessor';
import { axiosClient } from './axiosClient';
import { QUERY_KEYS } from '~/constants/query';

export const sendMessage = async (body) => await axiosClient.post('/chat', body);
export const getHistory = async () => await axiosClient.get('/chat/history');

export const useMutationSendMessage = () => {
  const mutation = useMutationEnhancer({
    mutationFn: async (params) => {
      const res = await sendMessage(params);
      return res || [];
    },
  });

  return mutation;
};

export const useFetchChatHistory = () => {
  return useQueryEnhancer({
    queryKey: [QUERY_KEYS.chatHistory],
    initialData: [],
    queryFn: async () => {
      const data = await getHistory();

      return data;
    },
  });
};
