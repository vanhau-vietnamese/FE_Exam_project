import * as yup from 'yup';
import { Controller, FormProvider, useWatch } from 'react-hook-form';
import { Button, FormInput, FormSelect } from '~/components';
// import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFetchAllCategories, useMutationQuestionsToFilePDF } from '~/apis';
// import { useQuestionStore } from '~/store';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ChooseQuestionModal from './FormChooseQuestion';
import { useResolverForm } from '~/hooks/useResolverForm';
import ListChooseQuestion from './ListChooseQuestion';

const FormCreateExam = () => {
  // const { cate } = useContext(AppContext);
  // console.log(cate, 'shvhsvhs');
  const navigate = useNavigate();

  const { data: categories } = useFetchAllCategories();

  const { isPending } = useMutationQuestionsToFilePDF();

  console.log(isPending, 'isPending1');
  // const { questionList, setQuestionList } = useQuestionStore((state) => state);
  // const {
  //   control,
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm({
  //   resolver: zodResolver(FormExamCreateSchema),
  // });

  const methods = useResolverForm({
    schema: yup.object().shape({
      examName: yup.string().required(),
      category: yup.mixed().test('category', 'category is a required field', function (category) {
        return !!category;
      }),
      time: yup.number().transform((value, originValue) => {
        return originValue === '' ? null : value;
      }),
    }),
    configs: {
      values: {
        examName: '',
        description: '',
        category: '',
        time: '',
        listChooseQuestion: [],
      },
    },
  });

  // const [selectedQuestions, setSelectedQuestions] = useState([]);
  // const [containerQues, setContainerQues] = useState([]);

  // eslint-disable-next-line no-unused-vars

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const listQuestion = await getQuestions();
  //       setQuestionList(listQuestion);
  //       setContainerQues(listQuestion);
  //     } catch (error) {
  //       toast.error(error.message, { toastId: 'fetch_question' });
  //     }
  //   })();
  // }, [setQuestionList]);

  const handleFormSubmit = async (data) => {
    try {
      if (listChooseQuestion.length === 0) {
        toast.error('Bạn cần chọn ít nhất 1 câu hỏi cho bài tập', {
          toastId: 'ít_nhất_một_câu_hỏi',
        });
        return;
      }
      const body = {
        title: data.examName,
        categoryId: data.category,
        description: data.description,
        durationMinutes: data.time,
        listQuestion: listChooseQuestion,
      };

      navigate('/admin/exam/doneCreateExam', { state: { examData: body } });
    } catch (error) {
      toast.error(error.message, { toastId: 'data_exam' });
    }
  };

  // const handleCategoryForFilter = (e) => {
  //   console.log(e, 'shvshvhsv');
  //   const cloneQuesList = [...questionList];
  //   setContainerQues(cloneQuesList.filter((q) => q.category.id === parseInt(e)));
  // };

  // const handleInputTime = (e) => {
  //   const timeInput = Number(e);
  //   console.log('time', timeInput);
  //   if (timeInput < 5 || timeInput > 180) {
  //     toast.error('Thời gian làm bài phải tối thiểu 5 phút và tối đa 180 phút!', {
  //       toastId: 'fail_time',
  //     });
  //   }
  // };

  const [listChooseQuestion] = useWatch({
    control: methods.control,
    name: ['listChooseQuestion'],
  });

  return (
    <div className="w-full">
      <div className="p-4 bg-slate-50 rounded-md ">
        <h3 className="mb-5">Thông tin bài tập</h3>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full flex px-2">
                <div className="m-3 w-[50%]">
                  <Controller
                    key={`examName`}
                    name={`examName`}
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormInput
                        {...field}
                        title="Tên bài tập"
                        placeholder="Nhập tên bài tập"
                        error={error?.message}
                        required
                      />
                    )}
                  />

                  <Controller
                    key={`description`}
                    name={`description`}
                    control={methods.control}
                    render={({ field }) => (
                      <FormInput {...field} title="Mô tả" placeholder="Nhập mô tả bài tập" />
                    )}
                  />
                </div>

                <div className="m-3 w-[50%]">
                  <Controller
                    key={`category`}
                    name={`category`}
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormSelect
                        {...field}
                        label="Danh mục"
                        placeholder="Chọn danh mục..."
                        required
                        error={error?.message}
                        options={categories}
                      />
                    )}
                  />
                </div>

                <div className="m-3 w-[50%]">
                  <Controller
                    key={`time`}
                    name={`time`}
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormInput
                        {...field}
                        min="5"
                        max="180"
                        name="time"
                        type="number"
                        title="Thời gian làm bài cho bài tập"
                        placeholder="Nhập thời gian làm bài"
                        error={error?.message}
                        // onChange={(e) => handleInputTime(e)}
                        required
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <ChooseQuestionModal />
              </div>
            </div>

            {!!listChooseQuestion?.length && <ListChooseQuestion />}

            <div className="flex justify-center">
              <Button
                disable={isPending}
                type="submit"
                className="px-6 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
              >
                Tiếp tục
              </Button>

              <Link
                to="/admin/exam"
                className="px-6 ml-5 py-2 text-sm rounded-md !border border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-5"
              >
                Thoát
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default FormCreateExam;
