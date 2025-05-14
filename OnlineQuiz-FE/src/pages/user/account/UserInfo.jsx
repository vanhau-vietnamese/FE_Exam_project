import { useUserStore } from "~/store";
import images from "~/assets/images";
import { default as Icons } from "~/assets/icons";

const RoleName = {
  ["admin"]: "Quản lý",
  ["student"]: "Học viên",
};

const UserInfo = () => {
  console.log("Loaded AccountInfo");

  const user = useUserStore((state) => state.user);

  return (
    <div className="h-screen w-full">
      <div className="mx-auto max-h-[80%] max-w-full rounded bg-white">
        <div className="justify-items-center space-y-6 py-8 text-base leading-7 text-gray-600">
          <div className="relative max-w-max">
            <div className="relative rounded-full border p-1 ring-4 ring-primary drop-shadow-lg">
              <div className="h-[48px] w-[48px] overflow-hidden rounded-xl p-2 md:h-[72px] md:w-[72px]">
                <img
                  src={user?.avatar || images.logo}
                  alt="avatar"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 max-w-min cursor-pointer rounded-full border-2 border-primary bg-white p-1 text-primary hover:bg-primary hover:text-white">
              <Icons.Pencil />
            </div>
          </div>

          <p className="text-center text-xl font-extrabold text-primary md:text-2xl">
            {user.fullName}
          </p>
          <div className="rounded bg-primary p-2 text-center font-bold text-white">
            {user ? RoleName[user.role] : "--"}
          </div>
          {/* <!-- Stats --> */}
          <div className="min-w-max divide-y divide-slate-200 px-4">
            <div className="grid w-full min-w-full max-w-max flex-wrap gap-4 overflow-hidden text-center font-semibold md:grid-flow-col md:grid-cols-2 md:place-content-around md:py-4">
              <div className="min-w-min justify-items-center space-y-2 rounded border-2 border-solid border-primary bg-white p-3">
                <p className="truncate">Số bài tập đã hoàn thành</p>
                <p className="text-xl font-bold md:text-2xl">
                  {user.numberOfCompleted ?? 0}
                </p>
              </div>
              <div className="min-w-min justify-items-center space-y-2 rounded border-2 border-solid border-primary bg-white p-3">
                <p className="truncate">Số bài đăng</p>
                <p className="text-xl font-bold md:text-2xl">
                  {user.numberOfPost ?? 0}
                </p>
              </div>
            </div>
            {/* <!-- Other info --> */}
            <div className="min-w-full py-4">
              <div className="grid w-full grid-flow-col flex-wrap gap-2 p-4 md:grid-cols-2 md:gap-4">
                <div className="font-semibold">Email</div>
                <div className="truncate">{user?.email ?? "---"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
