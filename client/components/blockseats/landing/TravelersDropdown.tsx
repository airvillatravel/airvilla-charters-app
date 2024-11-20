import { ChevronDown, ChevronUp } from "lucide-react";

export const TravelersDropdown = ({
  isOpen,
  setIsOpen,
  travelers,
  setTravelers,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  travelers: { adults: number; children: number; infants: number };
  setTravelers: (travelers: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
}) => {
  const maxLimits = {
    adults: 9,
    children: 5,
    infants: 4,
  };

  const getTotalTravelers = () =>
    travelers.adults + travelers.children + travelers.infants;

  const incrementTraveler = (type: "adults" | "children" | "infants") => {
    const totalTravelers = getTotalTravelers();
    if (totalTravelers < 9 && travelers[type] < maxLimits[type]) {
      setTravelers({ ...travelers, [type]: travelers[type] + 1 });
    }
  };

  const decrementTraveler = (type: "adults" | "children" | "infants") => {
    if (
      (type === "adults" && travelers[type] > 1) ||
      (type !== "adults" && travelers[type] > 0)
    ) {
      setTravelers({ ...travelers, [type]: Math.max(0, travelers[type] - 1) });
    }
  };

  return (
    <div
      className={`absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 border border-gray-300 dark:border-gray-500 ${
        isOpen ? "block" : "hidden"
      } dark:bg-gray-800`}
    >
      <div className="p-4">
        {Object.keys(travelers).map((type) => (
          <div key={type} className="flex justify-between items-center py-2">
            <span className="text-gray-700 dark:text-white capitalize">
              {type}
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() =>
                  decrementTraveler(type as "adults" | "children" | "infants")
                }
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <ChevronDown size={16} />
              </button>
              <span className="text-gray-700 dark:text-white">
                {travelers[type as "adults" | "children" | "infants"]}
              </span>
              <button
                type="button"
                onClick={() =>
                  incrementTraveler(type as "adults" | "children" | "infants")
                }
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg"
        >
          Done
        </button>
      </div>
    </div>
  );
};
