"use client";
import React, { useState } from "react";
import { Users, UserPlus, ChevronRight, ArrowRight, LogIn } from "lucide-react";
import { SignupFormDataTypes } from "@/utils/definitions/authDefinitions";
import Link from "next/link";

const SignupStep1 = ({
  setStep,
  role,
  setRole,
}: {
  role?: string;
  setRole: (role: string) => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [selectedType, setSelectedType] = useState(role);

  const handleContinue = (type: string) => {
    if (selectedType === type) {
      setRole(type);
      setStep(2);
      return;
    }
    setSelectedType(type);
  };

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold my-3 text-center">
          Select your account type:
        </h2>

        <div className="flex-col w-full justify-center items-center">
          <AccountTypeCard
            icon={<Users className="w-5 h-5" />}
            title="Agency"
            description="For travel agencies and tour operators managing multiple bookings and packages"
            features={[
              "Manage multiple client bookings",
              "Create and customize travel packages",
              "Access to bulk booking discounts",
            ]}
            isSelected={selectedType === "agency"}
            onSelect={() => handleContinue("agency")}
          />

          <AccountTypeCard
            icon={<UserPlus className="w-5 h-5" />}
            title="Affiliate"
            description="For travel bloggers, influencers, and individuals promoting travel experiences"
            features={[
              "Earn commissions on bookings",
              "Access to exclusive promotional content",
              "Performance tracking tools",
            ]}
            isSelected={selectedType === "affiliate"}
            onSelect={() => handleContinue("affiliate")}
          />
        </div>
      </div>
      {/* <AuthFooter /> */}
      <div className="mt-8 pt-6 border-t border-gray-700 text-center relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white dark:bg-gray-800 px-4">
          <span className="text-red-500 text-xs md:text-sm">
            Already have an account?
          </span>
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

export default SignupStep1;

const AccountTypeCard = ({
  icon,
  title,
  description,
  features,
  isSelected,
  onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <div
    className={`group bg-gray-100 dark:bg-gray-700 rounded-xl w-full p-3 md:p-4 transition-all duration-300 text-center my-[20px] ${
      isSelected
        ? "ring-2 ring-red-500"
        : "hover:bg-gray-300 dark:hover:bg-gray-600"
    }`}
  >
    <div className="flex items-center mb-2">
      <div
        className={`p-2 rounded-full mr-3 transition-colors duration-300 ${
          isSelected ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-2 text-start text-xs">
      {description}
    </p>
    <ul className="space-y-1 mb-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-start">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="dark:text-gray-200 text-xs">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="group-hover:bg-gray-700 bg-gray-600 rounded-lg">
      <button
        className={`w-full ${
          isSelected ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-500"
        } text-white font-bold py-1 md:py-2 px-3 rounded-lg transition-all duration-300 text-sm md:text-base flex items-center justify-center`}
        onClick={onSelect}
      >
        {isSelected ? "Continue" : "Select"}
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  </div>
);
