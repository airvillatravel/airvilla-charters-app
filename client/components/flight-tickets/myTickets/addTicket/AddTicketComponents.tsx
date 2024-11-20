import { AlertCircle } from "lucide-react";
import React, { useState } from "react";

export const Card = ({
  icon,
  title,
  children,
  newClass = "bg-gray-100 dark:bg-gray-700",
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  newClass?: string;
}) => (
  <div
    className={`${newClass} rounded-lg p-5 md:p-6 mb-6 shadow-md hover:shadow-lg`}
  >
    <h2 className="text-2xl mb-4 text-[#EE4544] flex items-center font-bold">
      {React.cloneElement(icon, { className: "mr-2" })}
      <span className="text-gray-700 dark:text-white">{title}</span>
    </h2>
    {children}
  </div>
);

export const InputField = ({
  id,
  label,
  placeholder,
  icon,
  tooltip,
  value,
  onChange,
  type,
  min,
  max,
  validationError,
  input,
}: {
  id?: string;
  label: string;
  placeholder?: string;
  icon?: any;
  tooltip?: string;
  value?: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: number;
  max?: number;
  validationError?: any;
  input?: any;
}) => (
  <div className="flex-1">
    <label className="text-sm font-medium mb-2 flex items-center capitalize">
      {label} <span className="text-red-500">*</span>
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    {input ? (
      input
    ) : (
      <div className="relative">
        <input
          placeholder={placeholder}
          className="w-full border-0 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 shadow dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows"
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          type={type}
          inputMode={type === "number" ? "numeric" : "text"}
          pattern={type === "number" ? "[0-9]*" : undefined}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        {icon && (
          <span className="absolute right-3 top-2.5 text-gray-400">{icon}</span>
        )}
      </div>
    )}
    <div className="text-[10px] mt-1 text-rose-500">{validationError}</div>
  </div>
);

export const Tooltip = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <AlertCircle
        size={16}
        className="text-gray-800 dark:text-gray-200 cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 px-3 py-2 text-sm font-normal text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
          {text}
        </div>
      )}
    </div>
  );
};

export const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="bg-gray-100 dark:bg-gray-600 rounded-full p-4 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 text-center mb-4">{description}</p>
  </div>
);
