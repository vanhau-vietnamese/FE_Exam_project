import moment from 'moment';
import Icons from '~/assets/icons';
import { Button, EditorViewer, TextView } from '~/components';
import { useQuestionStore } from '~/store';
import { getExcelColName } from '~/utils';

export default function ViewDetailQuestion() {
  const { targetQuestion, setTargetQuestion, openModal } = useQuestionStore((state) => state);

  return (
    <div className="w-full h-full mx-auto max-w-5xl p-10 animate-fade-down animate-duration-500">
      <form className="w-full h-full bg-white rounded-lg flex flex-col justify-between">
        <div className="text-gray-700 p-4 border-b border-dashed border-strike">
          <h3>Chi tiết câu hỏi</h3>
        </div>
        <div className="flex-1 max-h-[700px] overflow-y-auto px-4">
          <div className="flex items-center justify-between w-full gap-x-5 mb-5">
            <div className="w-full flex flex-col gap-y-2">
              <TextView value={targetQuestion.id} label="Mã câu hỏi" />
              <TextView
                value={targetQuestion.questionType.displayName || '--'}
                label="Loại câu hỏi"
              />
            </div>
            <div className="w-full flex flex-col gap-y-2">
              <TextView
                value={moment(targetQuestion.createdAt).format('DD/MM/YYYY - HH:mm A')}
                label="Ngày tạo"
              />

              <TextView value={targetQuestion.category?.title || '--'} label="Danh mục" />
            </div>
          </div>
          <div>
            <div className="border border-strike rounded-md">
              <div className="flex items-center gap-x-2 p-2 bg-slate-200 rounded-md rounded-ee-none rounded-es-none text-info">
                <Icons.Exclamation />
                <p className="font-bold text-text text-base">Nội dung câu hỏi</p>
              </div>
              <div className="pl-1 pt-1">
                <EditorViewer content={targetQuestion.content} />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center w-full justify-between mb-2">
              <label className="block text-sm font-semibold text-text">Đáp án câu hỏi</label>
            </div>
            <div>
              <div className="flex flex-col gap-y-4">
                {targetQuestion.answers.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={`flex items-center border ${
                      answer.correct
                        ? 'border-secondary bg-primary bg-opacity-10'
                        : 'border-strike bg-slate-100'
                    } rounded-md p-2`}
                  >
                    <p className="flex-1 text-text">
                      <span className="font-bold">{`${getExcelColName(index + 1)}. `}</span>
                      <span>{answer.content}</span>
                    </p>
                    {answer.correct && (
                      <span
                        className={`text-white bg-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0`}
                      >
                        <Icons.Check />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end px-4 py-3 gap-x-5 border-t border-dashed border-strike">
          <Button
            type="button"
            className="px-6 py-2 text-sm border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-10"
            onClick={() => {
              setTargetQuestion(null);
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
