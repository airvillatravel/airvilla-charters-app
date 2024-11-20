"use client";

import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { TicketRequestDataType } from "@/utils/definitions/masterDefinitions";
import { Calendar, Check, ChevronDown } from "lucide-react";

export default function IssuedDateFilterMaster({
  filterData,
  setFilterData,
}: {
  filterData: TicketRequestDataType;
  setFilterData: React.Dispatch<React.SetStateAction<TicketRequestDataType>>;
}) {
  const options = [
    {
      id: 0,
      period: "Today",
    },
    {
      id: 1,
      period: "Last 7 Days",
    },
    {
      id: 2,
      period: "Last Month",
    },
    {
      id: 3,
      period: "Last 12 Months",
    },
    {
      id: 4,
      period: "All Time",
    },
  ];

  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    const selectedElm = options.find(
      (elm) =>
        elm.period.toLowerCase().trim() ===
        filterData.createdTimeFilter.toLowerCase().trim()
    );
    setSelected(selectedElm ? selectedElm.id : 0);
  }, [filterData.createdTimeFilter]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1 capitalize text-gray-600 dark:text-gray-400">
        Issued Date
      </label>
      <Menu as="div" className="relative flex w-full">
        {({ open }) => (
          <>
            <Menu.Button
              className={`btn w-full justify-between min-w-[11rem] h-[45px] bg-gray-100 dark:bg-gray-700 dark:border-gray-700 hover:ring-1 hover:ring-red-500 hover:border-red-500 text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200 ${
                open ? "ring-1 ring-red-500 border-red-500" : ""
              }`}
              aria-label="Select date range"
            >
              {options[selected].period}
              <ChevronDown
                className="text-gray-500 dark:text-gray-400 ml-3 shrink-0 mx-3 absolute top-3 right-0 pointer-events-none"
                size={20}
              />
            </Menu.Button>
            <Transition
              className="z-10 absolute top-full right-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="font-medium text-sm text-gray-600 dark:text-gray-300 focus:outline-none divide-y-2 divide-gray-200/50 dark:divide-gray-700/50">
                {options.map((option, optionIndex) => (
                  <Menu.Item key={optionIndex}>
                    {({ active }) => (
                      <button
                        className={`flex items-center w-full py-1 px-3 cursor-pointer ${
                          active ? "bg-gray-50 dark:bg-gray-700/20" : ""
                        } ${option.id === selected && "text-red-500"}`}
                        onClick={() => {
                          setSelected(option.id);
                          setFilterData({
                            ...filterData,
                            createdTimeFilter:
                              option.period.toLocaleLowerCase(),
                          });
                        }}
                      >
                        <Check
                          className={`shrink-0 mr-2 text-red-500 ${
                            option.id !== selected && "invisible"
                          }`}
                          size={20}
                        />
                        <span>{option.period}</span>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
