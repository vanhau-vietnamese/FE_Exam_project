import { useParams } from 'react-router-dom';
import { useFetchHistoryDetail } from '~/apis';
import { Backdrop, Loading } from '~/components';

const ShowDetailHistory = () => {
  const { id } = useParams();
  const { data = {}, isLoading } = useFetchHistoryDetail(id);
  console.log(data?.listQuestions, 'shvhshvhs');
  if (isLoading) {
    return (
      <Backdrop opacity={0}>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Loading />
          <h4 className="font-semibold text-center text-icon mt-4">
            Hệ thống đang xử lý,{' '}
            <span className="font-semibold text-icon">Xin vui lòng chờ trong giây lát!</span>
          </h4>
        </div>
      </Backdrop>
    );
  }
  return (
    <>
      <div className="w-full">
        <>
          {data?.listQuestions?.map((item, index) => (
            <div
              key={item.id}
              className="text-sm container mx-auto p-2 bg-slate-50 shadow-md rounded-md w-full mb-3 hover:scale-105 transition-transform duration-300"
            >
              <div key={item.id}>
                <div className="flex">
                  <div className="w-[100%] px-mb-10 py-3">
                    <div className="flex">
                      <div className="font-bold mr-2">{index + 1}-- Câu hỏi: </div>
                      <div
                        className="text-lg font-bold mb-7"
                        dangerouslySetInnerHTML={{ __html: item?.question?.content }}
                      />
                    </div>
                    {!item?.reason && (
                      <div>
                        <div>Bạn đã trả lời đúng câu hỏi này </div>
                      </div>
                    )}
                    {item?.reason && (
                      <div>
                        <div className="flex">
                          <div className="font-bold mr-2">Lí do sai: </div>
                          <div>{item?.reason}</div>
                        </div>
                        <div className="flex">
                          <div className="font-bold mr-2">Giải pháp:</div>
                          <div>{item?.solution}</div>
                        </div>
                        <div className="flex">
                          <div className="font-bold mr-2">Gợi ý:</div>
                          <div>{item?.suggestion}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export default ShowDetailHistory;
