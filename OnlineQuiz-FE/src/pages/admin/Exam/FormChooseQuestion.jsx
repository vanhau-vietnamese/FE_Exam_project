import { useCallback, useMemo, useState } from 'react';

import { Backdrop, Button, Loading } from '~/components';
import Question from './Question';
import {
  useFetchAllCategories,
  useFetchQuestions,
  useMutationQuestionsGenerate,
  useMutationQuestionsToFilePDF,
} from '~/apis';

import { useFormContext, useWatch } from 'react-hook-form';
import Icons from '~/assets/icons';
// import { useQuestionStore } from '~/store';
// import FormQuestionCreate from '../Question/components/FormQuestionCreate';

function ChooseQuestionModal() {
  const [file, setFile] = useState(null);
  const [fileGenerate, setFileGenerate] = useState(null);
  const { data } = useFetchQuestions();
  const { mutate, isPending } = useMutationQuestionsToFilePDF();
  const { mutate: mutateGenerate, isPending: isPendingGenerate } = useMutationQuestionsGenerate();
  const methods = useFormContext();
  const [open, setOpen] = useState(false);

  const [hideCreatedQuestion, setHideCreatedQuestion] = useState(false);
  const [paramsCreatedRequest, setParamsCreatedRequest] = useState({
    numberQuestion: 0,
    infoTopic: '',
  });

  const { data: categories } = useFetchAllCategories();

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

  const handleFileChangeGenerate = useCallback((event) => {
    const _file = event.target?.files?.[0];
    setFileGenerate(_file);
    event.target.value = '';
  }, []);

  const handleGenerateFile = useCallback(async () => {
    const valid = await methods.trigger();

    if (!valid) {
      return;
    }

    const formData = new FormData();
    formData.append('file', fileGenerate);
    formData.append('number', paramsCreatedRequest.numberQuestion);
    formData.append('message', paramsCreatedRequest.infoTopic);

    try {
      mutateGenerate(formData, {
        onSuccess: (_dataGen) => {
          const _list = (_dataGen || []).map((x) => {
            return {
              answerRequestList: x?.question?.answerRequestList,
              categoryId: x?.question?.categoryId,
              categoryTitle: _category?.display,
              content: x?.question?.content,
              questionTypeId: x?.question?.questionTypeId,
              reason: x?.reason ?? '',
              isChoose: !x?.reason,
              marksOfQuestion: 0,
              isGen: true,
            };
          });

          const _listChooseQuestion = listChooseQuestion?.filter((x) => {
            return !x?.isGen;
          });

          console.log(_list, '_list_gen');

          methods.setValue('listChooseQuestion', [..._listChooseQuestion, ..._list]);
        },
      });
    } catch (err) {
      console.log(err);
    }
  }, [
    _category?.display,
    fileGenerate,
    listChooseQuestion,
    methods,
    mutateGenerate,
    paramsCreatedRequest.infoTopic,
    paramsCreatedRequest.numberQuestion,
  ]);

  return (
    <>
      {(isPending || isPendingGenerate) && (
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

      <Button type="button" className="border border-gray-500 p-2 ml-3 flex text-sm">
        Tự tạo câu hỏi{' '}
        <div
          className="text-blue-500 ml-1"
          onClick={() => {
            setHideCreatedQuestion(!hideCreatedQuestion);
          }}
        >
          <Icons.DocumentText />
        </div>
      </Button>

      {hideCreatedQuestion && (
        <>
          <div style={{ width: '200px' }}>
            <input
              onChange={(e) => {
                console.log(e.target?.value, 'svhsvhshvh');
                const val = Number(e.target?.value || 0);
                if (typeof val === 'number' && !isNaN(val)) {
                  setParamsCreatedRequest({
                    numberQuestion: val,
                    infoTopic: paramsCreatedRequest.infoTopic,
                  });
                }
              }}
              value={paramsCreatedRequest.numberQuestion}
              autoComplete="off"
              placeholder="Nhập số lượng câu hỏi cần tạo"
              className={`text-sm flex-1 w-full px-4 py-2 border outline-none transition-all placeholder:font-medium disabled:bg-[#dee0ec] font-semibold rounded-e-md disabled:hover:border-strike disabled:text-gray-500`}
            />
          </div>

          <div style={{ width: '200px', marginLeft: '20px' }}>
            <input
              onChange={(e) => {
                const val = e.target?.value;
                setParamsCreatedRequest({
                  numberQuestion: paramsCreatedRequest.numberQuestion,
                  infoTopic: val,
                });
              }}
              value={paramsCreatedRequest.infoTopic}
              autoComplete="off"
              placeholder="Chủ đề"
              className={`text-sm flex-1 w-full px-4 py-2 border outline-none transition-all placeholder:font-medium disabled:bg-[#dee0ec] font-semibold rounded-e-md disabled:hover:border-strike disabled:text-gray-500`}
            />
          </div>

          <div>
            <Button
              disable={isPending}
              type="button"
              className="border border-gray-500 p-2 ml-3 flex text-sm"
            >
              <p className="text-blue-500 ml-1">
                <label
                  htmlFor="pdf-generate"
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  Chọn file PDF
                </label>
                <span className="ml-4">{fileGenerate?.name}</span>
              </p>
            </Button>

            <input
              id="pdf-generate"
              type="file"
              accept="application/pdf"
              onChange={handleFileChangeGenerate}
              style={{ display: 'none' }} // ẩn input đi, chỉ còn label click được
            />
          </div>

          <div style={{ marginTop: 3, marginLeft: '20px' }}>
            <Button
              type="button"
              className="px-6 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
              onClick={handleGenerateFile}
              disable={isPendingGenerate}
            >
              Tạo câu hỏi
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default ChooseQuestionModal;
