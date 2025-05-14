import { Link, NavLink } from 'react-router-dom';
import images from '~/assets/images';
import router, { AdminNavLinks, StudentNavLinks } from '~/routes/const';
import { useUserStore } from '~/store';

const RoleRouterLink = {
  admin: {
    root: router.admin,
    navLinks: AdminNavLinks,
  },
  student: {
    root: router.student,
    navLinks: StudentNavLinks,
  },
};

function Sidebar() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="fixed left-0 flex flex-col h-full w-[250px] z-50 border-r border-dashed border-slate-300 bg-white">
      <div className="relative flex items-center justify-between px-6 py-0 mb-3 min-h-16 border-b border-dashed border-strike">
        <Link to={RoleRouterLink[user?.role]?.root || '#'} className="flex items-end gap-x-2">
          <div className="flex items-center w-10 h-10 rounded-full">
            <img src={images.logo} alt="logo" className="object-cover w-full h-full" />
          </div>
          <div className="transition-all leading-0">
            <b className="text-lg font-bold text-icon">Objective Quiz</b>
          </div>
        </Link>
      </div>
      <div className="h-full overflow-x-visible overflow-y-auto">
        <div className="relative h-full overflow-hidden">
          <div className="flex flex-col ">
            {RoleRouterLink[user?.role]?.navLinks &&
              RoleRouterLink[user?.role]?.navLinks.map((item, index) => (
                <div key={index} className="px-3 mb-1">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 rounded gap-x-2 h-[44px] text-[15px] transition-all text-icon ${
                        isActive ? 'bg-primary text-primary bg-opacity-20' : 'bg-transparent'
                      } hover:bg-primary text-sm hover:bg-opacity-20 hover:text-emerald-500`
                    }
                  >
                    <span className="w-[28px] h-[28px] flex items-center justify-center text-[1.495rem]">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
