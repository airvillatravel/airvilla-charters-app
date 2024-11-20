"use client";

import { ArrowBigDown, ArrowDown, Info, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DropdownMenu2({
  label,
  id,
  icon,
  tooltip,
  options,
  searchValue,
  onSearchChange,
  isOpen,
  setIsOpen,
  locked,
  disabled,
  validationError,
  ...props
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  options: string[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  [key: string]: any;
  locked?: boolean;
  disabled?: boolean;
  validationError?: string;
}) {
  // on click outside of the field close the box

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !menuRef.current?.contains(event.target as Node) &&
      !(event.target instanceof HTMLInputElement)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label
        className="block text-sm font-medium text-gray-400 mb-1"
        htmlFor={id}
      >
        {label} {props.required && <span className="text-red-500">*</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="relative ">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          {icon}
        </span>
        <input
          id={id}
          type="button"
          className={`bg-white dark:bg-gray-700 border-none text-gray-600 dark:text-white text-start rounded-lg pl-10 pr-4 py-1.5 md:py-2 w-full outline-none transition-all duration-300 focus:ring-2  focus:ring-red-500 focus:border-red-500 disabled:opacity-50 ${
            locked ? "cursor-not-allowed" : ""
          }`}
          value={searchValue || ""}
          disabled={disabled}
          readOnly={locked}
          onFocus={() => setIsOpen(true)}
          placeholder={`Select ${label}`}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
          <ArrowDown size={18} />
        </span>
      </div>
      {validationError && (
        <div className="text-red-500 text-sm mt-1">{validationError}</div>
      )}
      {isOpen && (
        <div className="absolute text-sm z-10 w-full mt-1 bg-gray-200 dark:bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-600">
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 capitalize ${
                searchValue.toLowerCase() === option.toLowerCase()
                  ? "text-red-500 font-bold"
                  : ""
              }`}
              onClick={() => {
                onSearchChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-2 text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1">
    <Info size={16} className="text-gray-500 cursor-help" />
    <div className="opacity-0 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 group-hover:opacity-100 transition-opacity duration-300 w-48 pointer-events-none">
      {text}
      <svg
        className="absolute text-gray-800 h-2 w-full left-0 top-full"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
      >
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </div>
  </div>
);
