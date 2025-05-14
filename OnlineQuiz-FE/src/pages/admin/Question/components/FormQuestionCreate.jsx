import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createQuestion, getAllCategories } from '~/apis';
import Icons from '~/assets/icons';
import { Button, FormSelect } from '~/components';
import FormEditor from '~/components/Form/FormEditor';
import { useQuestionStore } from '~/store';
import { FormQuestionCreateSchema } from '~/validations';
import AnswersCreate from './AnswersCreate';

export default function FormQuestionCreate({ onClose }) {
  const { addNewQuestion, questionTypes } = useQuestionStore((state) => state);
  const {
    control,
    formState: { errors },
    watch,
    getValues,
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(FormQuestionCreateSchema),
    defaultValues: {
      questionType: questionTypes[0].value,
      answers: Array(4).fill({ content: '', isCorrect: false }),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'answers',
  });

  const [categories, setCategories] = useState([]);
  const selectedQuestionType = watch('questionType');

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
        }
      } catch (error) {
        toast.error(error.message, { toastId: 'fetch_question' });
      }
    })();
  }, []);

  const handleCreateQuestion = async (data) => {
    try {
      const body = {
        content: data.content,
        categoryId: data.category,
        questionTypeId: data.questionType,
        answerRequestList: data.answers.map((answer) => ({
          media: answer.media || null,
          content: answer.content,
          correct: answer.isCorrect,
        })),
      };
      const response = await createQuestion(body);
      if (response) {
        addNewQuestion(response);
        toast.success('Tạo mới câu hỏi thành công', { toastId: 'create_question' });
        onClose();
      }
    } catch (error) {
      toast.error(error.message, { toastId: 'create_question' });
    }
  };

  const onRadioChange = (index) => {
    if (selectedQuestionType === 'single_choice') {
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

  return (
    <div className="h-full mx-auto container  max-w-5xl p-10 animate-fade-down animate-duration-500">
      <form
        className="w-full h-full bg-white rounded-lg flex flex-col justify-between"
        onSubmit={handleSubmit(handleCreateQuestion)}
      >
        <div className="text-gray-700 p-4 border-b border-dashed border-strike">
          <h3>Tạo mới câu hỏi</h3>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto p-4">
          <div className="flex items-center justify-between w-full gap-x-5 mb-5">
            <FormSelect
              control={control}
              name="questionType"
              label="Loại câu hỏi"
              placeholder="Chọn loại câu hỏi..."
              error={errors.questionType?.message}
              required
              icon={<Icons.Tag />}
              options={questionTypes}
            />
            <FormSelect
              control={control}
              name="category"
              label="Danh mục"
              placeholder="Chọn danh mục..."
              required
              icon={<Icons.BookOpen />}
              error={errors.category?.message}
              options={categories}
            />
          </div>
          <FormEditor
            control={control}
            name="content"
            title="Nội dung câu hỏi"
            placeholder="Nhập nội dung câu hỏi..."
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
                onClick={() => append({ content: '', isCorrect: false })}
                disable={!selectedQuestionType}
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
                  type={selectedQuestionType}
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
            className="px-6 py-2 text-sm !border border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-5"
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
          >
            Tạo mới
          </Button>
        </div>
      </form>
    </div>
  );
}

FormQuestionCreate.propTypes = {
  onClose: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
};
