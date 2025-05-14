import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Bookmark from '~/assets/icons/Bookmark';
import { compile } from 'html-to-text';
import moment from 'moment';

export default function ExamStudent({ list }) {
  const compiledConvert = compile({
    limits: {
      ellipsis: ' ...',
    },
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <div className="pb-4 bg-white rounded-md">
        <div className=" overflow-y-auto flex flex-wrap">
          {list.map((exam) => (
            <div key={exam.id}>
              <div className=" border-2 h-[160px] w-[280px] items-center justify-between p-2 m-3 rounded-lg shadow-md bg-slate-50 hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="text-sm rounded text-yellow-500">
                    <Bookmark />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold whitespace-nowrap">
                      {compiledConvert(exam.title)}
                    </h3>
                    <p className="text-[12px]">{exam.category.title}</p>

                    <p className="mt-2 text-[14px]">
                      Ngày tạo: {moment(exam.createdAt).format('DD/MM/YYYY, HH:mm')}
                    </p>
                    <p className="text-[14px] flex">Thời gian: {exam.durationMinutes} phút</p>
                    <p className="text-[14px] flex">Điểm: {exam.maxMarks}</p>
                    <Link
                      to={`startQuiz/${exam.id}`}
                      className="px-6 py-1 text-sm text-white bg-primary shadow-success hover:shadow-success_hover rounded-md"
                    >
                      Làm bài
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ExamStudent.propTypes = {
  list: PropTypes.array,
};
