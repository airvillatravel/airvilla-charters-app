"use client";
import React, { useState, useEffect } from "react";
import { UserCheck, Lock, Loader } from "lucide-react";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActionMsg, setMsg } from "@/redux/features/ActionMsgSlice";
import { selectUser } from "@/redux/features/AuthSlice";

const LoginProgressModal = ({
  onContinue,
  username,
}: {
  onContinue: () => void;
  username: string;
}) => {
  // State to keep track of the current login stage
  const [stage, setStage] = useState("logging-in");

  useEffect(() => {
    // Set timers to progress through the login stages
    const timer1 = setTimeout(() => setStage("security-check"), 3000);
    const timer2 = setTimeout(() => setStage("success"), 6000);

    // Cleanup function to clear timers if component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Function to render content based on the current stage
  const renderContent = () => {
    switch (stage) {
      case "logging-in":
        return (
          <>
            <Loader size={48} className="text-red-500 animate-spin" />
            <h3 className="text-xl font-bold text-center dark:text-white mt-4">
              Logging In
            </h3>
            <p className="dark:text-gray-300 text-center mt-2">
              Please wait...
            </p>
          </>
        );
      case "security-check":
        return (
          <>
            <Lock size={48} className="text-red-500 animate-pulse" />
            <h3 className="text-xl font-bold text-center dark:text-white mt-4">
              Security Check
            </h3>
            <p className="dark:text-gray-300 text-center mt-2">
              Performing security verifications...
            </p>
          </>
        );
      case "success":
        return (
          <>
            <UserCheck size={48} className="text-red-500" />
            <h3 className="text-2xl font-bold text-center dark:text-white mt-4">
              Login Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mt-2 mb-6">
              Welcome back, <span className=" font-bold">{username}</span>! You
              have successfully logged in to your account.
            </p>
            <div className="flex justify-center">
              <button
                onClick={onContinue}
                className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
              >
                <UserCheck size={18} className="mr-2" />
                Continue
              </button>
            </div>
          </>
        );
    }
  };

  // Render the modal
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-lg">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginLoadingProgress() {
  // hooks
  const dispatch = useAppDispatch();

  // redux
  const user = useAppSelector(selectUser);
  const action = useAppSelector(selectActionMsg);

  // states
  const [isVisible, setIsVisible] = useState(true);

  const handleContinue = () => {
    setIsVisible(false);
    dispatch(setMsg({ success: false, message: "" }));
  };

  if (action.message !== "login" || !isVisible) return null;

  const userInfo = user as StoredUser;
  return (
    <div className="bg-black min-h-screen">
      <LoginProgressModal
        onContinue={handleContinue}
        username={`${userInfo.firstName} ${userInfo.lastName}`} // Example username
      />
    </div>
  );
}
