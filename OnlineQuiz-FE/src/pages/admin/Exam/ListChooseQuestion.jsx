import { compile } from 'html-to-text';
import { useFormContext, useWatch } from 'react-hook-form';
import Icons from '~/assets/icons';
import { Backdrop, Button } from '~/components';
import { FormEditLocalQuestion } from '../Question/components';
import { useCallback, useState } from 'react';

const ListChooseQuestion = () => {
  const [dataEdit, setDataEdit] = useState({ item: null, index: -1 });
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

  console.log(listChooseQuestion, 'listChooseQuestionư');

  const cbFn = useCallback(
    (dataItem, index) => {
      let _listChooseQuestion = JSON.parse(JSON.stringify(listChooseQuestion));
      _listChooseQuestion[index] = dataItem;
      console.log(_listChooseQuestion, 'sjvsjvjsjvjs');
      methods.setValue('listChooseQuestion', [..._listChooseQuestion]);
    },
    [listChooseQuestion, methods]
  );

  return (
    <>
      <div className="bg-gray-400 w-full rounded-md mb-5">
        <div className="max-h-[500px] overflow-y-auto">
          <div className="w-full">
            <table className="block w-full text-sm text-left rtl:text-right border-collapse">
              <thead className="text-[#3b3e66] uppercase text-xs block w-full">
                <tr className="bg-[#d1d2de] rounded-se w-full flex items-center">
                  <th className="p-3 flex-auto w-[40%]">Nội dung câu hỏi</th>
                  <th className="p-3 flex-auto w-[10%]">Danh mục</th>
                  <th className="p-3 flex-auto w-[5%]"></th>
                  <th className="p-3 flex-auto w-[40%]">Lí do không hợp lệ</th>
                  <th className="p-3 flex-auto w-[5%]">Chỉnh sửa</th>
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
                      <td className="p-3 flex-shrink-0 w-[10%]">{item?.categoryTitle || '--'}</td>
                      <td className="p-3 flex-shrink-0 w-[5%]">
                        {item?.isChoose && (
                          <div className="text-white ml-5 bg-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <Icons.Check />
                          </div>
                        )}
                      </td>
                      <td className="p-3 flex-shrink-0 w-[40%]">{item?.reason ?? ''}</td>
                      <td className="p-3 flex-shrink-0 w-[5%]">
                        <Button
                          onClick={() => {
                            setDataEdit({ item, index });
                          }}
                          className="text-xs rounded px-2 py-1 text-blue-500 hover:bg-blue-200 hover:bg-opacity-40"
                        >
                          <Icons.Pencil />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {!!dataEdit?.item && (
        <Backdrop opacity={0.25}>
          <FormEditLocalQuestion cbFn={cbFn} dataEdit={dataEdit} setDataEdit={setDataEdit} />
        </Backdrop>
      )}
    </>
  );
};

export default ListChooseQuestion;
