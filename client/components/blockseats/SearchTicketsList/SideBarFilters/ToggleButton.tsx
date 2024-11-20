import React, { useState } from "react";
import { ToggleButtonProps } from "@/utils/definitions/blockseatsDefinitions";

export const ToggleButton = ({
  label,
  isChecked,
  onChange,
}: ToggleButtonProps) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`px-2 py-2 rounded-lg ${
        isChecked
          ? "text-red-500 bg-red-200 dark:bg-red-400/15 border border-red-800"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      }`}
    >
      {label}
    </button>
  );
};
