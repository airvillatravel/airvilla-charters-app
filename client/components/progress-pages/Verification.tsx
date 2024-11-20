"use client";
import { loginUser, logoutUser, selectUser } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AuthResTypes, StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  fetchEmailVerification,
  fetchLogout,
  fetchSendEmailVerification,
} from "@/lib/data/authData";
import AuthHeader from "@/app/(auth)/auth-header";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { setMsg } from "@/redux/features/ActionMsgSlice";

export default function Verification({ userToken }: { userToken: string }) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  //   ############# STATES ##############
  const [loading, setLoading] = useState<boolean>(true);
  const [emailRes, setEmailRes] = useState<null | AuthResTypes>(null);

  // ############# functions ##########
  const handleEmailVerification = async () => {
    // send email request
    const emailVerification = await fetchEmailVerification(userToken);

    setEmailRes(emailVerification);
    if (emailVerification?.success && emailVerification?.results) {
      router.push("/signup-process/not-accepted");
      dispatch(
        setMsg({
          success: emailVerification.success,
          message: emailVerification.message,
        })
      );
      dispatch(loginUser(emailVerification?.results));
    }
  };

  //   ############## useEffect ##########
  // Redirect to homepage if already logged in
  useEffect(() => {
    if (user.isLogin && (user as StoredUser).verified) {
      router.push("/signup-process/not-accepted");
      return;
    }

    if (userToken) {
      handleEmailVerification();
      setLoading(false);
      return;
    }

    setLoading(false);
  }, []);

  // ############# RETURNS #################
  if (!loading) {
    return (
      <div className="min-h-[100dvh] h-full flex flex-col">
        <div className="max-w-2xl m-auto border-2 border-slate-500 dark:border-slate-400 p-5 rounded-md px-3 py-5 bg-white dark:bg-slate-800 dark:bg-opacity-30">
          <div className="text-center px-4">Verifying your account.....</div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-100 dark:bg-slate-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-full">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <AuthHeader />

            {/* MAIN */}
            {/* {emailRes === null && (
              <div className="max-w-2xl m-auto border-2 border-slate-500 dark:border-slate-400 p-5 rounded-md px-3 py-5 bg-white dark:bg-slate-800 dark:bg-opacity-30">
                <div className="text-center px-4">
                  Verifying your account.....
                </div>
              </div>
            )} */}
            {!emailRes === null && !emailRes?.success && (
              <div className="max-w-2xl m-auto border-2 border-slate-500 dark:border-slate-400 p-5 rounded-md px-3 py-5 bg-white dark:bg-slate-800 dark:bg-opacity-30">
                <div className="text-center px-4">
                  <div className="text-center px-4">
                    Something went wrong, or the verification session was
                    expired!!
                  </div>
                  <button
                    className="btn bg-red-500 hover:bg-red-600 text-white ml-3 w-[6rem] mt-6"
                    type="button"
                    onClick={() => router.push("/signin")}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* signin form */}
            {/* <SigninFormInput /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
