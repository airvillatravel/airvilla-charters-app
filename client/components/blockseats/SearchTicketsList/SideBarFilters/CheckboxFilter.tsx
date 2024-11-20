import React, { useState } from "react";
import { CheckboxFilterProps } from "@/utils/definitions/blockseatsDefinitions";

export const CheckboxFilter = ({
  filters,
  selectedFilters,
  onFilterChange,
}: CheckboxFilterProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleFilters = showAll ? filters : filters.slice(0, 4);

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <>
      {visibleFilters.map(({ label, count }, index) => (
        <div key={index} className="flex justify-between items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={label}
              name="filter"
              checked={selectedFilters.has(label)}
              onChange={() => onFilterChange(label)}
              className="form-checkbox h-5 w-5 text-red-600 dark:text-red-500 bg-gray-300 dark:bg-gray-600 checked:bg-red-500 checked:dark:bg-red-600"
            />
            <span className="text-gray-600 dark:text-gray-400 break-words">
              {label}
            </span>
          </label>
          {count && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({count})
            </span>
          )}
        </div>
      ))}
      {filters.length > 4 && (
        <button
          type="button"
          className="text-red-600 dark:text-red-500"
          onClick={toggleShowAll}
        >
          {showAll ? "See less" : "See more"}
        </button>
      )}
    </>
  );
};
