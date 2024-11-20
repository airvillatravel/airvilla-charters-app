"use client";

import { useEffect, useState } from "react";

import {
  fetchUpdateUserEmail,
  fetchUpdateUserPassword,
  fetchUserProfile,
} from "@/lib/data/userProfileData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch } from "@/redux/hooks";
import ProgressLoading from "../../utils/ProgressLoading";
import { UserProfileResultType } from "@/utils/definitions/userProfileDefinitions";

import { setLoading } from "@/redux/features/LoadingSlice";
import { logoutUser } from "@/redux/features/AuthSlice";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteUserAlart from "./DeleteUserAlart";
import {
  Lock,
  Mail,
  AlertTriangle,
  Info,
  Check,
  X,
  Eye,
  EyeOff,
  Building,
  User,
  Shield,
  Bell,
  FileText,
  HelpCircle,
} from "lucide-react";
import DeleteUserAlert from "./DeleteUserAlart";

export default function PrivacyAccountPanel() {
  const [userInfo, setUserInfo] = useState<UserProfileResultType | {}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // email
  const [emailSend, setEmailSend] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<{ newEmail: string }>({
    newEmail: "",
  });
  const [validationErrorEmail, setValidationErrorEmail] = useState<string>("");

  // password
  const [updatePasswordForm, setUpdatePasswordForm] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [validationErrorPassword, setValidationErrorPassword] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // delete user
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);

  // hooks
  const dispatch = useAppDispatch();
  const router = useRouter();

  // ######## functions ########
  const fetchUserInfo = async () => {
    setIsLoading(true);
    // Fetch user profile data
    const data = await fetchUserProfile();

    // Set user info
    if (data.success && data.results) {
      setUserInfo(data.results);
    }
    // Display message
    dispatch(
      setMsg({
        success: data.success,
        message: data.message,
      })
    );
    setIsLoading(false);
  };

  // handle password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setUpdatePasswordForm({
      ...updatePasswordForm,
      newPassword: password,
    });
    const strength =
      password.length > 8
        ? password.match(/[A-Z]/) &&
          password.match(/[a-z]/) &&
          password.match(/[0-9]/)
          ? 3
          : 2
        : 1;
    setPasswordStrength(strength);
  };

  // Updates the user profile by sending a PUT request to the server.
  const updateEmail = async (): Promise<void> => {
    // Set loading state to true
    dispatch(setLoading(true));

    // Send PUT request to server to update user profile
    const data = await fetchUpdateUserEmail(newEmail);

    // If the request is successful
    if (data.success) {
      // Update the user information in the Redux store
      setValidationErrorEmail("");
      setNewEmail({ newEmail: "" });
      alert(
        `Email verification send successful, please check your email ${newEmail.newEmail}`
      );
    }

    // If there are validation errors
    if (data.validationError) {
      // Update the validation error state
      setValidationErrorEmail(data.validationError);
    }

    // Display the appropriate message
    dispatch(
      setMsg({
        success: data.success,
        message: data.message,
      })
    );

    // Set loading state to false
    dispatch(setLoading(false));
  };

  // update user password
  const updatePassword = async (): Promise<void> => {
    // Set loading state to true
    dispatch(setLoading(true));
    // Send PUT request to server to update user profile
    const data = await fetchUpdateUserPassword(updatePasswordForm);
    // If the request is successful
    if (data.success) {
      // reset the form
      setUpdatePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setValidationErrorPassword({});
      alert("Password changed successfully");
    }

    // If there are validation errors
    if (data.validationError) {
      // Update the validation error state
      setValidationErrorPassword(data.validationError);
    }

    // Display the appropriate message
    dispatch(
      setMsg({
        success: data.success,
        message: data.message,
      })
    );
    // Set loading state to false
    dispatch(setLoading(false));
  };

  // ######## useEffect ########
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Loading
  if (isLoading) {
    return <ProgressLoading />;
  }

  // User not found
  if (!userInfo) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-red-700 text-xl font-bold">User not found</h1>
      </div>
    );
  }

  const user = userInfo as UserProfileResultType;

  return (
    <div className="space-y-8">
      {/* Account Security Section */}
      <h3 className="text-xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
        Account Security
      </h3>
      <section className="bg-white dark:bg-gray-700 p-6 rounded-lg">
        {/* Password Update */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium dark:text-gray-300">
            Update Password
          </h4>
          {/* Current Password */}
          <InputField
            label="Current Password"
            id="currentPassword"
            type={showPassword ? "text" : "password"}
            icon={<Lock size={18} />}
            value={updatePasswordForm.currentPassword}
            onChange={(e) =>
              setUpdatePasswordForm({
                ...updatePasswordForm,
                currentPassword: e.target.value,
              })
            }
            required
            validationError={validationErrorPassword?.currentPassword}
          />

          {/* New Password */}
          <InputField
            label="New Password"
            id="newPassword"
            type={showPassword ? "text" : "password"}
            icon={<Lock size={18} />}
            value={updatePasswordForm.newPassword}
            onChange={handlePasswordChange}
            required
            validationError={validationErrorPassword?.newPassword}
          />

          {/* Confirm New Password */}
          <InputField
            label="Confirm New Password"
            id="confirmNewPassword"
            type={showPassword ? "text" : "password"}
            icon={<Lock size={18} />}
            value={updatePasswordForm.confirmNewPassword}
            onChange={(e) =>
              setUpdatePasswordForm({
                ...updatePasswordForm,
                confirmNewPassword: e.target.value,
              })
            }
            required
            validationError={validationErrorPassword?.confirmNewPassword}
          />

          {/* Show/Hide Password */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <span className="text-sm dark:text-gray-400">
              {showPassword ? "Hide" : "Show"} password
            </span>
          </div>
          <PasswordStrengthIndicator strength={passwordStrength} />
          <button
            onClick={updatePassword}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Save Password Changes
          </button>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-700 p-6 rounded-lg">
        {/* Email Settings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium dark:text-gray-300">
            Email Settings
          </h4>
          <div className="flex flex-wrap items-center md:space-x-4">
            <span className="dark:text-gray-400">Current Email:</span>
            <span className="text-gray-700 font-bold dark:text-white overflow-hidden text-ellipsis break-all">
              {user.email}
            </span>
          </div>
          {/* New Email Address */}
          <InputField
            label="New Email Address"
            id="newEmail"
            type="email"
            icon={<Mail size={18} />}
            value={newEmail.newEmail}
            onChange={(e) => setNewEmail({ newEmail: e.target.value })}
            required
            validationError={validationErrorEmail}
          />
          {/* <InputField
            label="Confirm New Email Address"
            id="confirmNewEmail"
            type="email"
            icon={<Mail size={18} />}
            value={newEmail.confirmNewEmail}
            onChange={(e) => setConfirmNewEmail(e.target.value)}
            required
          /> */}
          {/* send email button*/}
          <button
            type="button"
            onClick={updateEmail}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-2 md:px-4 rounded-lg transition-colors duration-300"
          >
            Send Verification Code
          </button>
          {/* <InputField
            label="Verification Code"
            id="verificationCode"
            type="text"
            icon={<Lock size={18} />}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button
            onClick={handleSaveEmailChanges}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Save Email Changes
          </button> */}
        </div>
      </section>

      {/* Account Deletion Section */}
      <section className="bg-white dark:bg-gray-700 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-red-500">
          Account Deletion
        </h3>
        <p className="dark:text-gray-300 mb-4">
          Deleting your account is permanent. All your data will be permanently
          removed and cannot be recovered.
        </p>
        <ul className="list-disc list-inside dark:text-gray-300 mb-4">
          <li>Your profile and all associated data will be deleted</li>
          <li>You will lose access to all services and subscriptions</li>
          <li>Any outstanding balances or credits will be forfeited</li>
        </ul>
        <button
          type="button"
          onClick={() => setDangerModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 mt-3 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Delete Account
        </button>

        <DeleteUserAlert
          dangerModalOpen={dangerModalOpen}
          setDangerModalOpen={setDangerModalOpen}
        />
      </section>
    </div>
  );
}

const InputField = ({
  label,
  id,
  icon,
  value,
  onChange,
  required,
  type = "text",
  validationError,
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  validationError?: string;
}) => (
  <div>
    <label
      className="block text-sm font-medium dark:text-gray-400 mb-1"
      htmlFor={id}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg pl-10 pr-4 py-2 w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 border-none"
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </div>
    {validationError && (
      <div className="text-[10px] mt-1 text-rose-500">{validationError}</div>
    )}
  </div>
);

const PasswordStrengthIndicator = ({ strength }: { strength: number }) => {
  const getStrengthColor = () => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      default:
        return "No password";
    }
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()}`}
          style={{ width: `${strength * 33.33}%` }}
        ></div>
      </div>
      <p className="text-sm dark:text-gray-400 mt-1">
        Password strength: {getStrengthText()}
      </p>
    </div>
  );
};
