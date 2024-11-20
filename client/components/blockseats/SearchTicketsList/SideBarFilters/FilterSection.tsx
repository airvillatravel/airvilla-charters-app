import React from "react";
import { FilterSectionProps } from "@/utils/definitions/blockseatsDefinitions";

export const FilterSection = ({
  title,
  className,
  children,
}: FilterSectionProps) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-none ${className}`}
    >
      <h6 className="mb-2 text-gray-900 dark:text-gray-100 font-inter font-bold leading-5">
        {title}
      </h6>
      <div className="space-y-2">{children}</div>
    </div>
  );
};
