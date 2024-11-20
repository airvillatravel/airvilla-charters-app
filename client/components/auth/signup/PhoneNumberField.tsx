import { countryCodes } from "@/utils/data/countries";
import React, { useState, useEffect, useRef } from "react";

interface Country {
  name: string;
  code: string;
}

const PhoneNumberField = ({
  getPhoneNumber,
}: {
  getPhoneNumber: (pn: string) => void;
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredCountries = countryCodes.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target !== null &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");
    const pn = `${country.code}${phoneNumber}`;
    getPhoneNumber(pn);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const pn = `${selectedCountry.code}${input}`;
    getPhoneNumber(pn);
    setPhoneNumber(input);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="">
      <div
        className={`flex items-center border ${
          isFocused ? "ring-2 ring-red-500 border-red-500" : ""
        } rounded-lg w-full bg-gray-300 dark:bg-gray-600 transition-all duration-300`}
      >
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between w-full pr-2 py-1 px-4 text-xs font-medium  rounded-s-lg focus:outline-none dark:text-white dark:hover:bg-gray-600 ${
              isFocused ? "ring-0" : ""
            }`}
            type="button"
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {selectedCountry.code}
            <svg
              className="w-2 h-2 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 w-64 mt-1 rounded-lg shadow bg-white dark:bg-gray-700">
              <div className="p-1">
                <input
                  type="text"
                  className="w-full p-1 text-xs text-gray-900 border rounded-lg  focus:ring-red-500 focus:border-red-500 dark:bg-gray-600  placeholder-gray-400 dark:text-white"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ul className="overflow-y-auto max-h-60 text-xs dark:text-gray-200 custom-scrollbar">
                {filteredCountries.map((country, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      className={`inline-flex w-full px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white ${
                        selectedCountry.code === country.code
                          ? "bg-red-500 text-white"
                          : ""
                      }`}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.name} ({country.code})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative w-full">
          <input
            type="tel"
            id="phone-input"
            className={`block pr-2 py-1.5 w-full text-xs  rounded-e-lg border-0 focus:ring-red-500 focus:border-red-500 bg-gray-300 dark:bg-gray-600 dark:text-white ${
              isFocused ? "ring-0" : ""
            }`}
            placeholder="1234567890"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberField;
