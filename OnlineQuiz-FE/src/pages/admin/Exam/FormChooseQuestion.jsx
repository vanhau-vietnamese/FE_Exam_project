import { useMemo, useState } from 'react';

import { Backdrop, Button, Loading } from '~/components';
import Question from './Question';
import { useFetchAllCategories, useFetchQuestions, useMutationQuestionsToFilePDF } from '~/apis';

import { useFormContext, useWatch } from 'react-hook-form';
// import { useQuestionStore } from '~/store';
// import FormQuestionCreate from '../Question/components/FormQuestionCreate';

function ChooseQuestionModal() {
  const [file, setFile] = useState(null);
  const { data } = useFetchQuestions();
  const { mutate, data: listQuestionPdf, isPending } = useMutationQuestionsToFilePDF();
  console.log(isPending, 'isPending');
  const methods = useFormContext();
  const [open, setOpen] = useState(false);

  const { data: categories } = useFetchAllCategories();

  console.log(listQuestionPdf, 'listQuestionPdf');

  const [category, listChooseQuestion] = useWatch({
    control: methods.control,
    name: ['category', 'listChooseQuestion'],
  });

  const _data = useMemo(() => {
    const listChooseQuestionMap = new Map(listChooseQuestion.map((item) => [item?.id, true]));
    const merged = (category ? data.filter((q) => q.category.id === parseInt(category)) : data).map(
      (item) => ({
        ...item,
        isChoose: listChooseQuestionMap.has(item.id),
        point: 0,
      })
    );

    return merged;
  }, [category, data, listChooseQuestion]);

  const onCancel = () => {
    setOpen(false);
  };

  const _category = categories.find((o) => o?.value?.toString() === category);

  const handleFileChange = async (event) => {
    const valid = await methods.trigger();

    if (!valid) {
      event.target.value = '';
      return;
    }
    const _file = event.target?.files?.[0];
    setFile(_file);
    const formData = new FormData();
    formData.append('file', _file); // key "file" này phải trùng với tên param BE nhận

    event.target.value = '';
    const _listChooseQuestion = listChooseQuestion?.filter((x) => {
      return !x?.isVerify;
    });

    try {
      mutate(formData, {
        onSuccess: (_data1) => {
          const _list = (_data1 || []).map((x) => {
            return {
              answerRequestList: x?.question?.answerRequestList,
              categoryId: x?.question?.categoryId,
              categoryTitle: _category?.display,
              content: x?.question?.content,
              questionTypeId: x?.question?.questionTypeId,
              reason: x?.reason ?? '',
              isChoose: !x?.reason,
              marksOfQuestion: 0,
              isVerify: true,
            };
          });

          methods.setValue('listChooseQuestion', [..._listChooseQuestion, ..._list]);
        },
      });
    } catch (error) {
      console.error('Upload thất bại', error);
    }
  };

  return (
    <>
      {isPending && (
        <Backdrop opacity={0}>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Loading />
            <h4 className="font-semibold text-center text-icon mt-4">
              Hệ thống đang xử lý,{' '}
              <span className="font-semibold text-icon">Xin vui lòng chờ trong giây lát!</span>
            </h4>
          </div>
        </Backdrop>
      )}

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
      <Button
        disable={isPending}
        type="button"
        className="border border-gray-500 p-2 ml-3 flex text-sm"
      >
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
        disabled={isPending}
        style={{ display: 'none' }} // ẩn input đi, chỉ còn label click được
      />
    </>
  );
}

export default ChooseQuestionModal;
