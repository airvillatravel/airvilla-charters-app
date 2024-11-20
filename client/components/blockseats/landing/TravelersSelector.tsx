import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TravelersDropdown } from "./TravelersDropdown";

export const TravelersSelector = ({
  travelers,
  setTravelers,
  error,
}: {
  travelers: { adults: number; children: number; infants: number };
  setTravelers: (travelers: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-6">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white py-3 px-4 pr-8 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-red-600 cursor-pointer flex justify-between items-center border border-gray-500 dark:border-gray-500"
      >
        <span>Select Travelers</span>
        <ChevronDown className="text-gray-400" size={20} />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <TravelersDropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        travelers={travelers}
        setTravelers={setTravelers}
      />
    </div>
  );
};
