import PropTypes from 'prop-types';
import { compile } from 'html-to-text';
import Icons from '~/assets/icons';
import { useFormContext, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '~/components';
export default function Question({ listQuestion, onCancel }) {
  const [listQ, setListQ] = useState(listQuestion || []);
  const compiledConvert = compile({
    limits: {
      ellipsis: ' ...',
    },
  });

  const methods = useFormContext();

  const [listChooseQuestion, examName] = useWatch({
    control: methods.control,
    name: ['listChooseQuestion', 'examName'],
  });

  console.log(listChooseQuestion, examName, 'listChooseQuestion');

  const handleSelect = (_item, index) => {
    const _listQ = [...listQ];
    _listQ[index] = { ..._item, isChoose: !_item?.isChoose };
    setListQ([..._listQ]);
  };

  return (
    <div className="mb-4 px-2">
      <div className="flex text-sm">
        <span className="text-sm font-semibold mb-2">Số câu đã chọn:</span>
      </div>
      <div className="bg-gray-400 w-full rounded-md">
        <div className="max-h-[500px] overflow-y-auto">
          <div className="w-full">
            <table className="block w-full text-sm text-left rtl:text-right border-collapse">
              <thead className="text-[#3b3e66] uppercase text-xs block w-full">
                <tr className="bg-[#d1d2de] rounded-se w-full flex items-center">
                  <th className="p-3 flex-auto w-[60%]">Nội dung câu hỏi</th>
                  <th className="p-3 flex-auto w-[30%]">Danh mục</th>
                  <th className="p-3 flex-auto w-[10%]"></th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto block w-full">
                {listQ.map((item, index) => {
                  return (
                    <tr
                      onClick={() => handleSelect(item, index)}
                      key={item.id}
                      className="flex bg-slate-50 items-center border-b border-[#d1d2de] hover:bg-slate-100 h-[45px] font-semibold text-[#3b3e66]"
                    >
                      <td className="p-3 flex flex-auto w-[60%]">
                        {index + 1}.{compiledConvert(item.content)}
                      </td>
                      <td className="p-3 flex-shrink-0 w-[30%]">{item.category?.title || '--'}</td>

                      <td className="p-3 flex-shrink-0 w-[10%]">
                        {item?.isChoose && (
                          <div className="text-white ml-5 bg-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <Icons.Check />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end px-4 py-3 gap-x-5 border-t border-dashed border-strike">
        <Button
          type="button"
          className="px-6 py-2 text-sm !border border-solid !border-danger text-danger hover:bg-danger hover:bg-opacity-5"
          onClick={onCancel}
        >
          Hủy bỏ
        </Button>
        <Button
          className="px-6 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
          onClick={() => {
            const _list = (listQ || []).map((x) => {
              return {
                content: x?.content ?? '',
                questionTypeId: x?.questionType?.alias,
                categoryId: x?.category?.id,
                categoryTitle: x?.category?.title,
                answerRequestList: x?.answers,
                isChoose: x?.isChoose,
                marksOfQuestion: 0,
              };
            });
            methods.setValue(
              'listChooseQuestion',
              (_list || []).filter((x) => x?.isChoose)
            );
            onCancel();
          }}
        >
          Tạo mới
        </Button>
      </div>
    </div>
  );
}
Question.propTypes = {
  onCancel: PropTypes.func,
  listQuestion: PropTypes.array,
};
