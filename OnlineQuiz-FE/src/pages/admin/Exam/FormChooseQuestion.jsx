import { useMemo, useState } from 'react';

import { Backdrop, Button } from '~/components';
import Question from './Question';
import { useFetchQuestions } from '~/apis';

import { useFormContext, useWatch } from 'react-hook-form';
// import { useQuestionStore } from '~/store';
// import FormQuestionCreate from '../Question/components/FormQuestionCreate';

function ChooseQuestionModal() {
  const { data } = useFetchQuestions();
  console.log(data, 'dataa');
  const methods = useFormContext();
  const [open, setOpen] = useState(false);

  // const handleQuestionSelect = (question) => {
  //   if (selectedQuestions && selectedQuestions.includes(question)) {
  //     setSelectedQuestions(selectedQuestions.filter((id) => id !== question));
  //   } else {
  //     setSelectedQuestions([...selectedQuestions, question]);
  //   }
  // };

  const [category, listChooseQuestion] = useWatch({
    control: methods.control,
    name: ['category', 'listChooseQuestion'],
  });

  console.log(category, 'category');

  const _data = useMemo(() => {
    const listChooseQuestionMap = new Map(listChooseQuestion.map((item) => [item.id, true]));
    const merged = (category ? data.filter((q) => q.category.id === parseInt(category)) : data).map(
      (item) => ({
        ...item,
        isChoose: listChooseQuestionMap.has(item.id),
      })
    );

    return merged;
  }, [category, data, listChooseQuestion]);

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-gray-500 p-2 ml-3 flex text-sm"
      >
        Chọn câu hỏi1 <p className="text-blue-500 ml-1"> tại đây</p>
      </Button>
      {open && (
        <Backdrop opacity={0.25}>
          <div className="h-full mx-auto container  max-w-5xl p-10 animate-fade-down animate-duration-500">
            <form className="w-full h-full bg-white rounded-lg flex flex-col">
              <div className="text-gray-700 p-4 border-b border-dashed border-strike">
                <h3>Chọn câu hỏi</h3>
              </div>
              <Question onCancel={onCancel} listQuestion={_data} />
            </form>
          </div>
        </Backdrop>
      )}
    </>
  );
}

export default ChooseQuestionModal;
