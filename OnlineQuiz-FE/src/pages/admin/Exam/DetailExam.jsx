import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { getQuesOfQuiz } from '~/apis';
import { Button, TextView } from '~/components';
import { useExamStore } from '~/store';
import { toast } from 'react-toastify';
import { compile } from 'html-to-text';

export default function ViewDetailExam() {
  const { targetExam, setTargetExam, openModal } = useExamStore((state) => state);
  const compiledConvert = compile({
    limits: {
      ellipsis: ' ...',
    },
  });

  const [listQues, setListQues] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await getQuesOfQuiz(targetExam.id);
        if (response) {
          setListQues(response);
        }
      } catch (error) {
        toast.error(error);
      }
    })();
  }, [targetExam.id]);

  return (
    <div className="w-full h-full mx-auto max-w-5xl p-10 animate-fade-down animate-duration-500">
      <form className="w-full h-full bg-white rounded-lg flex flex-col justify-between">
        <div className="text-gray-700 p-4 border-b border-dashed border-strike">
          <h3>Chi tiết bài tập</h3>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto px-4">
          <div className="flex items-center justify-between w-full gap-x-5 mb-5">
            <div className="w-full flex flex-col gap-y-2">
              <TextView value={targetExam.id || '--'} label="Mã bài tập" />
              <TextView value={targetExam.title || '--'} label="Tiêu đề bài tập" />
            </div>
            <div className="w-full flex flex-col gap-y-2">
              <TextView value={targetExam.maxMarks} label="Số điểm" />
              <TextView value={targetExam.numberOfQuestions || '--'} label="Số câu hỏi" />
            </div>
            <div className="w-full flex flex-col gap-y-2">
              <TextView
                value={moment(targetExam.createdAt).format('DD/MM/YYYY - HH:mm A')}
                label="Ngày tạo"
              />

              <TextView value={targetExam.category?.title || '--'} label="Danh mục" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center w-full justify-between mb-2">
              <label className="block text-sm font-semibold text-text">Danh sách câu hỏi</label>
            </div>
            <div>
              <div className="flex flex-col gap-y-4">
                <table className="block w-full text-sm text-left rtl:text-right border-collapse">
                  <thead className="text-[#3b3e66] uppercase text-xs block w-full">
                    <tr className="bg-[#d1d2de] rounded-se w-full flex items-center">
                      <th className="p-3 w-[10%] flex-shrink-0">Mã số</th>
                      <th className="p-3 flex-auto w-[50%]">Nội dung câu hỏi</th>
                      <th className="p-3 flex-auto w-[20%]">Điểm</th>
                      <th className="p-3 flex-shrink-0 w-[20%]">Thời gian tạo</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto block h-[calc(100vh-13rem)] w-full">
                    {listQues &&
                      listQues.map((ques, index) => (
                        <tr
                          key={ques.id}
                          className="flex items-center border-b border-[#d1d2de] transition-all hover:bg-[#d1d2de] hover:bg-opacity-30 h-[45px] font-semibold text-[#3b3e66]"
                        >
                          <td className="p-3 w-[10%] flex-shrink-0">{index + 1}</td>
                          <td className="p-3 w-[50%] flex-auto text-nowrap text-ellipsis overflow-hidden">
                            {compiledConvert(ques.content)}
                          </td>
                          <td className="p-3 w-[20%] flex-auto text-nowrap text-ellipsis overflow-hidden">
                            {ques.additionalFields.marksOfQuestion}
                          </td>

                          <td className="p-3 overflow-hidden flex-shrink-0 w-[20%]" align="left">
                            {moment(ques.createdAt).format('HH:mm, DD/MM/YYYY')}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end px-4 py-3 gap-x-5 border-t border-dashed border-strike">
          <Button
            type="button"
            className="px-6 py-2 text-sm border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-10"
            onClick={() => {
              setTargetExam(null);
              openModal(null);
            }}
          >
            Đóng
          </Button>
        </div>
      </form>
    </div>
  );
}
