import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormInput, TextView } from '~/components';
import { FormExamCreateSchema } from '~/validations/exam';
import classNames from 'classnames';
import { compile } from 'html-to-text';
import { useExamStore, useQuestionStore } from '~/store';
import { useEffect } from 'react';
import { getQuesOfQuiz, updateQuiz } from '~/apis';
import { toast } from 'react-toastify';
import Icons from '~/assets/icons';
import { useRef } from 'react';

export default function FormUpdateExam() {
  const { targetExam, updateExam, setTargetExam, openModal } = useExamStore((state) => state);
  const { questionList } = useQuestionStore((state) => state);
  const [showQuestionList, setShowQuestionList] = useState('showQuestion');
  const [selectedQuestions, setSelectedQuestions] = useState([]); // lưu ID câu hỏi
  const [quesOfQuiz, setQuesOfQuiz] = useState([]); // ds câu hỏi trước khi cập nhật của bài tập
  const [containerQues, setContainerQues] = useState([]); // ds câu hỏi có cate trùng cate bài tập
  const [checkPoint, setCheckPoint] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0); // điểm
  const [isQuestionsSelected, setIsQuestionsSelected] = useState(false);
  const [updatePoint, setUpdatePoint] = useState(false);
  const listPoint = useRef({});
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(FormExamCreateSchema),
    defaultValues: {
      examName: targetExam.title,
      category: targetExam.category.title,
      description: targetExam.description,
      time: targetExam.durationMinutes,
      point: targetExam.maxMarks,
      listQuestion: selectedQuestions.map((item) => ({
        questionId: item,
        marksOfQuestion: item.marksOfQuestion,
      })),
    },
  });

  const compiledConvert = compile({
    limits: {
      ellipsis: ' ...',
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getQuesOfQuiz(targetExam.id);
        if (response) {
          setQuesOfQuiz(response);
          response.map((el) => (listPoint.current[el.id] = el.additionalFields.marksOfQuestion));
          const cloneQuesList = [...questionList];
          setTotalPoints(targetExam.maxMarks);
          setCheckPoint(true);
          setContainerQues(cloneQuesList.filter((q) => q.category.id === targetExam.category.id));
          setSelectedQuestions(response.map((q) => q.id));
        }
      } catch (error) {
        toast.error(error);
      }
    })();
  }, [questionList, targetExam.category.id, targetExam.id, targetExam.maxMarks]);

  useEffect(() => {
    if (isQuestionsSelected) {
      const updatedQuestions = selectedQuestions
        .map((id) => {
          const foundQuestion = containerQues.find((ques) => ques.id === id);
          if (foundQuestion) {
            const existingQuestion = quesOfQuiz.find((item) => item.id === id);
            if (listPoint.current[id] === undefined) {
              listPoint.current[id] = 1;
              setTotalPoints((prevTotal) => prevTotal + 1);
            }
            return {
              ...foundQuestion,
              additionalFields: existingQuestion?.additionalFields || { marksOfQuestion: 1 },
            };
          }
          return null;
        })
        .filter(Boolean);
      setQuesOfQuiz(updatedQuestions);
      console.log('Updated quesOfQuiz:', updatedQuestions);
    }
  }, [selectedQuestions, listPoint]);

  const handleQuestionSelect = (questionID) => {
    setIsQuestionsSelected(true);
    const question = containerQues.find((ques) => ques.id === questionID);

    if (selectedQuestions.includes(questionID)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionID));
      if (question) {
        const previousPoint = listPoint.current[questionID] || 0;
        setTotalPoints(totalPoints - previousPoint);
        delete listPoint.current[questionID];
      }
    } else {
      setSelectedQuestions([...selectedQuestions, questionID]);
      if (question) {
        const point = question.additionalFields.marksOfQuestion || 1;
        setTotalPoints(totalPoints + point);
        listPoint.current[questionID] = point;
      }
    }
  };

  const handleChooseFromBank = () => {
    setShowQuestionList('select');
  };

  const handleShowQuestion = () => {
    setShowQuestionList('showQuestion');
  };

  const handlePointsChange = (id, e) => {
    const point = Number(e.target.value);
    if (Number.isInteger(point) && point > 0 && point < 11) {
      const foundQuestionIdx = quesOfQuiz.findIndex((el) => el.id === id);

      setQuesOfQuiz((prev) =>
        prev.map((item, index) =>
          index === foundQuestionIdx
            ? {
                ...item,
                additionalFields: {
                  ...item.additionalFields,
                  marksOfQuestion: point,
                },
              }
            : item
        )
      );
      setCheckPoint(true);
    } else {
      console.log(2);
      toast.error('Hãy nhập điểm là số nguyên dương!', {
        toastId: 'please_enter_point_is_integer',
      });
      setCheckPoint(false);
    }
  };

  useEffect(() => {
    const totalPoint = quesOfQuiz.reduce((acc, val) => {
      const point = val.additionalFields?.marksOfQuestion ?? 1;
      return acc + point;
    }, 0);
    setTotalPoints(totalPoint);
  }, [quesOfQuiz]);

  const handlePoint = (e) => {
    e.stopPropagation();
  };

  const onClose = () => {
    setTargetExam(null);
    openModal(null);
  };

  const handleUpdatePoint = () => {
    setUpdatePoint(!updatePoint);
  };

  const handleFormUpdate = async (data) => {
    console.log('data', data);
    try {
      const body = {
        title: data.examName,
        categoryId: targetExam.category.id,
        description: data.description,
        maxMarks: totalPoints,
        durationMinutes: parseInt(data.time),
        listQuestion: quesOfQuiz.map((ques) => ({
          questionId: ques.id,
          marksOfQuestion: ques?.additionalFields?.marksOfQuestion,
        })),
      };
      const response = await updateQuiz(targetExam.id, body);
      if (response) {
        updateExam(response);
        toast.success('Cập nhật bài tập thành công', { toastId: 'update_exam' });
        onClose();
      }
    } catch (error) {
      toast.error(error.message, { toastId: 'update_exam' });
    }
  };

  return (
    <div className="flex items-center justify-center px-40 py-6">
      <div className="container mx-auto p-4 bg-white rounded-md">
        <form className="w-full" onSubmit={handleSubmit(handleFormUpdate)}>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full flex px-3">
              <div className="m-3 w-[50%]">
                <FormInput
                  control={control}
                  name="examName"
                  title="Tên bài tập"
                  placeholder="Nhập tên bài tập"
                  required
                />
                <FormInput
                  control={control}
                  name="description"
                  title="Mô tả"
                  placeholder="Nhập mô tả bài tập"
                  required
                />
              </div>

              <div className="m-2 w-[50%]">
                <span className="text-sm font-bold text-icon">Danh mục</span>
                <FormInput
                  control={control}
                  name="category"
                  label="Danh mục"
                  disabled
                  error={errors.category?.message}
                />
                {showQuestionList === 'showQuestion' && (
                  <div className="mt-5">
                    <span className="text-sm font-bold text-icon mb-1">Điểm của bài tập</span>
                    <TextView
                      control={control}
                      value={totalPoints.toString()}
                      className="text-sm border rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="m-3 w-[50%]">
                <FormInput
                  type="number"
                  control={control}
                  name="time"
                  title="Nhập thời gian làm bài cho bài tập"
                  placeholder="Nhập thời gian làm bài"
                  required
                />
              </div>
            </div>
            <div className="w-full grid grid-cols-4">
              <div className="flex items-center col-span-3">
                <div>
                  <Button
                    type="button"
                    onClick={handleChooseFromBank}
                    className={classNames(
                      'border border-gray-500 p-2 ml-3 flex text-sm hover:text-green-600',
                      {
                        'text-green-600 ': showQuestionList === 'select',
                      }
                    )}
                  >
                    Thêm câu hỏi
                  </Button>
                </div>
                <div className="text-sm">
                  <Button
                    onClick={handleShowQuestion}
                    className={classNames(
                      'cursor-pointer text-sm font-semibold hover:text-green-600',
                      {
                        'text-green-600 ': showQuestionList === 'showQuestion',
                      }
                    )}
                  >
                    Danh sách câu hỏi
                  </Button>
                </div>
              </div>
              {showQuestionList === 'showQuestion' && (
                <div
                  className={classNames(
                    'cursor-pointer text-sm font-semibold hover:text-green-600 border px-3 shadow-md py-2 w-[130px] rounded-md col-span-1',
                    {
                      'text-green-600 ': updatePoint === true,
                    }
                  )}
                  onClick={handleUpdatePoint}
                >
                  Cập nhật điểm
                </div>
              )}
            </div>
          </div>

          {showQuestionList === 'select' && (
            <div className="mb-4">
              <div className="bg-white hover:bg-slate-100 w-full rounded-md">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="block w-full text-sm text-left rtl:text-right border-collapse">
                    <thead className="text-[#3b3e66] uppercase text-xs block w-full">
                      <tr className="bg-[#d1d2de] rounded-se w-full flex items-center">
                        <th className="p-3 flex-auto w-[60%]">Nội dung câu hỏi</th>
                        <th className="p-3 flex-auto w-[30%]">Danh mục</th>
                        <th className="p-3 flex-auto w-[10%]"></th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-auto block w-full">
                      {containerQues.map((item, index) => {
                        return (
                          <tr
                            onClick={() => handleQuestionSelect(item?.id)}
                            key={item.id}
                            className="flex bg-slate-50 items-center border-b border-[#d1d2de] hover:bg-slate-100 h-[45px] font-semibold text-[#3b3e66]"
                          >
                            <td className="p-3 flex flex-auto w-[60%]">
                              {index + 1}.{compiledConvert(item?.content)}
                            </td>
                            <td className="p-3 flex-shrink-0 w-[30%]">
                              {item.category?.title || '--'}
                            </td>

                            <td className="p-3 flex-shrink-0 w-[10%]">
                              {selectedQuestions.includes(item.id) && (
                                <div className="text-white ml-5 bg-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                  <Icons.Check />
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {showQuestionList === 'showQuestion' && (
            <div className="mb-4">
              <div className=" w-full rounded-md">
                <div className=" overflow-y-auto">
                  {quesOfQuiz.map((ques, index) => {
                    return (
                      <div
                        className="m-3 bg-slate-100 hover:bg-slate-50 shadow-sm rounded-md py-2 px-3 grid grid-cols-4 items-center"
                        key={`abcjhys-jgsu-${ques.id}`}
                      >
                        <div className="col-span-3">
                          {index + 1}
                          {'. '}
                          {compiledConvert(ques?.content)}
                        </div>
                        <div className="col-span-1">
                          <input
                            min="1"
                            max="10"
                            onClick={handlePoint}
                            onChange={(e) => handlePointsChange(ques.id, e)}
                            className="h-[40px] w-[60px] border-2 shadow-lg rounded-md"
                            type="number"
                            name="point"
                            disabled={!updatePoint}
                            defaultValue={ques?.additionalFields?.marksOfQuestion || 1}
                            required
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            {showQuestionList === 'showQuestion' && (
              <Button
                type="submit"
                disable={!checkPoint}
                className={classNames('px-6 py-2 text-sm text-white bg-primary ', {
                  'cursor-not-allowed bg-primary/80': !checkPoint,
                  'shadow-success hover:shadow-success_hover': checkPoint,
                })}
              >
                Cập nhật
              </Button>
            )}

            <Button
              onClick={onClose}
              className="px-6 py-2 ml-3 text-sm rounded-md !border border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-10"
            >
              Thoát
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
