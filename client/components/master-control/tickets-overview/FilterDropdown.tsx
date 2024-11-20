"use client";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export default function FilterClassDropdown({
  fieldName,
  options,
  selectedOption,
  onChangeHandler,
}: {
  fieldName: string;
  options: { id: number; value: string }[];
  selectedOption: string;
  onChangeHandler: (flightClass: string) => void;
}) {
  // ############ STATES ##########
  // select the selected option

  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    const selectedElm = options.find(
      (elm) =>
        elm.value?.toLowerCase().trim() === selectedOption?.toLowerCase().trim()
    );
    setSelected(selectedElm ? selectedElm.id : 0);
  }, [selectedOption]);
  return (
    <>
      <label className="block text-sm font-medium mb-1 capitalize">
        {fieldName}
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
                <span className="absolute left-3 top-3">
                  {options[selected].value !== ""
                    ? options[selected].value
                    : `Select ${fieldName}`}
                </span>
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
              <Menu.Items className="font-medium text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none max-h-40 overflow-auto custom-scrollbar">
                {options.map((option, optionIndex) => (
                  <Menu.Item key={optionIndex}>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`flex items-center justify-between w-full py-2 px-3 cursor-pointer capitalize ${
                          active ? "bg-gray-50 dark:bg-gray-700/20" : ""
                        } ${option.id === selected && "text-red-500"}`}
                        onClick={() => {
                          setSelected(option.id);
                          onChangeHandler(option.value);
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
