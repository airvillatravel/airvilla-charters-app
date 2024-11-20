"use client";
import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { SignupFormDataTypes } from "@/utils/definitions/authDefinitions";

export default function SelectedDropdown({
  options,
  value,
  onSelect,
}: {
  options: { id: number; value: string }[];
  value: string;
  onSelect: (value: string) => void;
}) {
  // select the selected option
  const selectedNat = options.find(
    (elm) => elm.value.toLowerCase().trim() === value.toLowerCase().trim()
  );

  const [selected, setSelected] = useState<number>(
    selectedNat ? selectedNat.id : 0
  );

  return (
    <Menu as="div" className="relative inline-flex w-full">
      {({ open }) => (
        <>
          <Menu.Button
            className="btn w-full justify-between min-w-[11rem] bg-white dark:bg-slate-900/30 border-slate-500 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"
            aria-label="Select option"
          >
            <span className="flex items-center capitalize">
              <span>{options[selected].value}</span>
            </span>
            <svg
              className="shrink-0 ml-1 fill-current text-slate-400"
              width="11"
              height="7"
              viewBox="0 0 11 7"
            >
              <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
            </svg>
          </Menu.Button>
          <Transition
            className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-900 border border-slate-500 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="font-medium text-sm text-slate-600 dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700 focus:outline-none max-h-40 overflow-auto">
              {options.map((option, optionIndex) => (
                <Menu.Item key={optionIndex}>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`flex items-center justify-between w-full py-2 px-3 cursor-pointer capitalize ${
                        active ? "bg-slate-50 dark:bg-slate-700/20" : ""
                      } ${option.id === selected && "text-red-500"}`}
                      onClick={() => {
                        setSelected(option.id);
                        onSelect(option.value);
                      }}
                    >
                      <span>{option.value}</span>
                      <svg
                        className={`shrink-0 mr-2 fill-current text-red-500 ${
                          option.id !== selected && "invisible"
                        }`}
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                      >
                        <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                      </svg>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
