"use client";
import { fetchSendResetPassword } from "@/lib/data/authData";
import { selectIsLoggedIn } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AuthResTypes } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import AuthImage from "@/app/(auth)/auth-image";
import ProgressLoading from "../../utils/ProgressLoading";
import Logo from "../../ui/logo";
import { ArrowLeft, CheckIcon, Lock, Mail, Send } from "lucide-react";
import Link from "next/link";

const ResetPasswordFormInput = () => {
  const dispatch = useAppDispatch();

  // form input data
  const [form, setForm] = useState<{ email: string }>({ email: "" });
  const [validationError, setValidationError] = useState<any>(null);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [send, setSend] = useState<boolean>(false);

  // Handles the form submission event for the reset password form.
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoadingBtn(true);

    // Send reset password email
    const sendRequest = await fetchSendResetPassword(form);

    // If the request is successful, clear the form and set the 'send' state to true
    if (sendRequest?.success) {
      setForm({ email: "" });
      setSend(true);
      setLoadingBtn(false);
    }

    // If there is a message from the server, dispatch an action to set the message
    if (sendRequest?.message) {
      dispatch(
        setMsg({ success: sendRequest?.success, message: sendRequest?.message })
      );
    }

    // If there are validation errors from the server, set the validation errors state
    if (sendRequest?.success === false && sendRequest.validationErrors) {
      setValidationError(sendRequest.validationErrors);
      setLoadingBtn(false);
    }

    // Set loading state to false
    setLoadingBtn(false);
  };

  if (send) {
    return (
      <div className="text-slate-100">
        <h3 className="text-lg font-semibold">
          Email Sent{" "}
          <span className="mr-1">
            <CheckIcon className="w-7 h-7 text-emerald-500 inline" />
          </span>{" "}
        </h3>
        <p>
          Please check your inbox and follow the instructions to reset your
          password.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium dark:text-gray-400 mb-1"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            className="bg-gray-300 dark:bg-gray-700 dark:text-white rounded-lg pl-10 pr-4 py-2.5 w-full outline-none transition-all duration-300 border-0 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-sm"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, email: e.target.value });
            }}
          />
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        {validationError && (
          <div className="text-[10px] mt-1 text-rose-500">
            {validationError}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-sm text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-300 w-full flex items-center justify-center"
      >
        {loadingBtn ? (
          <svg
            className="animate-spin w-4 h-4 fill-current shrink-0"
            viewBox="0 0 16 16"
          >
            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        ) : (
          <>
            Send Reset Link
            <Send className="ml-2" size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const router = useRouter();

  // ############# USEEFFECT ############
  // Redirect to homepage if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    } else {
      setLoading(false); // Set loading to false once the check is done
    }
  }, [isLoggedIn, router]);

  // ############# RETURNS #################
  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full min-h-[515px]  max-w-6xl flex py-20">
        <div className="hidden md:block w-1/2 pr-8">
          <AuthImage />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded inline-block mb-2">
              airvilla Charter
            </div>
            <h1 className="text-4xl font-bold dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="dark:text-gray-400 text-sm">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <ResetPasswordFormInput />

          <div className="mt-6 flex items-center text-sm dark:text-gray-400">
            <Lock size={16} className="mr-2" />
            We'll send a secure link to your email
          </div>

          <Link
            href="/signin"
            className="mt-4 text-sm dark:text-gray-400 hover:text-red-500 dark:hover:text-white transition-colors duration-300 flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
