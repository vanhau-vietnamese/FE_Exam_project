import { useState } from 'react';
import Icons from '~/assets/icons';
import { Button, DialogComfirm } from '~/components';
import { useAuth } from '~/hooks';
import { useUserStore } from '~/store';
import ChangePassword from './ChangePassword';
import { router } from '~/routes';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  const { signOut } = useAuth();
  const [isLogout, setIsLogout] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  return (
    <>
      <div className="absolute z-50 top-full right-0 bg-slate-100 rounded-md w-full min-w-[200px] min-h-[80px] shadow-xl">
        <div className="flex flex-col p-2">
          <div className="flex flex-col justify-center mb-2 text-icon">
            <p className="font-semibold text-sm">{user ? user.fullName : 'Unknown'}</p>
            <span className="font-semibold opacity-70 text-xs">
              {user ? user.email : 'Unknown'}
            </span>
          </div>

          <div className="w-full border border-strike opacity-40"></div>
          <div>
            <Button
              className="flex w-full items-center p-2 hover:bg-info hover:text-info hover:bg-opacity-10 border-none text-sm"
              onClick={() => navigate(router.account)}
            >
              Xem thông tin tài khoản
            </Button>
          </div>
          <div className="flex flex-col mt-4">
            <Button
              className="flex w-full items-center gap-x-4 p-2 hover:bg-info hover:text-info hover:bg-opacity-10 border-none text-text"
              onClick={() => setIsChangePass(true)}
            >
              <Icons.Key />
              <span className="text-sm">Đổi mật khảu</span>
            </Button>
            <Button
              className="flex w-full items-center gap-x-4 p-2 hover:bg-danger hover:bg-opacity-10 border-none text-danger"
              onClick={() => setIsLogout(true)}
            >
              <Icons.LogOut />
              <span className="text-sm">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </div>
      {isLogout && (
        <DialogComfirm
          className="max-w-[550px]"
          color="danger"
          title="Đăng xuất"
          icon={<Icons.Exclamation />}
          body="Bạn có chắc chắn muốn đăng xuất?"
          onCancel={() => setIsLogout(false)}
          onConfirm={() => signOut()}
        />
      )}
      {isChangePass && <ChangePassword onCancel={() => setIsChangePass(false)} />}
    </>
  );
}

export default UserMenu;
