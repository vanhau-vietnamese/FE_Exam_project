import { create } from 'zustand';

export const useExamStore = create((set) => ({
  modal: null,
  examList: [],
  targetExam: null,
  openModal: (type) => set({ modal: type }),
  setExamList: (examList) => set({ examList }),
  addNewExam: (newExam) =>
    set((state) => ({ examList: [...state.examList, newExam] })),
  setTargetExam: (targetExam) => set({ targetExam }),
  updateExam: (targetExam) =>
    set((state) => {
      const indexExam = state.examList.findIndex((exam) => {
        return exam.id === targetExam.id;
      });
      if (indexExam === -1) {
        return state;
      }
      const cloneList = [...state.examList];
      cloneList[indexExam] = targetExam;
      return { examList: cloneList };
    }),
    removeExam: (examId) =>
    set((state) => ({
      examList: state.examList.filter((exam) => exam.id !== examId),
    })),
}));
