import classNames from 'classnames';
import { compile } from 'html-to-text';
import { useMemo } from 'react';
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
  const dataExam = data?.state.examData;
  console.log(dataExam, 'dataExam');

  // const [totalPoints, setTotalPoints] = useState(0);

  const [newDataExam, setNewDataExam] = useState(dataExam || []);

  // //tính điểm
  // useEffect(() => {
  //   const points = quesPoint
  //     .map((element) => parseInt(element.point))
  //     .reduce((acc, curr) => acc + curr, 0);
  //   setTotalPoints(points);
  // }, [quesPoint, setQuesPoint]);

  const handlePoint = (e) => {
    e.stopPropagation();
  };

  const handlePointsChange = (index, e) => {
    const marksOfQuestion = Number(e.target.value);

    if (Number.isInteger(marksOfQuestion) && marksOfQuestion > 0) {
      setNewDataExam((preDataExam) => {
        const _preDataExam = JSON.parse(JSON.stringify(preDataExam));
        const _listQuestion = _preDataExam?.listQuestion;
        _listQuestion[index] = {
          ..._listQuestion[index],
          marksOfQuestion: marksOfQuestion,
        };
        return {
          ..._preDataExam,
          listQuestion: _listQuestion,
        };
      });
    } else {
      toast.error('Hãy nhập điểm là số nguyên dương!', {
        toastId: 'please_enter_point_is_integer',
      });
    }
  };

  const _totalPoints = useMemo(() => {
    const res = newDataExam?.listQuestion?.reduce((pre, cur) => {
      return pre + cur?.marksOfQuestion || 0;
    }, 0);

    return res;
  }, [newDataExam?.listQuestion]);

  const _enterPointForAllQues = useMemo(() => {
    const check = newDataExam?.listQuestion?.every((cur) => {
      return cur?.marksOfQuestion ?? 0 > 0;
    });

    return check ?? false;
  }, [newDataExam?.listQuestion]);

  const handleSubmit = async () => {
    if (_enterPointForAllQues) {
      try {
        const body = {
          title: newDataExam.title,
          maxMarks: _totalPoints,
          categoryId: Number(newDataExam.categoryId),
          description: newDataExam.description,
          durationMinutes: newDataExam.durationMinutes,
          questions: newDataExam?.listQuestion,
        };
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
        <div>
          {/* <div className="flex">
            <p className="font-bold mr-2">Mã đề: </p>
            <p></p>
          </div> */}

          <div className="mt-3 font-semibold grid grid-cols-4">
            <div className="col-span-2">
              <p>Tiêu đề: {newDataExam?.title}</p>
              <p className="mt-3">Mô tả: {newDataExam?.description}</p>
            </div>
            <div className="col-span-2">
              <p>Thời gian kiểm tra: {newDataExam?.durationMinutes} phút</p>
              <p className="mt-3">Điểm của bài tập: {_totalPoints || 0} điểm</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 bg-slate-300 text-gray-800 rounded-md justify-between hover:bg-slate-100">
            <div className="col-span-5  rounded-md px-4 py-3">
              <div className="grid grid-cols-4">
                <div className="col-span-1">STT</div>
                <div className="col-span-2">Nội dung </div>
                {/* <div className="col-span-1">Phân loại </div> */}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center">Nhập điểm</div>
          </div>
          {newDataExam?.listQuestion?.map((ques, index) => (
            <div key={ques?.id} className=" grid grid-cols-7 bg-white hover:bg-slate-100">
              <div className="col-span-5  rounded-md px-4 py-3">
                <div className="grid grid-cols-4">
                  <div className="col-span-1">{index} </div>
                  <div className="col-span-2"> {compiledConvert(ques?.content)} </div>

                  {/* <div className="col-span-1">{ques.questionType.displayName} </div> */}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <input
                  min="1"
                  max="10"
                  onClick={handlePoint}
                  onChange={(e) => handlePointsChange(index, e)}
                  className="h-[40px] w-[60px] border-2 shadow-lg rounded-md"
                  type="number"
                  name="point"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disable={!_enterPointForAllQues}
            className={classNames('px-6 py-2 text-sm text-white bg-primary ', {
              'cursor-not-allowed bg-primary/80': !_enterPointForAllQues,
              'shadow-success hover:shadow-success_hover': _enterPointForAllQues,
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
