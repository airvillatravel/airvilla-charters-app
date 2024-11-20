"use client";
import React, { useState } from "react";
import {
  Building,
  User,
  Hash,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  AtSign,
  Search,
  Flag,
  Calendar,
  LogIn,
} from "lucide-react";
import { SignupFormDataTypes } from "@/utils/definitions/authDefinitions";
import { countries } from "@/utils/data/countries";
import DropdownMenu from "./DropdownMenu";
import DropdownMenu2 from "./DropdownMenu2";
import { getFormatDate } from "@/utils/functions/functions";
import moment from "moment";
import Link from "next/link";
import PhoneNumberField from "./PhoneNumberField";

const genders = ["male", "female"];

const SignupStep2 = ({
  formData,
  setFormData,
  step,
  setStep,
  validationError,
  handleSubmit,
}: {
  formData: SignupFormDataTypes;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormDataTypes>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  validationError: any;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] =
    useState(false);

  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const renderError = (field: string): React.ReactElement | null => {
    if (validationError?.[field]) {
      return (
        <div className="text-[10px] mt-1 text-rose-500">
          {validationError[field]}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="dark:text-white flex items-center justify-center px-1">
        <div className="rounded-2xl max-w-4xl w-full">
          {formData.role === "agency" ? (
            <div className="text-center my-3">
              <h1 className="font-bold mb-1">Join Airvilla as an Agency</h1>
              <p className="dark:text-gray-400 text-xs">
                Please provide your agency information to get started with
                Airvilla
              </p>
            </div>
          ) : (
            <div className="text-center my-3">
              <h1 className="font-bold mb-1">Join Airvilla as an Affiliate</h1>
              <p className="dark:text-gray-400 text-xs">
                {" "}
                Please provide your information to get started with Airvilla
              </p>
            </div>
          )}

          <form className="space-y-4 h-[440px] overflow-y-auto">
            {/* Agency Details */}
            {formData.role === "agency" && (
              <FormSection
                title="Agency's Information"
                titleColor="text-red-500"
              >
                {/* Agency Name */}
                <InputField
                  label="Agency Name"
                  id="agencyName"
                  icon={<Building size={18} />}
                  placeholder="Enter agency name"
                  required
                  tooltip="Your official agency name as registered with local authorities."
                  value={formData.agencyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, agencyName: e.target.value })
                  }
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Agency Owner firstname */}
                  <InputField
                    label="Agency Owner First Name"
                    id="firstName"
                    icon={<User size={18} />}
                    placeholder="Enter owner's first name"
                    required
                    tooltip="The name of the person legally responsible for the agency."
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />

                  {/* Agency Owner lastname */}
                  <InputField
                    label="Agency Owner Last Name"
                    id="lastName"
                    icon={<User size={18} />}
                    placeholder="Enter owner's last name"
                    required
                    tooltip="The name of the person legally responsible for the agency."
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* IATA number */}
                  <InputField
                    label="IATA Number"
                    id="iataNo"
                    icon={<Hash size={18} />}
                    placeholder="Enter IATA number (if applicable)"
                    tooltip="Your unique IATA identifier. This helps verify your agency's credentials."
                    value={formData.iataNo || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, iataNo: e.target.value })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />

                  {/* Commercial operating number */}
                  <InputField
                    label="Commercial Operating Number"
                    id="commercialOperationNo"
                    icon={<Briefcase size={18} />}
                    placeholder="Enter commercial operating number"
                    tooltip="Your business registration number. This is used for legal and financial operations."
                    value={formData.commercialOperationNo || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        commercialOperationNo: e.target.value,
                      })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />
                </div>
              </FormSection>
            )}

            {/* Affiliate Details */}
            {formData.role === "affiliate" && (
              <FormSection
                title="Personal Information"
                titleColor="text-red-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* firstname */}
                  <InputField
                    label="First Name"
                    id="firstName"
                    icon={<User size={18} />}
                    placeholder="Enter your first name"
                    required
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />

                  {/* lastname */}
                  <InputField
                    label="Last Name"
                    id="lastName"
                    icon={<User size={18} />}
                    placeholder="Enter your last name"
                    required
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Nationality */}
                  <DropdownMenu
                    label="Nationality"
                    id="nationality"
                    icon={<Flag size={18} />}
                    required
                    tooltip="The country where your agency is legally registered."
                    options={countries}
                    searchValue={formData.nationality || ""}
                    onSearchChange={(value: string) =>
                      setFormData({ ...formData, nationality: value })
                    }
                    isOpen={isNationalityDropdownOpen}
                    setIsOpen={setIsNationalityDropdownOpen}
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />
                  {/* genders */}
                  <DropdownMenu2
                    label="Gender"
                    id="gender"
                    icon={<User size={18} />}
                    required
                    options={genders}
                    searchValue={formData.gender || ""}
                    onSearchChange={(value: string) =>
                      setFormData({ ...formData, gender: value })
                    }
                    isOpen={isGenderDropdownOpen}
                    setIsOpen={setIsGenderDropdownOpen}
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />
                </div>
                <SelectDateField
                  label="Date of Birth"
                  id="dateOfBirth"
                  type="date"
                  icon={<Calendar size={18} />}
                  required
                  tooltip="We use this to verify your age and customize your experience."
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                  value={
                    formData.dateOfBirth
                      ? moment(formData.dateOfBirth, "D/MM/YYYY").format(
                          "YYYY-MM-DD"
                        )
                      : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newDate = e.target.value;
                    // Convert the YYYY-MM-DD format from the input to D/MM/YYYY
                    const formattedDate = moment(newDate).format("D/MM/YYYY");
                    setFormData({ ...formData, dateOfBirth: formattedDate });
                  }}
                  children={undefined}
                />
              </FormSection>
            )}
            {/* Contact Details */}
            <FormSection title="Contact Details" titleColor="text-red-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Email Address */}
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  icon={<Mail size={18} />}
                  placeholder="Enter agency email"
                  required
                  tooltip="This will be your primary contact for Airvilla communications and notifications."
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                />

                {/* Phone Number */}
                <div className="space-y-1 w-full">
                  <label
                    className="block text-sm font-medium dark:text-gray-400 mb-1"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                    <span className="text-red-500">*</span>
                    <Tooltip
                      text={
                        "A direct line for urgent communications regarding trades or account issues."
                      }
                    />
                  </label>
                  <PhoneNumberField
                    getPhoneNumber={(value) => {
                      setFormData({ ...formData, phoneNumber: value });
                    }}
                  />
                  {renderError("phoneNumber")}
                </div>
              </div>

              {/* Website */}
              {formData.role === "agency" && (
                <InputField
                  label="Website"
                  id="website"
                  type="url"
                  icon={<Globe size={18} />}
                  placeholder="Enter agency website (if applicable)"
                  tooltip="Your agency's website. This helps build trust with potential trading partners."
                  value={formData.website || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Country */}
                <DropdownMenu
                  label="Country"
                  id="country"
                  icon={<MapPin size={18} />}
                  required
                  tooltip="The country where your agency is legally registered."
                  options={countries}
                  searchValue={formData.country}
                  onSearchChange={(value: string) =>
                    setFormData({ ...formData, country: value })
                  }
                  isOpen={isCountryDropdownOpen}
                  setIsOpen={setIsCountryDropdownOpen}
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                />

                {/* City */}
                <InputField
                  label="City"
                  id="city"
                  icon={<MapPin size={18} />}
                  placeholder="Enter city"
                  required
                  tooltip="The city where your agency's main office is located."
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                />
              </div>
              {/* Street */}
              <InputField
                label="Street Address"
                id="street"
                icon={<MapPin size={18} />}
                placeholder="Enter street address"
                tooltip="Your agency's official registered address."
                value={formData.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                renderError={(field: string) => <div>{renderError(field)}</div>}
              />
            </FormSection>

            {/* Account Setup */}
            <FormSection title="Account Setup" titleColor="text-red-500">
              {/* Username */}
              <div className="space-y-4">
                <InputField
                  label="Username"
                  id="username"
                  icon={<AtSign size={18} />}
                  placeholder="Choose a username"
                  required
                  tooltip="This will be your unique identifier on the Airvilla platform."
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  renderError={(field: string) => (
                    <div>{renderError(field)}</div>
                  )}
                />

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PasswordField
                    label="Set Password"
                    id="password"
                    icon={<Lock size={18} />}
                    placeholder="Create a strong password"
                    showPassword={showPassword}
                    toggleVisibility={() =>
                      togglePasswordVisibility("password")
                    }
                    required
                    tooltip="Choose a strong, unique password to protect your Airvilla account."
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />

                  {/* Confirm Password */}
                  <PasswordField
                    label="Confirm Password"
                    id="confirmPassword"
                    icon={<Lock size={18} />}
                    placeholder="Confirm your password"
                    showPassword={showConfirmPassword}
                    toggleVisibility={() => togglePasswordVisibility("confirm")}
                    required
                    tooltip="Re-enter your password to ensure it's correct."
                    value={formData.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    renderError={(field: string) => (
                      <div>{renderError(field)}</div>
                    )}
                  />
                </div>
                <div className="text-sm dark:text-gray-400 flex items-start">
                  <AlertCircle
                    size={16}
                    className="mr-2 mt-0.5 flex-shrink-0"
                  />
                  <p>
                    Password must be at least 8 characters long and include a
                    mix of upper and lowercase letters, numbers, and symbols.
                  </p>
                </div>
              </div>
            </FormSection>

            <div className="text-xs dark:text-gray-400 flex items-start">
              <AlertCircle
                size={16}
                className="mr-2 mt-0.5 w-4 flex-shrink-0"
              />
              <p>
                By signing up, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              {/* Back */}
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm py-1 md:py-1.5 px-6 rounded-lg transition-colors duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                Back
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={(e: any) => handleSubmit(e)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-1 md:py-1.5 px-6 rounded-lg transition-colors duration-300 flex items-center"
              >
                Next
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <AuthFooter /> */}
      <div className="mt-8 pt-6 border-t border-gray-700 text-center relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white dark:bg-gray-800 px-4">
          <span className="text-red-500 text-sm">Already have an account?</span>
        </div>
        <Link
          href="/signin"
          className="my-1.5 text-base bg-gray-500 hover:bg-red-600 text-white font-semibold py-1.5 px-5 rounded-full transition-all duration-300 inline-flex items-center space-x-2"
        >
          <span className="text-sm">Login</span>
          <LogIn className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
};

const FormSection = ({
  title,
  children,
  titleColor = "text-white",
}: {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}) => (
  <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
    <h2 className={`text-base font-semibold mb-3 ${titleColor}`}>{title}</h2>
    <div className="grid grid-cols-1 gap-3">{children}</div>
  </div>
);

const InputField = ({
  label,
  id,
  icon,
  tooltip,
  renderError,
  ...props
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  renderError: (id: string) => JSX.Element;
  [key: string]: any;
}) => (
  <div className="space-y-1 w-full">
    <label
      className="block text-sm font-medium dark:text-gray-400 mb-1"
      htmlFor={id}
    >
      {label} {props.required && <span className="text-red-500">*</span>}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        {icon}
      </span>
      <input
        id={id}
        className="bg-gray-300 dark:bg-gray-600 text-xs dark:text-white rounded-lg pl-10 pr-2 py-1.5 w-full outline-none transition-all duration-300 border-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        {...props}
      />
    </div>
    {renderError(id)}
  </div>
);

const PasswordField = ({
  label,
  id,
  icon,
  showPassword,
  toggleVisibility,
  tooltip,
  renderError,
  ...props
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  showPassword: boolean;
  toggleVisibility: () => void;
  tooltip?: string;
  [key: string]: any;
  renderError: (id: string) => JSX.Element;
}) => (
  <div>
    <label
      className="block text-sm font-medium dark:text-gray-400 mb-1"
      htmlFor={id}
    >
      {label} {props.required && <span className="text-red-500">*</span>}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        {icon}
      </span>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className="bg-gray-300 dark:bg-gray-600 text-xs dark:text-white rounded-lg pl-10 pr-2 py-1.5 w-full outline-none transition-all duration-300 border-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300"
        onClick={toggleVisibility}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {renderError(id)}
  </div>
);

const SelectDateField = ({
  label,
  id,
  icon,
  tooltip,
  renderError,
  as = "input",
  children,
  ...props
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  renderError: (id: string) => JSX.Element;
  tooltip?: string;
  as?: "input" | "select";
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <div>
    <label
      className="block text-sm font-medium dark:text-gray-400 mb-1"
      htmlFor={id}
    >
      {label} {props.required && <span className="text-red-500">*</span>}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        {icon}
      </span>
      {as === "input" ? (
        <input
          id={id}
          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-xs rounded-lg pl-10 pr-4 py-1.5 w-full outline-none transition-all duration-300 border-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          {...props}
        />
      ) : (
        <select
          id={id}
          className="dark:bg-gray-600 dark:text-white rounded-lg pl-10 pr-4 py-3 w-full outline-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          {...props}
        >
          {children}
        </select>
      )}
    </div>
    {renderError(id)}
  </div>
);

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1">
    <Info size={16} className="text-gray-500 cursor-help" />
    <div className="opacity-0 bg-white dark:bg-gray-800 dark:text-white text-xs rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 group-hover:opacity-100 transition-opacity duration-300 w-48 pointer-events-none">
      {text}
      <svg
        className="absolute text-white dark:text-gray-800 h-2 w-full left-0 top-full"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
      >
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </div>
  </div>
);

export default SignupStep2;
