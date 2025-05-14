import { axiosClient } from './axiosClient';

export const getQuestions = async () => await axiosClient.get('/question/');

export const getQuestionTypes = async () => await axiosClient.get('/question-type/');

export const createQuestion = async (body) => await axiosClient.post('/question/add', body);

export const editQuestion = async (id, body) => await axiosClient.put(`/question/edit/${id}`, body);

export const deleteQuestion = async (id) => await axiosClient.put(`/question/delete/${id}`);

export const getQuesOfCategory = async (id) => await axiosClient.get(`/question/category/${id}`);

export const searchQues = async (body) => await axiosClient.post('/question/search', body);
