import { compile } from 'html-to-text';
import { useFormContext, useWatch } from 'react-hook-form';
import Icons from '~/assets/icons';

const ListChooseQuestion = () => {
  const methods = useFormContext();
  const compiledConvert = compile({
    limits: {
      ellipsis: ' ...',
    },
  });

  const [listChooseQuestion] = useWatch({
    control: methods.control,
    name: ['listChooseQuestion'],
  });

  return (
    <div className="bg-gray-400 w-full rounded-md mb-5">
      <div className="max-h-[500px] overflow-y-auto">
        <div className="w-full">
          <table className="block w-full text-sm text-left rtl:text-right border-collapse">
            <thead className="text-[#3b3e66] uppercase text-xs block w-full">
              <tr className="bg-[#d1d2de] rounded-se w-full flex items-center">
                <th className="p-3 flex-auto w-[40%]">Nội dung câu hỏi</th>
                <th className="p-3 flex-auto w-[30%]">Danh mục</th>
                <th className="p-3 flex-auto w-[10%]"></th>
                <th className="p-3 flex-auto w-[20%]">Lí do không hợp lệ</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto block w-full">
              {listChooseQuestion.map((item, index) => {
                return (
                  <tr
                    key={item.id}
                    className="flex bg-slate-50 items-center border-b border-[#d1d2de] hover:bg-slate-100 h-[45px] font-semibold text-[#3b3e66]"
                  >
                    <td className="p-3 flex flex-auto w-[40%]">
                      {index + 1}.{compiledConvert(item?.content)}
                    </td>
                    <td className="p-3 flex-shrink-0 w-[20%]">{item?.categoryTitle || '--'}</td>
                    <td className="p-3 flex-shrink-0 w-[10%]">
                      {item?.isChoose && (
                        <div className="text-white ml-5 bg-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <Icons.Check />
                        </div>
                      )}
                    </td>
                    <td className="p-3 flex-shrink-0 w-[30%]">{item?.reason ?? ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListChooseQuestion;
