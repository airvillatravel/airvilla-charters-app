import React from "react";

const MasterUsersTab = ({
  tabs,
  selectedTab,
  setSelectedTab,
}: {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div>
      {/* Start */}
      <div className="relative mb-8 capitalize">
        <div
          className="absolute bottom-0 w-full h-px bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        ></div>
        <ul className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
          {tabs.map((tab) => (
            <li
              key={tab}
              className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
            >
              <a
                className={`block pb-3 whitespace-nowrap  ${
                  selectedTab === tab
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-slate-500"
                }`}
                href={`#${tab}`}
                onClick={() => setSelectedTab(tab)} // Update selected tab on click
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* End */}
    </div>
  );
};

export default MasterUsersTab;
