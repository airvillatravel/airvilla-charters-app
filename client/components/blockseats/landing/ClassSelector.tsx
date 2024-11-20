import React from "react";

export const ClassSelector = ({
  travelClass,
  setTravelClass,
  error,
}: {
  travelClass: string;
  setTravelClass: (travelClass: string) => void;
  error?: string;
}) => (
  <div className="relative mb-6">
    <select
      value={travelClass}
      onChange={(e) => setTravelClass(e.target.value)}
      className="w-full capitalize bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white py-3 px-4 pr-8 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-red-600 hover:border-red-500"
    >
      <option value="" disabled hidden>
        Select Class
      </option>
      {["economy", "premium economy", "business class", "first class"].map(
        (travelClass) => (
          <option key={travelClass} value={travelClass} className="capitalize">
            {travelClass}
          </option>
        )
      )}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
