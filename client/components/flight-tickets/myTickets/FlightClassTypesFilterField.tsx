"use client";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FilterFormDataType } from "@/utils/definitions/myTicketsDefinitions";
import { Check, ChevronDown } from "lucide-react";

export default function FlightClassTypesFilterField({
  filterFormData,
  setFilterFormData,
}: // validationError,
{
  filterFormData: FilterFormDataType;
  setFilterFormData: React.Dispatch<React.SetStateAction<FilterFormDataType>>;
  // validationError: any;
}) {
  const options = [
    { id: 0, value: "" },
    { id: 1, value: "economy" },
    { id: 2, value: "premium economy" },
    { id: 3, value: "business class" },
    { id: 4, value: "first class" },
  ];

  // ############ STATES ##########
  // select the selected option

  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    const selectedElm = options.find(
      (elm) =>
        elm.value.toLowerCase().trim() ===
        filterFormData.flightClassType.toLowerCase().trim()
    );
    setSelected(selectedElm ? selectedElm.id : 0);
  }, [filterFormData.flightClassType]);
  return (
    <>
      <label className="block text-sm font-medium mb-1 capitalize  text-gray-600 dark:text-gray-400">
        Flight Class
      </label>
      <Menu as="div" className="relative inline-flex w-full">
        {({ open }) => (
          <>
            <Menu.Button
              className={`btn w-full justify-between min-w-[11rem] h-[45px] bg-gray-100 dark:bg-gray-700 hover:border-red-500 hover:ring-2 hover:ring-red-500  dark:hover:border-gray-600 text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
              aria-label="Select option ${
                open ? "ring-1 ring-red-500 border-red-500" : ""
              }`}
            >
              <span className="flex items-center capitalize">
                {options[selected].value !== ""
                  ? options[selected].value
                  : "Select Flight Class"}
              </span>
              <ChevronDown
                className="text-gray-500 dark:text-gray-400 ml-3"
                size={20}
              />
            </Menu.Button>
            <Transition
              className="z-20 absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="font-medium text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none max-h-40 overflow-auto custom-scrollbar">
                {options.map((option, optionIndex) => (
                  <Menu.Item key={optionIndex}>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`flex items-center justify-between w-full py-2 px-3 cursor-pointer capitalize ${
                          active ? "bg-gray-50 dark:bg-gray-700" : ""
                        } ${option.id === selected && "text-red-500"}`}
                        onClick={() => {
                          setSelected(option.id);
                          setFilterFormData({
                            ...filterFormData,
                            flightClassType: option.value,
                          });
                        }}
                      >
                        <span>{option.value}</span>
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
    </>
  );
}
