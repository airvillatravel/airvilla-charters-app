import { TicketRequestDataType } from "@/utils/definitions/masterDefinitions";
import React, { useState } from "react";

export default function TicketRequestStatusTabs({
  selectedTicketTab,
  setSelectedTicketTab,
}: {
  selectedTicketTab: string;
  setSelectedTicketTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const tabs = ["pending", "updated"];
  return (
    <div className="flex items-center space-x-2 text-sm">
      {tabs.map((tab) => (
        <a
          key={tab}
          className={`cursor-pointer py-1 px-2 rounded capitalize  ${
            selectedTicketTab === tab
              ? "bg-red-500 text-white"
              : "text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          href={`#${tab}`}
          onClick={() => setSelectedTicketTab(tab)} // Update selected tab on click
        >
          {tab}
        </a>
      ))}
    </div>
  );
}
