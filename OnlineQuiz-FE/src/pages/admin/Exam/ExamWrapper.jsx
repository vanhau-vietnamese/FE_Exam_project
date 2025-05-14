import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllCategories } from '~/apis';
import { Backdrop } from '~/components';
import { useExamStore } from '~/store';
import DetailExam from './DetailExam';
import DeleteExam from './DeleteExam';
import ExamList from './ExamList';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '~/useContext/AppContext';
import FormUpdateExam from './FormUpdateExam';
const ModalFormObj = {
  ['view']: (
    <Backdrop opacity={0.25}>
      <DetailExam />
    </Backdrop>
  ),
  ['edit']: (
    <Backdrop opacity={0.25}>
      <FormUpdateExam />
    </Backdrop>
  ),
  ['delete']: <DeleteExam />,
};

function ExamWrapper() {
  const { modal, targetExam } = useExamStore((state) => {
    return state;
  });

  const [categories, setCategories] = useState([]);
  const { setCate } = useContext(AppContext);
  useEffect(() => {
    (async () => {
      try {
        const listCategories = await getAllCategories();

        if (listCategories && listCategories.length > 0) {
          setCategories(
            listCategories.map((category) => ({
              display: category.title,
              value: category.id,
            }))
          );
          setCate(
            listCategories.map((category) => ({
              display: category.title,
              value: category.id,
            }))
          );
        }
      } catch (error) {
        toast.error(error.message, { toastId: 'fetch_question' });
      }
    })();
  }, [setCate]);

  return (
    <>
      <ExamList category={categories} />

      {targetExam && modal && ModalFormObj[modal]}
    </>
  );
}

export default ExamWrapper;
