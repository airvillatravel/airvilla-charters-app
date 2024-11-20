import { Calendar } from "lucide-react";
import OneWayDateLanding from "./OneWayDateLanding";
import RoundTripDateLanding from "./RoundTripDateLanding";

export const DateSelector = ({
  label,
  itinerary,
  departureDateError,
  returnDateError,
  handleDateChange,
  error,
  initialDates,
}: {
  label: string;
  itinerary: string;
  departureDateError?: string;
  returnDateError?: string;
  handleDateChange: (dates: {
    flightDate: string;
    returnDate: string | null;
  }) => void;
  error?: string;
  initialDates: {
    flightDate: string | null;
    returnDate: string | null;
  };
}) => (
  <div className="relative mb-6">
    <div
      className={`bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-4
                  ${error ? "border-red-500 border-2" : ""}
  
        `}
    >
      <label className="flex items-center space-x-3 mb-2">
        <Calendar className="text-gray-400" size={20} />
        <span>{label}</span>
      </label>
      {itinerary === "one way" ? (
        <OneWayDateLanding
          align="left"
          onDateChange={handleDateChange}
          initialDate={initialDates.flightDate}
        />
      ) : (
        <RoundTripDateLanding
          align="left"
          onDateChange={handleDateChange}
          initialDates={initialDates}
        />
      )}
    </div>
    {departureDateError && (
      <p className="text-red-500 text-sm">{departureDateError}</p>
    )}

    {returnDateError && (
      <p className="text-red-500 text-sm mt-1">{returnDateError}</p>
    )}
  </div>
);
