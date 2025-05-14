import moment from 'moment';
import { useState } from 'react';
import Icons from '~/assets/icons';
import { Button, Loading } from '~/components';

export default function Trainee() {
  const [trainees] = useState([]);
  const [loading] = useState(false);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-end mb-4">
        <Button className="flex items-center gap-x-2 px-4 py-2 text-white bg-primary shadow-success hover:shadow-success_hover">
          <Icons.Plus />
          <p>Đăng ký mới</p>
        </Button>
      </div>
      <table className="block w-full text-sm text-left rtl:text-right border-collapse">
        <thead className="text-[#3b3e66] uppercase text-xs block w-full">
          <tr className="bg-[#d1d2de] rounded-ss rounded-se w-full flex items-center">
            <th className="p-3 w-[5%] flex-shrink-0">STT</th>
            <th className="p-3 flex-shrink-0 w-[20%]">Họ và tên</th>
            <th className="p-3 flex-auto">Địa chỉ email</th>
            <th className="p-3 flex-shrink-0 w-[15%]">Thời gian</th>
            <th className="p-3 flex-shrink-0 w-[10%]">Hành động</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto block w-full h-[calc(100vh-12rem)] border-strike border rounded-es rounded-ee bg-white">
          {loading ? (
            <tr className="block w-full h-full">
              <td className="flex flex-col items-center justify-center w-full h-full">
                <Loading />
              </td>
            </tr>
          ) : trainees && trainees.length > 0 ? (
            trainees.map((account, index) => (
              <tr
                key={account.id}
                className="flex items-center border-b border-[#d1d2de] transition-all hover:bg-[#d1d2de] hover:bg-opacity-30 h-[45px] text-xs font-semibold text-[#3b3e66]"
              >
                <td className="p-3 w-[5%] flex-shrink-0">{index + 1}</td>
                <td className="p-3 flex-shrink-0 w-[20%] text-nowrap text-ellipsis overflow-hidden">
                  {account.fullName}
                </td>
                <td className="p-3 flex-auto text-nowrap text-ellipsis overflow-hidden">
                  {account.email}
                </td>
                <td className="p-3 overflow-hidden flex-shrink-0 w-[15%]">
                  {account.createdAt ? moment(account.createdAt).format('DD/MM/YYYY') : '--'}
                </td>
                <td className="p-3 flex-shrink-0 w-[10%] flex items-center">
                  {/* <Button
                  onClick={() => setDeletingId(account.id)}
                  className="text-xs border border-danger flex items-center gap-x-1 rounded px-2 py-1 text-danger hover:bg-red-200 hover:bg-opacity-40"
                >
                  <Icons.Trash />
                  <p className="font-semibold">Xóa</p>
                </Button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr className="block w-full h-full">
              <td className="flex flex-col items-center justify-center gap-y-5 w-full h-full p-5 text-slate-400 font-semibold text-lg">
                <Icons.Empty />
                <span>Không có dữ liệu</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
