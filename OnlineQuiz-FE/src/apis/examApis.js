import { axiosClient } from './axiosClient';

export const createExam = async (data) => await axiosClient.post('/quiz/add', data);

export const getExams = async () => await axiosClient.get('/quiz/');

export const getQuesOfQuiz = async (id) => await axiosClient.get(`/question/quiz/${id}`);

export const updateQuiz = async (id, body) => await axiosClient.put(`/quiz/update/${id}`, body);

export const deleteQuiz = async (id) => await axiosClient.delete(`/quiz/delete/${id}`);

export const getQuizToStart = async (body) => await axiosClient.post('/take_exam/start-quiz', body);

export const submitQuiz = async (body) => await axiosClient.post('/take_exam/submit', body);

export const searchQuiz = async (body) => await axiosClient.post('/quiz/search', body);

export const filterQuizByCategory = async (id) => await axiosClient.get(`/quiz/category/${id}`);
