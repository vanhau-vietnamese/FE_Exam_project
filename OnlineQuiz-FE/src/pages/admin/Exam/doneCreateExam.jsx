import classNames from 'classnames';
import { compile } from 'html-to-text';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createExam } from '~/apis';
import { Button } from '~/components';
import { useExamStore } from '~/store';

const compiledConvert = compile({
  limits: {
    ellipsis: ' ...',
  },
});

export default function DoneCreateExam() {
  const { addNewExam } = useExamStore((state) => state);
  const data = useLocation();
  const navigate = useNavigate();
  const dataExam = [data?.state.examData];
  const prevDataOfExam = data?.state.examData;

  const [quesPoint, setQuesPoint] = useState([]); // chứa quesID + Point
  const [totalPoints, setTotalPoints] = useState(0);
  const [listQuesFail, setListQuesFail] = useState([]); // list id câu hỏi nhập điểm bị sai
  const [checkPoint, setCheckPoint] = useState(false);

  //tính điểm
  useEffect(() => {
    const points = quesPoint
      .map((element) => parseInt(element.point))
      .reduce((acc, curr) => acc + curr, 0);
    setTotalPoints(points);
  }, [quesPoint, setQuesPoint]);

  const handlePoint = (e) => {
    e.stopPropagation();
  };

  const handlePointsChange = (id, e) => {
    const point = Number(e.target.value);
    if (Number.isInteger(point) && point > 0) {
      setQuesPoint((prev) => {
        const foundPoint = prev.find((p) => p.id === id);
        if (!foundPoint) {
          if (
            listQuesFail.length === 0 &&
            prevDataOfExam.listQuestion.length === quesPoint.length + 1
          ) {
            setCheckPoint(true);
          }
          return [...prev, { id, point: point }];
        } else {
          if (
            listQuesFail.length === 1 &&
            prevDataOfExam.listQuestion.length === quesPoint.length
          ) {
            setCheckPoint(true);
          }
          const index = listQuesFail.indexOf(id);
          setListQuesFail((prev) => prev.splice(index, 1));

          foundPoint.point = point;
          return [...prev];
        }
      });
    } else {
      toast.error('Hãy nhập điểm là số nguyên dương!', {
        toastId: 'please_enter_point_is_integer',
      });
      if (!listQuesFail.includes(id)) setListQuesFail((prev) => [...prev, id]);
      setCheckPoint(false);
    }
  };

  const handleSubmit = async () => {
    const enterPointForAllQues = quesPoint.length === prevDataOfExam.listQuestion.length;
    if (enterPointForAllQues) {
      try {
        const body = {
          title: prevDataOfExam.title,
          maxMarks: totalPoints,
          categoryId: prevDataOfExam.categoryId,
          description: prevDataOfExam.description,
          durationMinutes: prevDataOfExam.durationMinutes,
          listQuestion: quesPoint.map((q) => ({
            questionId: q.id,
            marksOfQuestion: q.point || 0,
          })),
        };
        console.log('body', body);
        const response = await createExam(body);

        if (response) {
          addNewExam(response);
          toast.success('Tạo mới bài tập thành công', { toastId: 'create_exam' });
          navigate('/admin/exam');
        }
      } catch (error) {
        toast.error(error.message, { toastId: 'data_exam' });
      }
    } else {
      toast.error('Hãy nhập điểm phù hợp cho mỗi câu hỏi!', {
        toastId: 'enter_point_for_all_question',
      });
    }
  };

  return (
    <div className="w-full rounded-md px-3 py-4 bg-slate-50">
      <h3 className="text-lg font-semibold">Tạo bài tập</h3>
      <div className="mt-3">
        {dataExam.length > 0 &&
          dataExam.map((item, index) => (
            <div key={index + 1}>
              <div className="flex">
                <p className="font-bold mr-2">Mã đề: </p>
                <p>{index + 1}</p>
              </div>

              <div className="mt-3 font-semibold grid grid-cols-4">
                <div className="col-span-2">
                  <p>Tiêu đề: {item.title}</p>
                  <p className="mt-3">Mô tả: {item.description}</p>
                </div>
                <div className="col-span-2">
                  <p>Thời gian kiểm tra: {item.durationMinutes} phút</p>
                  <p className="mt-3">Điểm của bài tập: {totalPoints || 0} điểm</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 bg-slate-300 text-gray-800 rounded-md justify-between hover:bg-slate-100">
                <div className="col-span-5  rounded-md px-4 py-3">
                  <div className="grid grid-cols-4">
                    <div className="col-span-1">Mã câu </div>
                    <div className="col-span-2">Nội dung </div>
                    <div className="col-span-1">Phân loại </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center">Nhập điểm</div>
              </div>
              {item.listQuestion.map((ques) => (
                <div key={ques.id} className=" grid grid-cols-7 bg-white hover:bg-slate-100">
                  <div className="col-span-5  rounded-md px-4 py-3">
                    <div className="grid grid-cols-4">
                      <div className="col-span-1">{ques.id} </div>
                      <div className="col-span-2"> {compiledConvert(ques.content)} </div>

                      <div className="col-span-1">{ques.questionType.displayName} </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <input
                      min="1"
                      max="10"
                      onClick={handlePoint}
                      onChange={(e) => handlePointsChange(ques.id, e)}
                      className="h-[40px] w-[60px] border-2 shadow-lg rounded-md"
                      type="number"
                      name="point"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disable={!checkPoint}
            className={classNames('px-6 py-2 text-sm text-white bg-primary ', {
              'cursor-not-allowed bg-primary/80': !checkPoint,
              'shadow-success hover:shadow-success_hover': checkPoint,
            })}
          >
            Tạo bài tập
          </Button>

          <Link
            to="/admin/exam"
            className="px-6 ml-5 py-2 text-sm rounded-md !border border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-5"
          >
            Thoát
          </Link>
        </div>
      </div>
    </div>
  );
}
