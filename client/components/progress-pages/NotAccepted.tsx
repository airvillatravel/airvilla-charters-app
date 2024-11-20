"use client";
import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProgressLoading from "@/components/utils/ProgressLoading";
import OnboardingProgress from "../extra-components/OnboardingProgress";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import AccountAcceptorListener from "./AccountAcceptorListener";

const AccountPendingApprovalPage = () => {
  const user = useAppSelector(selectUser);
  const [timeLeft, setTimeLeft] = useState(0);
  const userInfo = user as StoredUser;
  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdAt = new Date(userInfo.updatedAt);
      const twoDaysLater = new Date(
        createdAt.getTime() + 2 * 24 * 60 * 60 * 1000
      );
      const now = new Date();
      const difference = twoDaysLater.getTime() - now.getTime();
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [userInfo.updatedAt]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-3 py-12 md:px-12 w-full max-w-4xl min-h-[716px]">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            Almost There!
          </h1>
          <p className="dark:text-gray-400 text-sm">
            Your account is pending approval
          </p>
        </header>

        <OnboardingProgress step={4} />

        <main className="text-center my-8">
          <Clock
            className="text-red-500 w-16 h-16 mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="text-white text-xl font-semibold mb-2">
            Account Pending Approval
          </h2>
          <p className="dark:text-gray-300 mb-4">
            We're reviewing your account application.
          </p>

          <div
            className="mt-4 p-6 rounded-lg bg-gray-300 dark:bg-gray-700 bg-opacity-50 border border-red-500"
            role="alert"
          >
            <div className="mb-4">
              <h3 className="text-red-500 font-semibold text-lg mb-2">
                What's Next?
              </h3>
              <p className="dark:text-gray-300">
                Our team is carefully reviewing your application. This process
                typically takes 1-2 business days.
              </p>
            </div>
            <div className="flex items-center justify-center text-sm">
              <CheckCircle
                className="mr-2 text-red-500"
                size={18}
                aria-hidden="true"
              />
              <span className="dark:text-gray-300">
                We'll notify you via email once your account is approved.
              </span>
            </div>
          </div>
        </main>

        <div className="mb-6 flex items-center justify-between">
          <button
            className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex-grow mr-4 flex items-center justify-center opacity-50 cursor-not-allowed"
            disabled
          >
            <span className="flex items-center">
              <Clock className="mr-2" size={18} aria-hidden="true" />
              Waiting for Approval
            </span>
          </button>
          <div className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center">
            <Clock className="mr-2" size={18} aria-hidden="true" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <footer className="text-center">
          <p className="dark:text-gray-400 text-sm flex items-center justify-center">
            <AlertCircle className="mr-2" size={16} aria-hidden="true" />
            Need help?{" "}
            <a href="#" className="text-red-500 hover:text-red-400 ml-1">
              Contact our support team
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default function NotAccpeted() {
  const user = useAppSelector(selectUser);
  const router = useRouter();

  //   ############# STATES ##############
  const [loading, setLoading] = useState<boolean>(true);

  //   ############## useEffect ##########
  // Redirect to homepage if already logged in
  useEffect(() => {
    if (!user.isLogin) {
      router.push("/signin");
      return;
    }

    if (!(user as StoredUser).verified) {
      router.push("/signup-process/not-verified");
      return;
    }

    if ((user as StoredUser).accountStatus === "accepted") {
      router.push("/");
    }

    setLoading(false);
  }, [user, router]);

  // ############# RETURNS #################
  if (loading) {
    return <ProgressLoading />;
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      {/* MAIN */}
      <AccountAcceptorListener />
      <AccountPendingApprovalPage />
    </div>
  );
}
