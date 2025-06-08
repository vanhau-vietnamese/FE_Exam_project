import { useMemo, useState } from 'react';

import { Backdrop, Button } from '~/components';
import Question from './Question';
import { useFetchQuestions, useMutationQuestionsToFilePDF } from '~/apis';

import { useFormContext, useWatch } from 'react-hook-form';
// import { useQuestionStore } from '~/store';
// import FormQuestionCreate from '../Question/components/FormQuestionCreate';

function ChooseQuestionModal() {
  const [file, setFile] = useState(null);
  const { data } = useFetchQuestions();
  const { mutate, data: listQuestionPdf } = useMutationQuestionsToFilePDF();
  const methods = useFormContext();
  const [open, setOpen] = useState(false);

  console.log(listQuestionPdf, 'listQuestionPdf');

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

  console.log(listChooseQuestion, 'sgvhshvshvh');

  const handleFileChange = async (event) => {
    const _file = event.target?.files?.[0];
    setFile(_file);
    const formData = new FormData();
    formData.append('file', _file); // key "file" này phải trùng với tên param BE nhận

    try {
      mutate(formData, {
        onSuccess: (_data) => {
          const _list = (_data || []).map((x) => {
            return {
              answerRequestList: x?.question?.answerRequestList,
              categoryId: x?.question?.categoryId,
              categoryTitle: x?.category?.title,
              content: x?.question?.content,
              questionTypeId: x?.question?.questionTypeId,
              reason: x?.reason ?? '',
              isChoose: !x?.reason,
            };
          });

          methods.setValue('listChooseQuestion', [...listChooseQuestion, ..._list]);
        },
      });
    } catch (error) {
      console.error('Upload thất bại', error);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={async () => {
          const valid = await methods.trigger();
          if (valid) {
            setOpen(true);
          }
        }}
        className="border border-gray-500 p-2 ml-3 flex text-sm"
      >
        Chọn câu hỏi <p className="text-blue-500 ml-1"> tại đây</p>
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
      <Button type="button" className="border border-gray-500 p-2 ml-3 flex text-sm">
        Chọn từ file{' '}
        <p className="text-blue-500 ml-1">
          <label
            htmlFor="pdf-upload"
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          >
            Chọn file PDF
          </label>
          <span className="ml-4">{file?.name}</span>
        </p>
      </Button>

      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }} // ẩn input đi, chỉ còn label click được
      />
    </>
  );
}

export default ChooseQuestionModal;
