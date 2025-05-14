import { useEffect, useState } from 'react';
import Icons from '~/assets/icons';
import images from '~/assets/images';
import { Button } from '~/components';
import { useUserStore } from '~/store';
import UserMenu from './UserMenu';
import { useLocation } from 'react-router-dom';

const RoleName = {
  ['admin']: 'Quản lý',
  ['student']: 'Học viên',
};

function Header() {
  const user = useUserStore((state) => state.user);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation()?.pathname || window.location.pathname;

  useEffect(() => {
    setOpenMenu(false);
  }, [location]);

  return (
    <div className="fixed w-[calc(100%-250px)] h-[64px] flex items-center py-1 backdrop-blur-[6px] ml-[250px] bg-white  z-50 border-b border-dashed border-slate-300">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-4 text-icon">{/* Add on more feature */}</div>
        <div className="px-3 py-1 ml-3 rounded flex items-center gap-4 text-icon">
          <Icons.Notification />
          <div className="relative">
            <Button
              className={`flex items-center p-0 text-left cursor-pointer hover:text-primary border-none pl-4 pr-1 py-1 ${
                openMenu ? 'text-primary' : 'text-icon'
              } hover:bg-primary hover:text-primary hover:bg-opacity-10`}
              onClick={() => setOpenMenu(!openMenu)}
            >
              <div className="hidden pr-2 text-right md:flex flex-col justify-center h-full">
                <p className="font-bold text-sm">{user ? user.fullName : 'Unknown'}</p>
                <span className="font-semibold opacity-70 text-xs capitalize">
                  {user ? RoleName[user.role] : '--'}
                </span>
              </div>
              <div className="relative p-1 border border-primary rounded-full">
                <div className="rounded-xl overflow-hidden w-[24px] h-[24px] ">
                  <img src={user?.avatar || images.logo} alt="avatar" className="object-cover" />
                </div>
              </div>
            </Button>
            {openMenu && <UserMenu />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
