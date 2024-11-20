"use client";
import React, { useEffect, useState } from "react";

import {
  AuthResTypes,
  SignupFormDataTypes,
} from "@/utils/definitions/authDefinitions";
import { fetchSignup } from "@/lib/data/authData";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser, selectIsLoggedIn } from "@/redux/features/AuthSlice";
import { useRouter } from "next/navigation";
import AuthImage from "@/app/(auth)/auth-image";
import ProgressLoading from "../../utils/ProgressLoading";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import OnboardingProgress from "../../extra-components/OnboardingProgress";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";

// data init
const initFormData: SignupFormDataTypes = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  nationality: "",
  dateOfBirth: "",
  gender: "",
  country: "Jordan",
  city: "Amman",
  street: "",
  role: "",
  agencyName: "",
};

const SignupFromInput = () => {
  // ############## STATES #############
  const [formData, setFormData] = useState<SignupFormDataTypes>(initFormData);
  const [signupInfo, setSignupInfo] = useState<AuthResTypes | null>(null);
  const [banner2WarningOpen, setBanner2WarningOpen] = useState<boolean>(true);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<any>({});
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [progressStep, setProgressStep] = useState<number>(1);
  // const [loading, setLoading] = useState(true);

  // ############### FUNCTIONS ###########

  // submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationError({});

    // agency validation
    if (formData.role === "agency") {
      // Agency Name
      if (!formData.agencyName) {
        setValidationError({
          ...validationError,
          agencyName: "Agency name is required",
        });
        return;
      }
    }

    // affiliate validation
    if (formData.role === "affiliate") {
      // nationality
      if (!formData.nationality) {
        setValidationError({
          ...validationError,
          nationality: "Nationality is required",
        });
        return;
      }

      // gender
      if (!formData.gender) {
        setValidationError({
          ...validationError,
          gender: "Gender is required",
        });
        return;
      }

      // date of birth
      if (!formData.dateOfBirth) {
        setValidationError({
          ...validationError,
          dateOfBirth: "Date of birth is required",
        });
        return;
      }
    }

    setLoadingBtn(true);
    // fetch login
    const signup = await fetchSignup(formData);
    if (signup) setSignupInfo(signup);

    // if login save the user info in local storage and redirect to homepage
    if (signup?.success && signup.results) {
      setFormData(formData);
      setLoadingBtn(false);
      dispatch(setMsg({ success: signup.success, message: signup.message }));
      // setSuccessModalOpen(true);
      // setProgressStep(3);
      dispatch(loginUser(signup.results));

      // Set the expiry time in localStorage
      const expiryTime = Date.now() + 10 * 60 * 1000;
      localStorage.setItem("verificationExpiry", expiryTime.toString());

      router.push("/signup-process/not-verified");
    }

    // set the validation errors
    if (signup?.success === false && signup.validationErrors) {
      setValidationError(signup.validationErrors);
      setLoadingBtn(false);
    }
  };

  return (
    <>
      <OnboardingProgress step={progressStep} />

      {progressStep === 1 && (
        <SignupStep1
          setStep={setProgressStep}
          role={formData.role}
          setRole={(role: string) => setFormData({ ...formData, role })}
        />
      )}

      {progressStep === 2 && (
        <SignupStep2
          step={progressStep}
          setStep={setProgressStep}
          formData={formData}
          setFormData={setFormData}
          validationError={validationError}
          handleSubmit={handleSubmit}
        />
      )}

      {progressStep === 3 && <SignupStep3 email={formData.email} />}
    </>
  );
};

// MAIN FUNCTION
export default function SignupForm() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
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
    <main className="flex justify-center items-center min-h-screen p-4 bg-transparent">
      <div className="flex rounded-lg mx-auto w-full md:max-w-7xl md:px-4 bg-transparent">
        <div className="hidden lg:flex w-[40%] items-center justify-center">
          <AuthImage />
        </div>

        {/* Content */}

        <div className="dark:bg-gradient-to-br dark:text-white min-h-[0vh] flex items-center justify-center py-1 md:py-4 w-full lg:w-[60%]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3 w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-3 dark:text-white">
                Create New Account
              </h1>
              <p className="dark:text-gray-300 text-sm">
                Your Gateway to Travel Success
              </p>
            </div>

            {/* signin form */}
            <div className="">
              <SignupFromInput />
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
