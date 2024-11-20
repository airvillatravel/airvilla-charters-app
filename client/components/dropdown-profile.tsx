import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import UserAvatar from "@/public/images/user-avatar-32.png";
import { fetchLogout } from "@/lib/data/authData";
import { logoutUser, selectUser } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActionMsg, setMsg } from "@/redux/features/ActionMsgSlice";
import { useRouter } from "next/navigation";
import { selectIsLoading, setLoading } from "@/redux/features/LoadingSlice";
import avatarPlaceholder from "@/public/images/placeholders/profile-placeholder.jpg";

export default function DropdownProfile({
  align,
}: {
  align?: "left" | "right";
}) {
  const dispatch = useAppDispatch();
  const user: any = useAppSelector(selectUser);
  const router = useRouter();

  // handle logout function
  const handleLogout = async () => {
    dispatch(setLoading(true));
    // clean all cookies
    const logout = await fetchLogout();

    // remove all cookies & set isLogin to false
    if (logout?.success) dispatch(logoutUser());

    // send a success msg
    if (logout?.success) {
      // redirect to login page
      router.push("/signin");
    }

    dispatch(setMsg({ success: logout.success, message: logout.message }));

    dispatch(setLoading(false));
  };

  return (
    <Menu as="div" className="relative inline-flex">
      <Menu.Button className="inline-flex justify-center items-center group">
        <Image
          className="w-8 h-8 rounded-full border border-slate-300"
          src={user.avatar ? user.avatar : avatarPlaceholder}
          width={32}
          height={32}
          alt="User"
        />
        {user && user.isLogin ? (
          <div className="flex items-center truncate">
            <span className="truncate ml-2 text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">
              {user?.firstName}
            </span>
            <svg
              className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
              viewBox="0 0 12 12"
            >
              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
            </svg>
          </div>
        ) : (
          <Link
            className="btn bg-red-500 hover:bg-red-600 text-white ml-3"
            type="submit"
            href="/signin"
          >
            Sign In
          </Link>
        )}
      </Menu.Button>
      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-slate-700">
          <div className="font-medium text-slate-800 dark:text-slate-100">
            {user?.firstName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 italic capitalize">
            {user.role}
          </div>
        </div>
        <Menu.Items as="ul" className="focus:outline-none">
          <Menu.Item as="li">
            {({ active }) => (
              <Link
                className={`font-medium text-sm flex items-center py-1 px-3 ${
                  active ? "text-red-600 dark:text-red-400" : "text-red-500"
                }`}
                href="/settings/account"
              >
                Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item as="li">
            {({ active }) => (
              <button
                className={`font-medium text-sm flex items-center py-1 px-3 ${
                  active ? "text-red-600 dark:text-red-400" : "text-red-500"
                }`}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
