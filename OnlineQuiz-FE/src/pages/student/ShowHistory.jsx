import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteHistory, getHistory, searchHistory } from '~/apis';
import Icons from '~/assets/icons';
import { Button, Input } from '~/components';
import { useDebounce } from '~/hooks';

export default function ShowHistory() {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [history, setHistory] = useState([]);
  const debounceQuery = useDebounce(searchKeywords, 200);

  useEffect(() => {
    (async () => {
      const listHistory = await getHistory();
      setHistory(listHistory);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const searchValue = await searchHistory({ searchContent: debounceQuery });
      setHistory(searchValue || []);
    })();
  }, [debounceQuery, history]);

  const handleInputChange = (e) => {
    setSearchKeywords(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const respone = await deleteHistory(id);
      console.log(respone);
      toast.success('Xóa thành công!', { toastId: 'delete_history' });
    } catch (error) {
      toast.error('Có lỗi xay ra!', { toastId: 'fail_delete_history' });
    }
  };

  return (
    <div className="w-full">
      <div className="w-[500px] mb-5">
        <Input
          icon={<Icons.Search />}
          placeholder="Tìm kiếm theo tên bài tập"
          value={searchKeywords}
          onChange={handleInputChange}
        />
      </div>
      {history.length === 0 ? (
        <div className=" bg-slate-50 rounded-sm h-[100%]">
          <div className="font-bold text-lg text-center pt-10"> Không có dữ liệu!</div>
        </div>
      ) : (
        <>
          {history.map((item) => (
            <div
              key={item.id}
              className="text-sm container mx-auto p-2 bg-slate-50 shadow-md rounded-md w-full mb-3 hover:scale-105 transition-transform duration-300"
            >
              <div key={item.id}>
                <div className="flex">
                  <div className="w-[75%] px-5 py-3">
                    <span className="text-lg font-semibold">
                      Bài tập: {item.quiz.tittle} - {moment(item.startTime).format('DD/MM/YYYY')}
                    </span>
                    <div>
                      <div className="flex">
                        <div className="font-bold">Bắt đầu làm bài: </div>{' '}
                        {moment(item.startTime).format(' HH:mm')} -{' '}
                        <div className="font-bold"> Nộp bài: </div>{' '}
                        {moment(item.submitTime).format('HH:mm')}
                      </div>
                      <div>Tổng thời gian: {item.durationTime} </div>
                      <div>Số câu đúng: {item.numberOfCorrect} câu</div>
                      <div>Số câu sai: {item.numberOfIncorrect} câu</div>
                    </div>
                  </div>
                  <div className="w-[25%] border-2 rounded-md p-3 right-0">
                    <h1 className="mb-5 text-center">
                      Điểm: {item.marks}/{item.quiz.maxMarks}{' '}
                    </h1>
                    <div className="bg-primary rounded-md p-2 font-bold text-white text-center">
                      <Link to={`startQuiz/${item.quiz.id}`}>Làm bài lại</Link>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="ml-3 text-xs rounded px-2 py-1 text-red-500 hover:bg-red-200 hover:bg-opacity-40"
                  >
                    <Icons.Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
