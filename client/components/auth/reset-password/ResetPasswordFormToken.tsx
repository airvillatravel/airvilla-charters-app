"use client";
import { fetchResetPassword } from "@/lib/data/authData";
import { selectIsLoggedIn } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AuthResTypes } from "@/utils/definitions/authDefinitions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AuthImage from "@/app/(auth)/auth-image";
import ProgressLoading from "../../utils/ProgressLoading";
import Logo from "../../ui/logo";
import { CheckIcon } from "lucide-react";

const ResetPasswordFormInput = ({ token }: { token: string }) => {
  // form input data
  const [form, setForm] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState<any>(null);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [results, setResults] = useState<AuthResTypes | null>(null);

  // Handles the form submission event for the reset password form.
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Set loading state to true
    setLoadingBtn(true);

    // Send reset password email
    const resetPassword = await fetchResetPassword(form, token);

    // If the request is successful, clear the form and set the 'reset' state to true
    if (resetPassword?.success) {
      setForm({ password: "", confirmPassword: "" });
      setReset(true);
      setLoadingBtn(false);
    }

    // If there are validation errors from the server, set the validation errors state
    if (resetPassword?.success === false && resetPassword.validationErrors) {
      setValidationError(resetPassword.validationErrors);
      setLoadingBtn(false);
    }

    // Set the results state to the response from the server
    setResults(resetPassword);

    // Set loading state to false
    setLoadingBtn(false);
  };

  // if reset show success message
  if (reset) {
    return (
      <div className="text-slate-100">
        <div className="text-base font-semibold mt-3 text-slate-400 block">
          <span className="mr-1">
            <CheckIcon className="w-5 h-5 text-emerald-500 inline" />
          </span>{" "}
          Your password has been reset successfully.{" "}
          <Link href="/signin" className="text-red-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-slate-100">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input w-full"
            value={form.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, password: e.target.value });
            }}
          />
          {validationError?.password && (
            <div className="text-[10px] mt-1 text-rose-500">
              {validationError?.password}
            </div>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="form-input w-full"
            value={form.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, confirmPassword: e.target.value });
            }}
          />
          {validationError?.confirmPassword && (
            <div className="text-[10px] mt-1 text-rose-500">
              {validationError?.confirmPassword}
            </div>
          )}
        </div>
      </div>
      {results?.success === false && (
        <div className="text-slate-100">
          <div className="text-sm font-semibold mt-3 text-red-600  block">
            {results?.message}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-6">
        <button
          className="btn bg-red-500 hover:bg-red-600 text-white w-full rounded-md py-2"
          type="submit"
        >
          {loadingBtn ? (
            <svg
              className="animate-spin w-4 h-4 fill-current shrink-0"
              viewBox="0 0 16 16"
            >
              <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
            </svg>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </form>
  );
};

function isValidJwt(token: string): boolean {
  // A simple check to see if the token has 2 periods, which implies it has 3 parts
  const parts = token.split(".");
  return parts.length === 3;
}

export default function ResetPasswordFormToken({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const router = useRouter();

  // ############# USEEFFECT ############
  // Redirect to homepage if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    } else if (!isValidJwt(token)) {
      router.push("/reset-password");
    } else {
      setLoading(false); // Set loading to false once the check is done
    }
  }, [isLoggedIn, router]);

  // ############# RETURNS #################
  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <div className="flex items-center rounded-lg bg-slate-950 dark:bg-opacity-60 w-full md:px-7 mx-auto max-w-6xl px-4 py-5">
        <div className="hidden lg:block w-1/2">
          <AuthImage />
        </div>
        {/* Content */}
        <div className="h-full text-white w-[1px] bg-slate-900 hidden lg:block"></div>
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 md:px-10 py-16 md:py-28">
          <div className="mx-auto w-full space-y-9">
            <Logo />
            <div className="text-slate-100">
              <h1 className="text-3xl md:text-4xl text-slate-100 font-bold">
                Reset Password
              </h1>
            </div>

            {/* signin form */}

            <ResetPasswordFormInput token={token} />
          </div>
        </div>
      </div>
    </main>
  );
}
