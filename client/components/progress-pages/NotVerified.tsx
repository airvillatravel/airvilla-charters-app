"use client";
import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import { AuthResTypes, StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { fetchSendEmailVerification } from "@/lib/data/authData";
import ProgressLoading from "@/components/utils/ProgressLoading";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Link,
  LogIn,
  Mail,
} from "lucide-react";
import OnboardingProgress from "../extra-components/OnboardingProgress";

const NotVerifiedSection = () => {
  const user = useAppSelector(selectUser);
  const userInfo = user as StoredUser;
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isExpired, setIsExpired] = useState(true);
  const [expiryCountdown, setExpiryCountdown] = useState(() => {
    const storedExpiry = localStorage.getItem("verificationExpiry");
    if (storedExpiry) {
      const remainingTime = Math.max(
        0,
        Math.floor((parseInt(storedExpiry) - Date.now()) / 1000)
      );
      setIsExpired(false);
      return remainingTime > 0 ? remainingTime : 10 * 60;
    }
    return 10 * 60;
  });

  useEffect(() => {
    let resendTimer: string | number | NodeJS.Timeout | undefined,
      expiryTimer: string | number | NodeJS.Timeout | undefined;

    if (resendCountdown > 0) {
      resendTimer = setInterval(() => {
        setResendCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }

    if (expiryCountdown > 0) {
      expiryTimer = setInterval(() => {
        setExpiryCountdown((prevCount) => {
          if (prevCount <= 1) {
            setIsExpired(true);
            localStorage.removeItem("verificationExpiry");
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(resendTimer);
      clearInterval(expiryTimer);
    };
  }, [resendCountdown, expiryCountdown]);

  const handleResendEmail = async () => {
    // send email request
    const sendEmail = await fetchSendEmailVerification();

    if (sendEmail?.success) {
      setIsResending(true);
      setTimeout(() => {
        setIsResending(false);
        setResendCountdown(60);
        setExpiryCountdown(10 * 60);
        setIsExpired(false);
      }, 2000);

      // Set the expiry time in localStorage
      const expiryTime = Date.now() + expiryCountdown * 1000;
      localStorage.setItem("verificationExpiry", expiryTime.toString());
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-3 py-12 md:px-12 w-full max-w-4xl min-h-[716px]">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-1 dark:text-white">
            Almost There!
          </h1>
          <p className="dark:text-gray-300 text-sm">
            Your Gateway to Travel Success
          </p>
        </div>

        <>
          <OnboardingProgress step={3} />

          <main className="text-center my-8">
            <CheckCircle
              className="text-green-500 w-16 h-16 mx-auto mb-4"
              aria-hidden="true"
            />
            <h2 className="dark:text-white text-xl font-semibold mb-2">
              Verify Your Email
            </h2>
            <p className="dark:text-gray-300 mb-4">
              We've sent a verification link to:
            </p>
            <p className="text-red-500 font-semibold mb-4 text-lg">
              {userInfo?.email}
            </p>

            <div
              className={`mt-4 p-6 rounded-lg ${
                isExpired
                  ? " dark:bg-red-900 bg-opacity-50 border-red-700"
                  : "bg-gray-300 dark:bg-gray-700 bg-opacity-50 border-gray-600"
              } border`}
              role="alert"
            >
              <div className="mb-4">
                <h3 className="text-red-500 font-semibold text-lg mb-2">
                  Action Required
                </h3>
                <p className="dark:text-gray-300">
                  Click the link in the email to confirm your account and start
                  your journey!
                </p>
              </div>
              <div className="flex items-center justify-center text-sm">
                <Clock
                  className="mr-2 text-gray-400"
                  size={18}
                  aria-hidden="true"
                />
                <span
                  className={isExpired ? "text-red-400" : "dark:text-gray-300"}
                >
                  {isExpired
                    ? "Verification link has expired. Please request a new one."
                    : `Link expires in: ${formatTime(expiryCountdown)}`}
                </span>
              </div>
            </div>
          </main>

          <div className="mb-6">
            <button
              onClick={handleResendEmail}
              disabled={isResending || resendCountdown > 0}
              aria-live="polite"
              className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 w-full flex items-center justify-center ${
                isResending || resendCountdown > 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isResending ? (
                <span className="flex items-center">
                  <Mail
                    className="animate-spin mr-2"
                    size={18}
                    aria-hidden="true"
                  />
                  Sending verification email...
                </span>
              ) : resendCountdown > 0 ? (
                <span className="flex items-center">
                  <Mail className="mr-2" size={18} aria-hidden="true" />
                  Request new link in {resendCountdown}s
                </span>
              ) : (
                <span className="flex items-center">
                  <Mail className="mr-2" size={18} aria-hidden="true" />
                  Resend Verification Email
                </span>
              )}
            </button>
          </div>

          <footer className="text-center">
            <p className="dark:text-gray-400 text-sm flex items-center justify-center">
              <AlertCircle className="mr-2" size={16} aria-hidden="true" />
              Didn't receive the email? Check your spam folder or contact our
              support team for assistance.
            </p>
          </footer>
        </>
      </div>
    </main>
  );
};

export default function NotVerified() {
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

    if (
      (user as StoredUser).verified &&
      (user as StoredUser).accountStatus !== "accepted"
    ) {
      router.push("/signup-process/not-accepted");
      return;
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

      <NotVerifiedSection />
    </div>
  );
}
