"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { fetchDeleteUserProfile } from "@/lib/data/userProfileData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { logoutUser } from "@/redux/features/AuthSlice";
import { setLoading } from "@/redux/features/LoadingSlice";
import { Eye, EyeOff, Lock } from "lucide-react";

interface DeleteUserAlertProps {
  dangerModalOpen: boolean;
  setDangerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteUserAlert({
  dangerModalOpen,
  setDangerModalOpen,
}: DeleteUserAlertProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleDeleteAccount = useCallback(async () => {
    dispatch(setLoading(true));

    const data = await fetchDeleteUserProfile({ password });

    if (data.success) {
      setPassword("");
      dispatch(logoutUser());
      router.push("/login");
    } else if (data.validationErrors) {
      setValidationError(data.validationErrors);
      dispatch(setLoading(false));
      return;
    }

    dispatch(setMsg({ success: data.success, message: data.message }));
    setDangerModalOpen(false);
    dispatch(setLoading(false));
  }, [dispatch, password, router, setDangerModalOpen]);

  const handleCancelDeletion = useCallback(() => {
    setDangerModalOpen(false);
    setPassword("");
    setValidationError("");
  }, [setDangerModalOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setValidationError("");
    },
    []
  );

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const handleDeleteAttempt = useCallback(async () => {
    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }
    await handleDeleteAccount();
  }, [password, handleDeleteAccount]);

  if (!dangerModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl p-6">
        <h3 className="text-2xl font-bold text-red-500 mb-2">Delete Account</h3>
        <div className="text-gray-700 dark:text-gray-300 mb-6">
          <p className="mb-4">
            Are you absolutely sure you want to delete your account? This action
            cannot be undone.
          </p>
          <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              What happens when you delete your account:
            </h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>All your personal information will be permanently erased</li>
              <li>You will lose access to all services and subscriptions</li>
              <li>Your username will become available for others to use</li>
              <li>This action is irreversible</li>
            </ul>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Please type your "PASSWORD" in the box below to confirm:
          </p>
          <div className="mt-4">
            <label
              className="block text-sm font-medium dark:text-gray-400 mb-1 sr-only"
              htmlFor="password"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg pl-10 pr-4 py-2 w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 active:ring-red-500 border-none"
                value={password}
                onChange={handleInputChange}
                required
                placeholder="Type your PASSWORD here"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 transition-colors duration-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationError && (
              <div className="text-[10px] mt-1 text-rose-500">
                {validationError}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap flex-col-reverse md:flex-row justify-end space-x-0 md:space-x-2 space-y-2 md:space-y-0">
          <button
            onClick={handleCancelDeletion}
            className="bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-800 border border-gray-800 dark:border dark:border-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 mt-2 md:mt-0"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAttempt}
            className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Yes, Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
