import Flatpickr from "react-flatpickr";
import nationalities from "@/utils/nationalities.json";
import countries from "@/utils/countries.json";
import { travelerFormValidation } from "@/utils/validators/travelerFormValiditions";
import { Traveler, Errors } from "@/utils/definitions/blockseatsDefinitions";
import { useCallback, useState } from "react";

export const TravelerForm = ({
  travelerNumber,
  traveler,
  onUpdate,
}: {
  travelerNumber: number;
  traveler: Traveler;
  onUpdate: (updatedTraveler: Traveler) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const validateForm = useCallback(() => {
    let isValid = true;
    const updatedTravelers = [traveler].map((traveler) => {
      const { errors, ...travelerData } = traveler;
      const { error } = travelerFormValidation.validate(travelerData, {
        abortEarly: false,
      });

      const newErrors: Errors = {};
      if (error) {
        error.details.forEach((detail) => {
          newErrors[detail.path[0]] = detail.message;
        });
        isValid = false;
      }

      return { ...traveler, errors: newErrors };
    });

    return isValid;
  }, [traveler]);

  const handleInputChange = useCallback(
    (field: keyof Traveler, value: string) => {
      const updatedTraveler = { ...traveler, [field]: value };

      const errorMessage = validateForm();

      if (!errorMessage) {
        delete updatedTraveler.errors[field];
      }
      onUpdate(updatedTraveler);
    },
    [traveler, onUpdate, validateForm]
  );

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-4 bg-gray-100 dark:bg-gray-900 p-1 px-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Traveler {travelerNumber}
        </h3>
        <div className="flex items-end justify-center">
          <button onClick={toggleAccordion} className="relative w-3 h-3 mx-4">
            <span
              className={`absolute top-1/2 left-0 w-full h-0.5 bg-gray-500 dark:bg-gray-300 transition-transform duration-500 transform -translate-y-1/2 ${
                isOpen ? "rotate-0" : "rotate-0"
              }`}
            ></span>
            <span
              className={`absolute top-0 left-1/2 w-0.5 h-full bg-gray-500 dark:bg-gray-300 transition-transform duration-500 transform origin-center -translate-x-1/2 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            ></span>
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-max-height duration-1000 ${
          isOpen ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
            {/* Title */}
            <div>
              <label
                htmlFor={`title_${travelerNumber}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title {travelerNumber === 1 ? "" : travelerNumber}
              </label>
              <select
                id={`title_${travelerNumber}`}
                name={`title_${travelerNumber}`}
                className="w-full p-2 focus:border-red-500 focus:outline-none focus:ring-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:border-red-500 border-none"
              >
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
              </select>
            </div>
            {/* Full Name */}
            <div>
              <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap md:space-x-2">
                <div className="w-full">
                  <label
                    htmlFor={`first_name_${travelerNumber}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    First Name {travelerNumber === 1 ? "" : travelerNumber}
                  </label>
                  <input
                    id={`first_name_${travelerNumber}`}
                    name={`first_name_${travelerNumber}`}
                    autoComplete="given-name"
                    autoCorrect="true"
                    autoCapitalize="true"
                    placeholder="First name"
                    required
                    aria-label="First name"
                    aria-required="true"
                    type="text"
                    pattern="[A-Za-z\s]+"
                    title="Please enter your first name using letters only."
                    maxLength={50}
                    spellCheck="true"
                    value={traveler.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full flex-1 p-2 border-none ${
                      traveler.errors.firstName ? "border-red-500" : ""
                    } focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`}
                  />
                  {traveler.errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {traveler.errors.firstName}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`last_name_${travelerNumber}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Last Name {travelerNumber === 1 ? "" : travelerNumber}
                  </label>
                  <input
                    id={`last_name_${travelerNumber}`}
                    name={`last_name_${travelerNumber}`}
                    autoComplete="family-name"
                    autoCorrect="true"
                    autoCapitalize="true"
                    required
                    aria-label="Last name"
                    aria-required="true"
                    type="text"
                    pattern="[A-Za-z\s]+"
                    title="Please enter your last name using letters only."
                    maxLength={50}
                    spellCheck="true"
                    placeholder="Last name"
                    value={traveler.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full flex-1 p-2 border-none ${
                      traveler.errors.lastName ? "border-red-500" : ""
                    } focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white mt-2 md:mt-0 space-x-0`}
                  />
                  {traveler.errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {traveler.errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Date of Birth */}
            <div className="relative">
              <label
                htmlFor={`date_of_birth_${travelerNumber}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date of Birth {travelerNumber === 1 ? "" : travelerNumber}
              </label>
              <div className="relative">
                <Flatpickr
                  id={`date_of_birth_${travelerNumber}`}
                  name={`date_of_birth_${travelerNumber}`}
                  required
                  aria-label="Date of Birth"
                  aria-required="true"
                  title="Please select your date of birth."
                  type="text"
                  readOnly
                  options={{ disableMobile: true }}
                  placeholder="Date of Birth"
                  value={traveler.dateOfBirth}
                  onChange={([date]) =>
                    handleInputChange(
                      "dateOfBirth",
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  className={`w-full p-2 border-none pl-9 ${
                    traveler.errors.dateOfBirth ? "border-red-500" : ""
                  } focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`}
                />
                <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
                  </svg>
                </div>
              </div>
              {traveler.errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {traveler.errors.dateOfBirth}
                </p>
              )}
            </div>
            {/* Nationality */}
            <div>
              <label
                htmlFor={`nationality_${travelerNumber}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nationality {travelerNumber === 1 ? "" : travelerNumber}
              </label>
              <select
                id={`nationality_${travelerNumber}`}
                name={`nationality_${travelerNumber}`}
                required
                aria-label="Nationality"
                aria-required="true"
                title="Please select your nationality."
                value={traveler.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                className={`w-full p-2 border-none ${
                  traveler.errors.nationality ? "border-red-500" : ""
                } focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`}
              >
                <option value="">Select Nationality</option>
                {nationalities.map((nationality, index) => (
                  <option key={index} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </select>
              {traveler.errors.nationality && (
                <p className="text-red-500 text-xs mt-1">
                  {traveler.errors.nationality}
                </p>
              )}
            </div>
            {/* Passport Number */}
            <div>
              <label
                htmlFor={`passport_number_${travelerNumber}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Passport Number {travelerNumber === 1 ? "" : travelerNumber}
              </label>
              <input
                id={`passport_number_${travelerNumber}`}
                name={`passport_number_${travelerNumber}`}
                required
                aria-label="Passport Number"
                aria-required="true"
                title="Please select your passport number."
                placeholder="Enter passport number"
                type="text"
                value={traveler.passportNumber}
                onChange={(e) =>
                  handleInputChange("passportNumber", e.target.value)
                }
                className={`w-full p-2 border-none ${
                  traveler.errors.passportNumber ? "border-red-500" : ""
                } focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`}
              />
              {traveler.errors.passportNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {traveler.errors.passportNumber}
                </p>
              )}
            </div>
            {/* Passport Issuing Country */}
            <div>
              <label
                htmlFor={`passport_issuing_country_${travelerNumber}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Passport Issuing Country{" "}
                {travelerNumber === 1 ? "" : travelerNumber}
              </label>
              <select
                id={`passport_issuing_country_${travelerNumber}`}
                name={`passport_issuing_country_${travelerNumber}`}
                required
                aria-label="Passport Issuing Country"
                aria-required="true"
                title="Please select your passport issuing country."
                value={traveler.passportIssuingCountry}
                onChange={(e) =>
                  handleInputChange("passportIssuingCountry", e.target.value)
                }
                className={`w-full p-2 border-none ${
                  traveler.errors.passportIssuingCountry ? "border-red-500" : ""
                } focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`}
              >
                <option value="">Select your passport issuing country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {traveler.errors.passportIssuingCountry && (
                <p className="text-red-500 text-xs mt-1">
                  {traveler.errors.passportIssuingCountry}
                </p>
              )}
            </div>
            {/* Passport Expiry */}
            <div>
              <label
                htmlFor={`passport_expiry_${travelerNumber}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Passport Expiry {travelerNumber === 1 ? "" : travelerNumber}
              </label>
              <div className="relative">
                <Flatpickr
                  id={`passport_expiry_${travelerNumber}`}
                  name={`passport_expiry_${travelerNumber}`}
                  required
                  aria-label="Passport Expiry"
                  aria-required="true"
                  title="Please select your passport expiry date."
                  type="text"
                  readOnly
                  options={{ disableMobile: true }}
                  placeholder="Passport Expiry"
                  value={traveler.passportExpiry}
                  onChange={([date]) =>
                    handleInputChange(
                      "passportExpiry",
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  className={`w-full p-2 border-none pl-9  ${
                    traveler.errors.passportExpiry ? "border-red-500" : ""
                  }  focus:border-red-500 focus:outline-none focus:ring-red-500 hover:border-red-500 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white`}
                />
                <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
                  </svg>
                </div>
              </div>
              {traveler.errors.passportExpiry && (
                <p className="text-red-500 text-xs mt-1">
                  {traveler.errors.passportExpiry}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
