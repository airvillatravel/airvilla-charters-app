import React, { useState } from "react";

const MyTicketsStatusTabs = ({
  tabs,
  selectedTicketTab,
  setSelectedTicketTab,
}: {
  tabs: string[];
  selectedTicketTab: string;
  setSelectedTicketTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {tabs.map((tab) => (
        <a
          key={tab}
          className={`cursor-pointer py-1 px-2 rounded capitalize ${
            selectedTicketTab === tab
              ? "bg-red-500 text-white"
              : "text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          href={`#${tab}`}
          onClick={() => setSelectedTicketTab(tab)}
        >
          {tab}
        </a>
      ))}
    </div>
  );
};

export default MyTicketsStatusTabs;
