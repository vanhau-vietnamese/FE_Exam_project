import { FormSelect, Input } from '~/components';
import ExamStudent from './ExamStudent';
import Icons from '~/assets/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { filterQuizByCategory, getAllCategories, getExams, searchQuiz } from '~/apis';
import { toast } from 'react-toastify';
import { useExamStore } from '~/store';
import { useDebounce } from '~/hooks';

function StudentExcises() {
  const { examList, setExamList } = useExamStore((state) => {
    return state;
  });
  const [searchKeywords, setSearchKeywords] = useState('');
  const {control} = useForm();
  const debounceQuery = useDebounce(searchKeywords, 200);

  const handleInputChange = (e) => {
    setSearchKeywords(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const searchValue = await searchQuiz({ searchContent: debounceQuery });
      setExamList(searchValue || []);
    })();
  }, [debounceQuery]);

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

  const handleSelectCate = async (e) => {
    try {
      const filterQuizbyCate = await filterQuizByCategory(e);
      setExamList(filterQuizbyCate)
    } catch (error) {
      toast.error("Không lọc được dữ liệu", { toastId: 'fliter_quiz' });
    }
  };

  return (
    <div className='w-full'>
      <div className='flex w-full mb-5'>
        <div className='w-[20%]'>
          <div className='flex'>
          <FormSelect
            control={control}
            name="category"
            label='Danh mục'
            options={categories}
            onChange={handleSelectCate}
            />
          </div>
          
          </div>
          <div className='w-[40%]'>
          <Input
            icon={<Icons.Search />}
            placeholder="Tìm kiếm theo tên bài tập"
            value={searchKeywords}
            onChange={handleInputChange}
            className='mt-5 ml-[100%]'
          />
          </div>
        </div>
      <ExamStudent list={examList}/>
    </div>
  );
}

export default StudentExcises;
