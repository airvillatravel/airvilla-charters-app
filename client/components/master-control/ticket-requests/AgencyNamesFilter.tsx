"use client";

import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { fetchAllAgencyNamesForMaster } from "@/lib/data/masterTicketsData";
import { useAppDispatch } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { TicketRequestDataType } from "@/utils/definitions/masterDefinitions";
import { Check, ChevronDown } from "lucide-react";

export default function AgencyNamesFilter({
  filterData,
  setFilterData,
}: {
  filterData: TicketRequestDataType;
  setFilterData: React.Dispatch<React.SetStateAction<TicketRequestDataType>>;
}) {
  // State to hold the available options
  const [options, setOptions] = useState([
    {
      id: 0,
      value: "all",
    },
  ]);

  // State to hold the selected option
  const [selected, setSelected] = useState<number>(
    // Find the id of the selected option based on the selectedAgencyName
    options.find(
      (elm) =>
        elm.value.toLocaleLowerCase() ===
        filterData.agencyName.toLocaleLowerCase()
    )?.id ?? 0
  );

  // Update selected when filterData.agencyName changes
  useEffect(() => {
    const selectedOption = options.find(
      (elm) =>
        elm.value.toLocaleLowerCase() ===
        filterData.agencyName.toLocaleLowerCase()
    );
    setSelected(selectedOption?.id ?? 0);
  }, [filterData.agencyName, options]);

  // Redux dispatch function
  const dispatch = useAppDispatch();

  // State to track the loading state of fetching agency names
  const [isAgencyNameLoading, setIsAgencyNameLoading] = useState(false);

  // useEffect hook to fetch all agency names on component mount
  useEffect(() => {
    const fetchAllAgencyNames = async (): Promise<void> => {
      // Set the loading state to true
      setIsAgencyNameLoading(true);

      // Fetch all agency names for master
      const agencyData = await fetchAllAgencyNamesForMaster();

      // If the request is successful, update the options state
      if (agencyData.success) {
        // Map the agency names to options format and add them to the existing options
        const agencyNameList = agencyData.results.map(
          (agencyName: string, idx: number) => {
            return { id: idx + 1, value: agencyName };
          }
        );
        setOptions([...options, ...agencyNameList]);
      }
      // Dispatch the action to update the message state
      dispatch(
        setMsg({
          success: agencyData.success,
          message: agencyData.message,
        })
      );

      // Set the loading state to false
      setIsAgencyNameLoading(false);
    };

    // Call the fetchAllAgencyNames function on component mount
    fetchAllAgencyNames();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1 capitalize">
        Agency
      </label>
      <Menu as="div" className="relative inline-flex w-full">
        {({ open }) => (
          <>
            <Menu.Button
              className={`btn w-full justify-between min-w-[11rem] h-[45px] bg-gray-100 dark:bg-gray-700 hover:border-red-500 hover:ring-1 hover:ring-red-500 text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
              aria-label="Select option ${
                open ? "ring-1 ring-red-500 border-red-500" : ""
              }`}
            >
              <span className="flex items-center capitalize">
                {options[selected].value}
              </span>
              <ChevronDown
                className="text-gray-500 dark:text-gray-400 ml-3 shrink-0 mx-3 absolute top-3 right-0 pointer-events-none"
                size={20}
              />
            </Menu.Button>
            <Transition
              className="z-10 absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="font-medium text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none  custom-scrollbar">
                {options.map((option, optionIndex) => (
                  <Menu.Item key={optionIndex}>
                    {({ active }) => (
                      <button
                        className={`flex items-center justify-between w-full py-2 px-3 cursor-pointer capitalize ${
                          active ? "bg-gray-50 dark:bg-gray-700/20" : ""
                        } ${option.id === selected && "text-red-500"}`}
                        onClick={() => {
                          setSelected(option.id);
                          setFilterData({
                            ...filterData,
                            agencyName: option.value,
                          });
                        }}
                      >
                        {!isAgencyNameLoading ? (
                          <span>{option.value}</span>
                        ) : (
                          <span>Loading...</span>
                        )}
                        <Check
                          className={`shrink-0 mr-2 text-red-500 ${
                            option.id !== selected && "invisible"
                          }`}
                          size={20}
                        />
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
