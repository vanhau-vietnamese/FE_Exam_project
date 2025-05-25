import { useQueryEnhancer } from '~/hooks/core/useRequestProcessor';
import { axiosClient } from './axiosClient';
import { QUERY_KEYS } from '~/constants/query';

export const getQuestions = async () => await axiosClient.get('/question/');

export const getQuestionTypes = async () => await axiosClient.get('/question-type/');

export const createQuestion = async (body) => await axiosClient.post('/question/add', body);

export const editQuestion = async (id, body) => await axiosClient.put(`/question/edit/${id}`, body);

export const deleteQuestion = async (id) => await axiosClient.put(`/question/delete/${id}`);

export const getQuesOfCategory = async (id) => await axiosClient.get(`/question/category/${id}`);

export const searchQues = async (body) => await axiosClient.post('/question/search', body);

export const useFetchQuestions = () => {
  return useQueryEnhancer({
    queryKey: [QUERY_KEYS.questions],
    initialData: [],
    queryFn: async () => {
      const data = await getQuestions();
      return (data || []).map((x) => ({ ...x, isChoose: false }));
    },
  });
};
