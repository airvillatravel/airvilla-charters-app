"use client";
import useLayoutSignupProcess from "@/components/hooks/layout/useLayoutSignupProcess";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { logoutUser } from "@/redux/features/AuthSlice";
import { useAppDispatch } from "@/redux/hooks";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// const socket = io(process.env.SERVER_URL as string);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, handleLogout } = useLayoutSignupProcess();

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <div className="bg-gray-900">
      <div className="fixed bottom-5 right-5">
        <div
          className="text-slate-400 hover:text-gray-300 text-xl px-4 py-2 rounded-lg cursor-pointer "
          onClick={() => handleLogout()}
        >
          Logout
          <LogOut className="inline-block ml-2" size={20} />
        </div>
      </div>

      {children}
    </div>
  );
}
