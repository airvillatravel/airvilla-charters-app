import React from "react";
import { HeaderProps } from "@/utils/definitions/blockseatsDefinitions";

export const Header = ({ onClose }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-700 shadow-lg flex justify-between items-center p-4 xl:hidden">
      <h5 className="text-lg font-medium">Advance Filters</h5>
      <button
        type="button"
        className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 bg-red-500 p-2 text-center rounded-lg"
        aria-label="Close"
        onClick={onClose}
      >
        <div className="sr-only">Close</div>
        <svg className="w-4 h-4 currentColor">
          <path
            fill="#fff"
            d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"
          />
        </svg>
      </button>
    </div>
  );
};
