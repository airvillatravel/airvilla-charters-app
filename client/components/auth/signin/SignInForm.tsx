"use client";
import { fetchLogin } from "@/lib/data/authData";
import { loginUser, selectIsLoggedIn } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AuthResTypes, LoginBody } from "@/utils/definitions/authDefinitions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import AuthImage from "@/app/(auth)/auth-image";
import ProgressLoading from "../../utils/ProgressLoading";
import Logo from "../../ui/logo";
import {
  ArrowRight,
  Eye,
  EyeOffIcon,
  Info,
  Lock,
  Mail,
  Shield,
} from "lucide-react";

const SigninFormInput = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // default value
  const formData = {
    email: "",
    password: "",
  };

  // form input data
  const [form, setForm] = useState<LoginBody>({ email: "", password: "" });
  const [banner2WarningOpen, setBanner2WarningOpen] = useState<boolean>(true);
  const [loginInfo, setLoginInfo] = useState<AuthResTypes | null>(null);
  const [validationError, setValidationError] = useState<any>(null);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  // handle when writing the input
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the corresponding field in formData based on the input's id
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingBtn(true);
    setValidationError(null);

    // fetch login
    const login = await fetchLogin(form);
    if (login) setLoginInfo(login);

    // if login save the user info in local storage and redirect to homepage
    if (login?.success && login.results) {
      setForm(formData);
      router.push("/authentication");
      dispatch(setMsg({ success: login.success, message: "login" }));
      dispatch(loginUser(login.results));
    }

    // set the validation errors
    if (login?.success === false && login.validationErrors) {
      setValidationError(login.validationErrors);
    }

    if (login?.success === false && login.message && !login.validationErrors) {
      dispatch(setMsg({ success: login.success, message: login.message }));
    }
    setLoadingBtn(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg pl-10 pr-4 py-1.5 md:py-2.5 w-full outline-none transition-all duration-300 border-0 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-xs md:placeholder:text-sm"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleFormChange}
          />
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        {validationError?.email && (
          <div className="text-[10px] mt-1 text-rose-500">
            {validationError?.email}
          </div>
        )}
      </div>

      {/* Password input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Lock size={18} />
          </span>
          <input
            placeholder="Enter your password"
            id="password"
            type={showPassword ? "text" : "password"}
            className=" bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg pl-10 pr-4 py-1.5 md:py-2.5 w-full outline-none transition-all duration-300 border-0 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-xs md:placeholder:text-sm"
            value={form.password}
            onChange={handleFormChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {validationError?.password && (
          <div className="text-[10px] mt-1 text-rose-500">
            {validationError?.password}
          </div>
        )}
      </div>

      {/* Forget password */}
      <div className="flex items-center justify-between">
        <Link
          href="/reset-password"
          className="text-sm text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-sm md:text-base text-white font-semibold py-1.5 md:py-2.5 px-6 rounded-lg transition-colors duration-300 w-full flex items-center justify-center"
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
            {" "}
            Sign In
            <ArrowRight className="ml-2" size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default function SignInForm() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const router = useRouter();

  // ############# USEEFFECT ############
  // Redirect to homepage if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/blockseats");
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-6xl flex py-20">
        <div className="hidden md:block w-1/2 pr-8">
          <AuthImage />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-8">
            <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded inline-block mb-2">
              airvilla Charter
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              New here?{" "}
              <Link href="/signup" className="text-red-500 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <SigninFormInput />

          <div className="mt-6 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Shield size={16} className="mr-2" />
            Your connection is secure
          </div>
        </div>
      </div>
    </div>
  );
}
