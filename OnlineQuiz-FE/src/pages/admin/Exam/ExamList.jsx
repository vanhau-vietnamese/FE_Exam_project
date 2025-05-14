import { Button, FormSelect, Input } from '~/components';
import { useState } from 'react';
import Icons from '~/assets/icons';
import { useExamStore } from '~/store';
import Bookmark from '~/assets/icons/Bookmark';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { compile } from 'html-to-text';
import { useForm } from 'react-hook-form';
import { useDebounce } from '~/hooks';
import { useEffect } from 'react';
import { filterQuizByCategory, getAllCategories, getExams, searchQuiz } from '~/apis';
import { toast } from 'react-toastify';

export default function ExamList() {
  const { examList, setExamList, setTargetExam, openModal } = useExamStore((state) => state);
  const { control } = useForm();

  const [searchKeywords, setSearchKeywords] = useState('');
  const debounceQuery = useDebounce(searchKeywords, 200);

  const compiledConvert = compile({
    limits: {
      ellipsis: ' ...',
    },
  });

  const handleInputChange = (e) => {
    setSearchKeywords(e.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        const listExam = await getExams();
        setExamList(listExam);
      } catch (error) {
        toast.error(error.message, { toastId: 'get_exam' });
      }
    })();
  }, [setExamList]);

  const [categories, setCategories] = useState([]);
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

  const handleOpenModal = ({ type, exam }) => {
    setTargetExam(exam);
    openModal(type);
  };

  useEffect(() => {
    (async () => {
      const searchValue = await searchQuiz({ searchContent: debounceQuery });
      setExamList(searchValue || []);
    })();
  }, [debounceQuery, setExamList]);

  const handleSelectCate = async (e) => {
    try {
      const filterQuizbyCate = await filterQuizByCategory(e);
      setExamList(filterQuizbyCate);
    } catch (error) {
      toast.error('Không có dữ liệu', { toastId: 'fliter_quiz' });
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-10">
        <div className="col-span-3 flex w-full">
          <FormSelect
            control={control}
            name="category"
            label="Danh sách danh mục"
            options={categories}
            onChange={handleSelectCate}
            className="w-[70%] px-3"
          />
        </div>
        <div className="col-span-5 px-3 mt-5">
          <Input
            icon={<Icons.Search />}
            placeholder="Tìm kiếm theo tên bài tập"
            value={searchKeywords}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 px-3 mt-6">
          <Link
            to="createExam"
            className="w-[80%] rounded-lg justify-center flex px-5 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
          >
            <Icons.Plus />
            Tạo bài tập
          </Link>
        </div>
      </div>

      <div className="pb-4 mt-3 bg-white rounded-md">
        <div className="h-full overflow-y-auto w-full flex flex-wrap">
          {examList.map((exam) => (
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
                      to={`checkpractice/${exam.id}`}
                      className="px-6 py-1 text-sm text-white bg-primary shadow-success hover:shadow-success_hover rounded-md"
                    >
                      Làm bài
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <Button
                  onClick={() => handleOpenModal({ type: 'view', exam })}
                  className="ml-16 text-xs rounded px-2 py-1 text-yellow-500 hover:bg-yellow-200 hover:bg-opacity-40"
                >
                  <Icons.Eye />
                </Button>
                <Button
                  onClick={() => handleOpenModal({ type: 'edit', exam })}
                  className="ml-3 text-xs rounded px-2 py-1 text-blue-500 hover:bg-blue-200 hover:bg-opacity-40"
                >
                  <Icons.Pencil />
                </Button>
                <Button
                  onClick={() => handleOpenModal({ type: 'delete', exam })}
                  className="ml-3 text-xs rounded px-2 py-1 text-red-500 hover:bg-red-200 hover:bg-opacity-40"
                >
                  <Icons.Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ExamList.propTypes = {
  category: PropTypes.array,
};
