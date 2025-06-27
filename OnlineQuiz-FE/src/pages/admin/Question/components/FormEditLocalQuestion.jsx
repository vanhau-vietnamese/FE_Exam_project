import { zodResolver } from '@hookform/resolvers/zod';

import { useFieldArray, useForm } from 'react-hook-form';

import Icons from '~/assets/icons';
import { Button } from '~/components';
import FormEditor from '~/components/Form/FormEditor';

import { FormQuestionCreateSchema } from '~/validations';
import AnswersCreate from './AnswersCreate';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

// eslint-disable-next-line react/prop-types
export default function FormEditLocalQuestion({ dataEdit, setDataEdit, cbFn }) {
  console.log(dataEdit, 'dataEdit');
  const {
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(FormQuestionCreateSchema),
    defaultValues: {
      questionType: dataEdit?.item?.questionTypeId,
      category: dataEdit?.item?.categoryId,
      content: dataEdit?.item?.content,
      answers: (dataEdit?.item?.answerRequestList || [])?.map((item) => ({
        content: item.content,
        isCorrect: Boolean(item.correct),
      })),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'answers',
  });

  const onRadioChange = (index) => {
    if (dataEdit?.item?.questionTypeId === 'single_choice') {
      const updatedAnswers = getValues('answers').map((answer, i) => {
        if (i === index) {
          return { ...answer, isCorrect: true };
        } else {
          return { ...answer, isCorrect: false };
        }
      });
      return replace(updatedAnswers);
    }
  };

  const handleClick = useCallback(() => {
    const _params = getValues();
    const _data = {
      ...dataEdit?.item,
      answerRequestList: _params?.answers?.map((x) => {
        return {
          ...x,
          correct: x?.isCorrect,
        };
      }),
      content: _params?.content,
    };
    cbFn(_data, dataEdit?.index);
    setDataEdit({ item: null, index: -1 });
  }, [cbFn, dataEdit?.index, dataEdit?.item, getValues, setDataEdit]);

  return (
    <div className="w-full h-full mx-auto max-w-5xl p-10 animate-fade-down animate-duration-500">
      <form
        className="w-full h-full bg-white rounded-lg flex flex-col"
        // onSubmit={handleSubmit((_params) => {
        //   console.log(_params, 'shvhsvshv');
        // })}
      >
        <div className="text-gray-700 p-4 border-b border-dashed border-strike">
          <h3>Chỉnh sửa câu hỏi2</h3>
        </div>
        <div className="p-4 flex">
          <div>
            <h3 className="text-gray-700">Lí do không hợp lệ: </h3>
          </div>
          <div className="">{dataEdit?.item?.reason}</div>
        </div>

        <div className="p-4 flex">
          <div>
            <h3 className="text-gray-700">Gợi ý chỉnh sửa: </h3>
          </div>
          <div className="">{dataEdit?.item?.suggestion}</div>
        </div>

        <div className="flex-1 max-h-[700px] overflow-y-auto p-4">
          <FormEditor
            control={control}
            name="content"
            title="Nội dung câu hỏi"
            required
            error={errors.content?.message}
          />

          <div className="w-full mt-5">
            <div className="flex items-center w-full justify-between mb-2">
              <label className="block p-1 text-sm font-bold text-icon">
                {'Đáp án câu hỏi'}
                <strong className="text-error"> *</strong>
              </label>

              <Button
                type="button"
                className="p-1 text-sm text-primary flex items-center gap-1 hover:bg-primary hover:bg-opacity-10 disabled:hover:bg-transparent"
                onClick={() => append({ content: '', correct: false })}
              >
                <Icons.Plus />
                <span>Thêm đáp án</span>
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {fields.map((_, index) => (
                <AnswersCreate
                  key={_.id}
                  control={control}
                  name={`answers.${index}`}
                  inputName="answers"
                  error={errors?.answers?.[index]}
                  type={dataEdit?.item?.questionTypeId}
                  onRadioChange={() => onRadioChange(index)}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end px-4 py-3 gap-x-5 border-t border-dashed border-strike">
          <Button
            type="button"
            className="px-6 py-2 text-sm !border border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-10"
            onClick={() => {
              setDataEdit({ item: null, index: -1 });
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleClick}
            className="px-6 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
          >
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
}

FormEditLocalQuestion.propTypes = {
  setDataEdit: PropTypes.func.isRequired,
  cbFn: PropTypes.func.isRequired,
  dataEdit: PropTypes.object,
};
