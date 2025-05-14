import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteAccountById, getAllAccounts } from '~/apis';
import Icons from '~/assets/icons';
import { Button, DialogComfirm, Loading } from '~/components';
import FormCreateAccoutAdmin from '../Category/components/FormCreateAccoutAdmin';

function Account() {
  const [deletingId, setDeletingId] = useState();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllAccounts();
        setAccounts(res);
      } catch (error) {
        toast.error('Không thể lấy danh sách tài khoản', { toastId: 'get_accounts' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRemoveAccount = async () => {
    try {
      await deleteAccountById(deletingId);
      setAccounts(accounts.filter((account) => account.id !== deletingId));
      toast.success('Xóa tài khoản thành công', { toastId: 'delete_account' });
    } catch (error) {
      toast.error('Không thể xóa tài khoản này', { toastId: 'delete_account' });
    } finally {
      setDeletingId(null);
    }
  };

  const newAccount = (result) => {
    setAccounts((a) => [...a, result]);
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-end mb-4">
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-x-2 px-4 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
        >
          <Icons.Plus />
          <p>Thêm mới</p>
        </Button>
      </div>

      <table className="block w-full text-sm text-left rtl:text-right border-collapse">
        <thead className="text-[#3b3e66] uppercase text-xs block w-full">
          <tr className="bg-[#d1d2de] rounded-ss rounded-se w-full flex items-center">
            <th className="p-3 w-[5%] flex-shrink-0">STT</th>
            <th className="p-3 flex-shrink-0 w-[20%]">Họ và tên</th>
            <th className="p-3 flex-auto">Địa chỉ email</th>
            <th className="p-3 flex-shrink-0 w-[15%]">Thời gian</th>
            <th className="p-3 flex-shrink-0 w-[15%]">Tạo bởi</th>
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
          ) : accounts && accounts.length > 0 ? (
            accounts.map((account, index) => (
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
                <td className="p-3 flex-shrink-0 w-[15%] text-nowrap text-ellipsis overflow-hidden">
                  {account.createBy || '--'}
                </td>
                <td className="p-3 flex-shrink-0 w-[10%] flex items-center">
                  <Button
                    onClick={() => setDeletingId(account.id)}
                    className="text-xs border border-danger flex items-center gap-x-1 rounded px-2 py-1 text-danger hover:bg-red-200 hover:bg-opacity-40"
                  >
                    <Icons.Trash />
                  </Button>
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
      {deletingId && (
        <DialogComfirm
          title="Xác nhận xóa"
          color="danger"
          icon={<Icons.Exclamation />}
          body="Bạn có chắc muốn xóa danh mục này không?"
          onCancel={() => setDeletingId(null)}
          onConfirm={async () => await handleRemoveAccount(deletingId)}
          className="md:max-w-[500px]"
        />
      )}
      {isCreating && (
        <FormCreateAccoutAdmin
          onCancel={() => setIsCreating(false)}
          onsubmit={newAccount}
          className="md:max-w-3xl "
        />
      )}
    </div>
  );
}

export default Account;
