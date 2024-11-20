"use client";

import { useEffect, useState } from "react";
import {
  Building,
  User,
  Hash,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  Flag,
  Calendar,
  AlertTriangle,
  Pause,
} from "lucide-react";

import {
  fetchUpdateUserProfile,
  fetchUserProfile,
} from "@/lib/data/userProfileData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ProgressLoading from "../../utils/ProgressLoading";
import { UserProfileResultType } from "@/utils/definitions/userProfileDefinitions";
import { countries } from "@/utils/data/countries";
import { setLoading } from "@/redux/features/LoadingSlice";
import { loginUser } from "@/redux/features/AuthSlice";
import AccountOverviewInputField from "./AccountOverviewInputField";
import DropdownMenu2 from "./DropdownMenu2";
import DropdownMenu from "./DropdownMenu";
import Tooltip from "@/components/extra-components/Tooltip";
import moment from "moment";

const genders = ["male", "female"];

const accountStatusIcon = (accountStatus: string) => {
  switch (accountStatus) {
    case "accepted":
      return <CheckCircle size={16} className="text-green-400 mr-2" />;
    case "pending":
      return <AlertTriangle size={16} className="text-yellow-400 mr-2" />;
    case "rejected":
      return <Pause size={16} className="text-red-400 mr-2" />;
    default:
      return <AlertTriangle size={16} className="text-red-400 mr-2" />;
  }
};

export default function AccountOverviewPanel() {
  const [userInfo, setUserInfo] = useState<UserProfileResultType | {}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<{
    [key: string]: string;
  }>({});

  // dropdown states
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] =
    useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // hooks
  const dispatch = useAppDispatch();

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

  // Updates the user profile by sending a PUT request to the server.
  const updateUserInfo = async (): Promise<void> => {
    // agency validation
    if (user.role === "agency" || user.role === "master") {
      // Agency Name
      if (!user.agencyName) {
        setValidationError({
          ...validationError,
          agencyName: "Agency name is required",
        });
        return;
      }
    }

    // affiliate validation
    if (user.role === "affiliate" || user.role === "master") {
      // nationality
      if (!user.nationality) {
        setValidationError({
          ...validationError,
          nationality: "Nationality is required",
        });
        return;
      }

      // gender
      if (!user.gender) {
        setValidationError({
          ...validationError,
          gender: "Gender is required",
        });
        return;
      }

      // date of birth
      if (!user.dateOfBirth) {
        setValidationError({
          ...validationError,
          dateOfBirth: "Date of birth is required",
        });
        return;
      }
    }

    // Set loading state to true
    dispatch(setLoading(true));

    // Send PUT request to server to update user profile
    const data = await fetchUpdateUserProfile(
      userInfo as UserProfileResultType
    );

    // If the request is successful
    if (data.success && data.results) {
      // Update the user profile
      setUserInfo(data.results);
      // Exit edit mode
      setEditMode(false);
      // Update the user information in the Redux store
      dispatch(loginUser(data.results));
    }

    // If there are validation errors
    if (data.validationError) {
      // Update the validation error state
      setValidationError(data.validationError);
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

  // Cancel button handler
  const cancelBtnHandler = () => {
    fetchUserInfo();
    setValidationError({});
    setEditMode(false);
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
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-xl md:text-2xl font-semibold capitalize">
          {user.role} details
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center">
          {editMode && (
            <button
              onClick={cancelBtnHandler}
              className="dark:text-white text-sm md:text-base font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              cancel
            </button>
          )}

          {!editMode ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="bg-red-500 hover:bg-red-600 text-sm md:text-base text-white font-semibold py-2 px-1 md:px-6 rounded-lg transition-colors duration-300"
            >
              Edit Details
            </button>
          ) : (
            <button
              type="button"
              onClick={updateUserInfo}
              className="bg-red-500 hover:bg-red-600 text-sm md:text-base text-white font-semibold py-2 px-1 md:px-6 rounded-lg transition-colors duration-300"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-400 overflow-hidden px-4">
        <div className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-6">
              <User size={48} className="text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">
                Airvilla Agency
              </h3>
              <div className="flex items-center mt-2 text-sm md:text-base">
                {accountStatusIcon(user.accountStatus)}
                <span>Account Status: {user.accountStatus}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm md:text-base">
            <div>
              <span className="text-gray-700 dark:text-gray-400">
                Account Type:{" "}
              </span>
              <span className="text-red-500 font-semibold capitalize">
                {user.role}
              </span>
            </div>
            <div>
              <span className="text-gray-700 dark:text-gray-400">
                Agency ID:{" "}
              </span>
              <span
                className="text-red-500 font-semibold"
                style={{ wordBreak: "break-word" }}
              >
                {user.id}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {user.role === "agency" && (
            <FormSection title="Agency Information" titleColor="text-red-500">
              <div className="grid lg:grid-cols-2 gap-4">
                {/* username */}
                <AccountOverviewInputField
                  label="Username"
                  id="username"
                  icon={<User size={18} />}
                  value={user.username}
                  disabled={true}
                  required
                  tooltip="Your unique username for logging into the system."
                  locked
                />

                {/* agency name */}
                <AccountOverviewInputField
                  label="Agency Name"
                  id="agencyName"
                  icon={<Building size={18} />}
                  value={user.agencyName}
                  disabled={true}
                  required
                  tooltip="Your official agency name as registered with local authorities."
                  locked
                />

                {/* agency owner name */}
                <AccountOverviewInputField
                  label="Agency Owner Name"
                  id="ownerName"
                  icon={<User size={18} />}
                  value={user.firstName + " " + user.lastName}
                  disabled={true}
                  required
                  tooltip="The name of the person legally responsible for the agency."
                  locked
                />

                {/* iata number */}
                <AccountOverviewInputField
                  label="IATA Number"
                  id="iataNo"
                  icon={<Hash size={18} />}
                  value={user.iataNo}
                  disabled={true}
                  tooltip="Your unique IATA identifier. This helps verify your agency's credentials."
                  locked
                />

                {/* commercial operation number */}
                <AccountOverviewInputField
                  label="Commercial Operating Number"
                  id="commercialOperationNo"
                  icon={<Briefcase size={18} />}
                  value={user.commercialOperationNo}
                  disabled={true}
                  required
                  tooltip="Your business registration number. This is used for legal and financial operations."
                  locked
                />
              </div>
            </FormSection>
          )}
          {user.role !== "agency" && (
            <FormSection title="User Information" titleColor="text-red-500">
              <div className="grid lg:grid-cols-2 gap-4">
                {/* username */}
                <AccountOverviewInputField
                  label="Username"
                  id="username"
                  icon={<User size={18} />}
                  value={user.username}
                  onChange={(e) =>
                    setUserInfo({
                      ...user,
                      username: e.target.value,
                    })
                  }
                  required
                  tooltip="Your unique username for logging into the system."
                  disabled={user.role !== "master" ? true : !editMode}
                  locked={user.role !== "master" ? true : false}
                  validationError={validationError.username}
                />

                {/* firstName */}
                <AccountOverviewInputField
                  label="First Name"
                  id="firstName"
                  icon={<User size={18} />}
                  value={user.firstName}
                  onChange={(e) =>
                    setUserInfo({
                      ...user,
                      firstName: e.target.value,
                    })
                  }
                  required
                  tooltip="Your first name as registered with local authorities."
                  disabled={user.role !== "master" ? true : !editMode}
                  locked={user.role !== "master" ? true : false}
                  validationError={validationError.firstName}
                />

                {/* lastName */}
                <AccountOverviewInputField
                  label="Last Name"
                  id="lastName"
                  icon={<User size={18} />}
                  value={user.lastName}
                  onChange={(e) =>
                    setUserInfo({
                      ...user,
                      lastName: e.target.value,
                    })
                  }
                  required
                  tooltip="Your last name as registered with local authorities."
                  disabled={user.role !== "master" ? true : !editMode}
                  locked={user.role !== "master" ? true : false}
                  validationError={validationError.lastName}
                />

                {/* gender */}
                {!editMode || user.role !== "master" ? (
                  <AccountOverviewInputField
                    label="Gender"
                    id="gender"
                    icon={<User size={18} />}
                    value={user.gender}
                    required
                    tooltip="Your official agency name as registered with local authorities."
                    disabled={true}
                    locked={true}
                  />
                ) : (
                  <DropdownMenu2
                    label="Gender"
                    id="gender"
                    icon={<User size={18} />}
                    required
                    options={genders}
                    searchValue={user.gender || ""}
                    onSearchChange={(value: string) =>
                      setUserInfo({ ...user, gender: value })
                    }
                    isOpen={isGenderDropdownOpen}
                    setIsOpen={setIsGenderDropdownOpen}
                    validationError={validationError.gender}
                    disabled={!editMode || user.role !== "master"}
                  />
                )}

                {/* Nationality */}
                {editMode && user.role === "master" ? (
                  <DropdownMenu
                    label="Nationality"
                    id="nationality"
                    icon={<Flag size={18} />}
                    required
                    tooltip="Your nationality as registered with local authorities."
                    options={countries}
                    searchValue={user.nationality || ""}
                    onSearchChange={(value: string) =>
                      setUserInfo({ ...user, nationality: value })
                    }
                    isOpen={isNationalityDropdownOpen}
                    setIsOpen={setIsNationalityDropdownOpen}
                    validationError={validationError.nationality}
                    disabled={!editMode || user.role !== "master"}
                  />
                ) : (
                  <AccountOverviewInputField
                    label="Nationality"
                    id="nationality"
                    icon={<Flag size={18} />}
                    value={user.nationality}
                    required
                    tooltip="Your official agency name as registered with local authorities."
                    disabled={true}
                    locked={true}
                  />
                )}

                {editMode && user.role === "master" ? (
                  <SelectDateField
                    label="Date of Birth"
                    id="dateOfBirth"
                    type="date"
                    icon={<Calendar size={18} />}
                    required
                    tooltip="We use this to verify your age and customize your experience."
                    value={
                      user.dateOfBirth
                        ? moment(user.dateOfBirth, "D/MM/YYYY").format(
                            "YYYY-MM-DD"
                          )
                        : ""
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newDate = e.target.value;
                      // Convert the YYYY-MM-DD format from the input to D/MM/YYYY
                      const formattedDate = moment(newDate).format("D/MM/YYYY");
                      setUserInfo({ ...user, dateOfBirth: formattedDate });
                    }}
                    children={undefined}
                    validationError={validationError.dateOfBirth}
                    disabled={!editMode || user.role !== "master"}
                  />
                ) : (
                  <AccountOverviewInputField
                    label="Date of Birth"
                    id="dateOfBirth"
                    icon={<Calendar size={18} />}
                    value={user.dateOfBirth}
                    required
                    tooltip="We use this to verify your age and customize your experience."
                    disabled={true}
                    locked={true}
                  />
                )}
              </div>
            </FormSection>
          )}

          <FormSection title="Contact & Location" titleColor="text-red-500">
            <div className="grid lg:grid-cols-2 gap-4">
              {/* email */}
              <AccountOverviewInputField
                label="Email Address"
                id="email"
                icon={<Mail size={18} />}
                value={user.email}
                disabled={true}
                required
                tooltip="This will be your primary contact for Airvilla communications and notifications."
                locked
              />

              {/* phone number */}
              <AccountOverviewInputField
                label="Phone Number"
                id="phoneNumber"
                icon={<Phone size={18} />}
                value={user.phoneNumber}
                onChange={(e) => {
                  setUserInfo({
                    ...user,
                    phoneNumber: e.target.value,
                  });
                }}
                disabled={!editMode}
                required
                tooltip="A direct line for urgent communications regarding trades or account issues."
                validationError={validationError.phoneNumber}
              />

              {/* website */}
              {user.role === "agency" && (
                <AccountOverviewInputField
                  label="Website"
                  id="website"
                  icon={<Globe size={18} />}
                  value={user.website}
                  onChange={(e) => {
                    setUserInfo({
                      ...user,
                      website: e.target.value,
                    });
                  }}
                  disabled={!editMode}
                  tooltip="Your agency's website. This helps build trust with potential trading partners."
                  validationError={validationError.website}
                />
              )}
              {/* address */}
              {/* country */}
              {editMode ? (
                <DropdownMenu
                  label="Country"
                  id="country"
                  icon={<Flag size={18} />}
                  required
                  options={countries}
                  searchValue={
                    user.address && user.address.country
                      ? user.address.country
                      : ""
                  }
                  onSearchChange={(value: string) =>
                    setUserInfo({
                      ...user,
                      address: {
                        ...user.address,
                        country: value,
                      },
                    })
                  }
                  isOpen={isCountryDropdownOpen}
                  setIsOpen={setIsCountryDropdownOpen}
                  validationError={validationError["address.country"]}
                />
              ) : (
                <AccountOverviewInputField
                  label="Country"
                  id="country"
                  icon={<MapPin size={18} />}
                  value={user.address?.country || ""}
                  onChange={(e) => {
                    setUserInfo({
                      ...user,
                      address: {
                        ...user.address,
                        country: e.target.value,
                      },
                    });
                  }}
                  disabled={!editMode}
                  required
                  tooltip="The country where your agency is legally registered."
                  validationError={
                    validationError["address?.country"] || undefined
                  }
                />
              )}

              {/* city */}
              <AccountOverviewInputField
                label="City"
                id="city"
                icon={<MapPin size={18} />}
                value={user.address?.city}
                onChange={(e) => {
                  setUserInfo({
                    ...user,
                    address: {
                      ...user.address,
                      city: e.target.value,
                    },
                  });
                }}
                disabled={!editMode}
                required
                tooltip="The city where your agency's main office is located."
                validationError={validationError["address.city"] || undefined}
              />

              {/* street address */}
              <AccountOverviewInputField
                label="Street"
                id="streetAddress"
                icon={<MapPin size={18} />}
                value={user.address?.street || ""}
                onChange={(e) => {
                  setUserInfo({
                    ...user,
                    address: {
                      ...user.address,
                      street: e.target.value,
                    },
                  });
                }}
                disabled={!editMode}
                // required
                tooltip="Your agency's official registered address."
                validationError={validationError.street}
              />
            </div>
          </FormSection>
        </div>
      </div>
    </>
  );
}

const FormSection = ({
  title,
  children,
  titleColor = "text-white",
}: {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}) => (
  <div className="mb-8">
    <h3 className={`text-xl font-semibold mb-4 ${titleColor}`}>{title}</h3>
    {children}
  </div>
);

const SelectDateField = ({
  label,
  id,
  icon,
  tooltip,
  as = "input",
  children,
  locked,
  validationError,
  ...props
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  as?: "input" | "select";
  children: React.ReactNode;
  [key: string]: any;
  locked?: boolean;
  validationError?: string;
}) => (
  <div>
    <label
      className="block text-sm font-medium text-gray-400 mb-1"
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
          className={`dark:bg-gray-700 text-gray-600 dark:text-white rounded-lg pl-10 pr-4 py-1.5 md:py-2 w-full outline-none transition-all duration-300 border-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 ${
            locked ? "cursor-not-allowed" : ""
          }`}
          {...props}
        />
      ) : (
        <select
          id={id}
          className="dark:bg-gray-600 text-gray-600 dark:text-white rounded-lg pl-10 pr-4 py-3 w-full outline-none transition-all duration-300 border-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          {...props}
        >
          {children}
        </select>
      )}
    </div>
    {validationError && (
      <div className="text-[10px] mt-1 text-rose-500">{validationError}</div>
    )}
  </div>
);
