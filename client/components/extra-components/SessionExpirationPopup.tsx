"use client";
import React from "react";
import { AlertTriangle, RefreshCw, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/AuthSlice";

export default function SessionExpirationPopup({
  isOpen,
}: {
  isOpen: boolean;
}) {
  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();

  // if not open return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black  flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-center dark:text-white mb-4">
            Session Expired
          </h3>
          <p className="dark:text-gray-300 text-center mb-6">
            Your session has expired due to inactivity. Please refresh the page
            or log in again to continue.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
            <button
              type="button"
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }
              }
              className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh Page
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(logoutUser());
                router.push("/signin");
              }}
              className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <LogIn size={18} className="mr-2" />
              Log In Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
