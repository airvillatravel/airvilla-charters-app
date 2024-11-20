"use client";

import { useEffect, useState } from "react";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch } from "@/redux/hooks";
import { countries } from "@/utils/data/countries";
import { setLoading } from "@/redux/features/LoadingSlice";
import ProgressLoading from "@/components/utils/ProgressLoading";
import AccountDateOfBirth from "@/components/extra-components/AccountDateOfBirth";
import {
  fetchSingleUserForMaster,
  fetchUpdateUserPasswordForMaster,
  fetchUpdateUserProfileForMaster,
  fetchUserRequestForMaster,
} from "@/lib/data/masterUsersData";
import AlertWindow from "@/components/alart/AlertWindow";
import { MasterUserResultType } from "@/utils/definitions/masterDefinitions";
import {
  AlertTriangle,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Flag,
  Globe,
  Hash,
  Lock,
  Mail,
  MapPin,
  Pause,
  Phone,
  User,
} from "lucide-react";
import AccountOverviewInputField from "@/components/account-hub/account-overview/AccountOverviewInputField";
import Tooltip from "@/components/extra-components/Tooltip";
import DropdownMenu2 from "@/components/account-hub/account-overview/DropdownMenu2";
import DropdownMenu from "@/components/account-hub/account-overview/DropdownMenu";
import moment from "moment";
import { GiCheckMark } from "react-icons/gi";
import { getSingleTeamMember } from "@/lib/data/teamData";

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

const genders = ["male", "female"];

const roleOptions = ["affiliate", "agency", "master"];

export default function MasterUsersAccountPanel({
  userId,
}: {
  userId: string;
}) {
  // loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // hash value url
  const hash = window.location.hash.replace("#", "");

  // user data
  const [userInfo, setUserInfo] = useState<MasterUserResultType | {}>({});
  const [editMode, setEditMode] = useState<boolean>(() =>
    hash === "edit" ? true : false
  );
  const [validationError, setValidationError] = useState<{
    [key: string]: string;
  }>({});

  // user request state
  const [selectedRequest, setSelectedRequest] = useState<string>("");
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);

  // dropdown states
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] =
    useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isRolesDropdownOpen, setIsRolesDropdownOpen] = useState(false);
  // password
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
  const [updatePasswordForm, setUpdatePasswordForm] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });
  const [validationErrorPassword, setValidationErrorPassword] = useState<any>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // hooks
  const dispatch = useAppDispatch();

  // ######## functions ########
  // fetch user info
  const fetchUserInfo = async () => {
    setIsLoading(true);
    // Fetch user profile data
    const data = await fetchSingleUserForMaster(userId);
    const data2 = await getSingleTeamMember(userId);

    console.log({ data });
    console.log({ data2 });

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
    const data = await fetchUpdateUserProfileForMaster(
      userId,
      userInfo as MasterUserResultType
    );

    // If the request is successful
    if (data.success && data.results) {
      // Update the user profile
      setUserInfo(data.results);
      // Exit edit mode
      setEditMode(false);
      setValidationError({});
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

  // handle user request
  const handleUserRequest = async () => {
    const status = () => {
      if (selectedRequest === "accept") {
        return "accepted";
      } else if (selectedRequest === "reject") {
        return "rejected";
      }
    };

    dispatch(setLoading(true));
    const updateData = await fetchUserRequestForMaster(userId, {
      accountStatus: status(),
    });

    // update user info with client if success
    if (updateData.success) {
      setUserInfo(updateData.results);
    }

    // display message
    dispatch(
      setMsg({ success: updateData.success, message: updateData.message })
    );

    // close the alart window
    setDangerModalOpen(false);

    dispatch(setLoading(false));
  };

  // handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setUpdatePasswordForm({
      ...updatePasswordForm,
      password: password,
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

  // update user password
  const updateUserPassword = async (): Promise<void> => {
    // Set loading state to true
    dispatch(setLoading(true));
    setPasswordChanged(false);
    // Send PUT request to server to update user profile
    const data = await fetchUpdateUserPasswordForMaster(
      userId,
      updatePasswordForm
    );
    // If the request is successful
    if (data.success) {
      setPasswordChanged(true);
      // Exit edit mode
      setValidationErrorPassword({});
      // reset the form
      setUpdatePasswordForm({
        password: "",
        confirmPassword: "",
      });
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

  // on change handler
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setUserInfo({ ...userInfo, [id]: value });
  };

  // Cancel button handler
  const cancelBtnHandler = () => {
    fetchUserInfo();
    setValidationError({});
    setEditMode(false);
    // remove the edit hash if exist
    if (window.location.hash === "#edit") {
      window.location.hash = "";
    }
  };

  // ######## useEffect ########
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // User not found
  if (!userInfo) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-red-700 text-xl font-bold">User not found</h1>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return <ProgressLoading />;
  }

  // User after fetched the data
  const user = userInfo as MasterUserResultType;

  return (
    <>
      <AlertWindow
        title={`${selectedRequest} User Request`}
        content={`Are you sure you want to ${selectedRequest} this user?`}
        yesBtnText={selectedRequest}
        noBtnText="Cancel"
        handleYesBtnClick={handleUserRequest}
        dangerModalOpen={dangerModalOpen}
        setDangerModalOpen={setDangerModalOpen}
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-xl md:text-2xl font-semibold capitalize">
          {user.role} details
        </h2>
        {user.accountStatus === "accepted" && (
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
        )}
      </div>

      {/* Body */}
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
            {editMode ? (
              <DropdownMenu2
                label="Role"
                id="role"
                icon={<User size={18} />}
                required
                options={roleOptions}
                searchValue={user.role || ""}
                onSearchChange={(value: string) =>
                  setUserInfo({ ...user, role: value })
                }
                isOpen={isRolesDropdownOpen}
                setIsOpen={setIsRolesDropdownOpen}
                validationError={validationError.role}
              />
            ) : (
              <div>
                <span className="text-gray-700 dark:text-gray-400">
                  Account Type:{" "}
                </span>
                <span className="text-red-500 font-semibold capitalize">
                  {user.role}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-400 mr-1">
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
                  onChange={(e) =>
                    setUserInfo({ ...user, username: e.target.value })
                  }
                  disabled={!editMode}
                  required
                  tooltip="Your unique username for logging into the system."
                  validationError={validationError.username}
                />

                {/* agency name */}
                <AccountOverviewInputField
                  label="Agency Name"
                  id="agencyName"
                  icon={<Building size={18} />}
                  value={user.agencyName}
                  onChange={(e) =>
                    setUserInfo({ ...user, agencyName: e.target.value })
                  }
                  disabled={!editMode}
                  required
                  tooltip="Your official agency name as registered with local authorities."
                  validationError={validationError.agencyName}
                />

                {/* agency owner name */}
                <AccountOverviewInputField
                  label="Agency Owner First Name"
                  id="firstName"
                  icon={<User size={18} />}
                  value={user.firstName}
                  onChange={(e) =>
                    setUserInfo({ ...user, firstName: e.target.value })
                  }
                  disabled={!editMode}
                  required
                  tooltip="The first name of the person legally responsible for the agency."
                  validationError={validationError.firstName}
                />
                {/* agency owner name */}
                <AccountOverviewInputField
                  label="Agency Owner Last Name"
                  id="lastName"
                  icon={<User size={18} />}
                  value={user.lastName}
                  onChange={(e) =>
                    setUserInfo({ ...user, lastName: e.target.value })
                  }
                  disabled={!editMode}
                  required
                  tooltip="The last name of the person legally responsible for the agency."
                  validationError={validationError.lastName}
                />

                {/* iata number */}
                <AccountOverviewInputField
                  label="IATA Number"
                  id="iataNo"
                  icon={<Hash size={18} />}
                  value={user.iataNo}
                  onChange={(e) =>
                    setUserInfo({ ...user, iataNo: e.target.value })
                  }
                  disabled={!editMode}
                  tooltip="Your unique IATA identifier. This helps verify your agency's credentials."
                  validationError={validationError.iataNo}
                />

                {/* commercial operation number */}
                <AccountOverviewInputField
                  label="Commercial Operating Number"
                  id="commercialOperationNo"
                  icon={<Briefcase size={18} />}
                  value={user.commercialOperationNo}
                  onChange={(e) =>
                    setUserInfo({
                      ...user,
                      commercialOperationNo: e.target.value,
                    })
                  }
                  disabled={!editMode}
                  required
                  tooltip="Your business registration number. This is used for legal and financial operations."
                  validationError={validationError.commercialOperationNo}
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
                  disabled={!editMode}
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
                  disabled={!editMode}
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
                  disabled={!editMode}
                  validationError={validationError.lastName}
                />

                {/* gender */}
                {!editMode ? (
                  <AccountOverviewInputField
                    label="Gender"
                    id="gender"
                    icon={<User size={18} />}
                    value={user.gender}
                    required
                    tooltip="Your official agency name as registered with local authorities."
                    disabled={!editMode}
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
                  />
                )}

                {/* Nationality */}
                {editMode ? (
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
                  />
                ) : (
                  <AccountOverviewInputField
                    label="Nationality"
                    id="nationality"
                    icon={<Flag size={18} />}
                    value={user.nationality}
                    required
                    tooltip="Your official agency name as registered with local authorities."
                    disabled={!editMode}
                  />
                )}

                {editMode ? (
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
                  />
                ) : (
                  <AccountOverviewInputField
                    label="Date of Birth"
                    id="dateOfBirth"
                    icon={<Calendar size={18} />}
                    value={user.dateOfBirth}
                    required
                    tooltip="We use this to verify your age and customize your experience."
                    disabled={!editMode}
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
                onChange={(e) => {
                  setUserInfo({
                    ...user,
                    email: e.target.value,
                  });
                }}
                disabled={!editMode}
                required
                tooltip="This will be your primary contact for Airvilla communications and notifications."
                validationError={validationError.email}
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
                  searchValue={user.address.country || ""}
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
                  value={user?.address?.country || ""}
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
                    validationError["address.country"] || undefined
                  }
                />
              )}

              {/* city */}
              <AccountOverviewInputField
                label="City"
                id="city"
                icon={<MapPin size={18} />}
                value={user?.address?.city || ""}
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
                value={user?.address?.street || ""}
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
                required
                tooltip="Your agency's official registered address."
                validationError={validationError.street}
              />
            </div>
          </FormSection>
        </div>

        {/* User request */}
        {user.accountStatus === "pending" && (
          <footer>
            <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
              <div className="flex self-end">
                <button
                  type="button"
                  onClick={() => {
                    setDangerModalOpen(true);
                    setSelectedRequest("reject");
                  }}
                  className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDangerModalOpen(true);
                    setSelectedRequest("accept");
                  }}
                  className="btn bg-red-500 hover:bg-red-600 text-white ml-3"
                >
                  Accept
                </button>
              </div>
            </div>
          </footer>
        )}

        {/* Update Password */}
        {user.accountStatus !== "pending" && (
          <div className="space-y-4 mb-12">
            <h4 className="text-lg font-medium dark:text-gray-300">
              Update Password
            </h4>

            {/* New Password */}
            <InputField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock size={18} />}
              value={updatePasswordForm.password}
              onChange={handlePasswordChange}
              required
              validationError={validationErrorPassword.password}
            />

            {/* Confirm New Password */}
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              icon={<Lock size={18} />}
              value={updatePasswordForm.confirmPassword}
              onChange={(e) =>
                setUpdatePasswordForm({
                  ...updatePasswordForm,
                  confirmPassword: e.target.value,
                })
              }
              required
              validationError={validationErrorPassword?.confirmPassword}
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
              onClick={updateUserPassword}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Save Password Changes
            </button>

            {passwordChanged && (
              <div className="text-green-500 flex text-sm items-center">
                <span className="mr-2">Password Changed</span> <GiCheckMark />{" "}
              </div>
            )}
          </div>
        )}
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
          className={`dark:bg-gray-700 text-gray-600 dark:text-white rounded-lg pl-10 pr-4 py-1.5 md:py-2 w-full outline-none transition-all duration-300 border-none border-0 ring-0 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 ${
            locked ? "cursor-not-allowed" : ""
          }`}
          {...props}
        />
      ) : (
        <select
          id={id}
          className="bg-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full outline-none transition-all duration-300 border-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
        className="dark:bg-gray-700 dark:text-white rounded-lg pl-10 pr-4 py-2 w-full outline-none transition-all duration-300 border-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
      <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
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
