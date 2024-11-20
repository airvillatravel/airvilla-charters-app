"use client";
import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { CreateSegmentFormTypes } from "@/utils/definitions/myTicketsDefinitions";

export default function SegmentAirportCode({
  segmentIndex,
  act,
}: {
  segmentIndex: number;
  act: string;
}) {
  const options = [
    {
      id: 0,
      airportCode: "AMM",
      city: "Amman",
      country: "Jordan",
      airport: "Queen Alia International Airport",
    },
    {
      id: 1,
      airportCode: "IST",
      city: "Istanbul",
      country: "Turkey",
      airport: "Istanbul Airport",
    },
    {
      id: 2,
      airportCode: "DAM",
      city: "Damascus",
      country: "Syria",
      airport: "Damascus International Airport",
    },
    {
      id: 3,
      airportCode: "BEY",
      city: "Beirut",
      country: "Lebanon",
      airport: "Beirut–Rafic Hariri International Airport",
    },
    {
      id: 4,
      airportCode: "DOH",
      city: "Doha",
      country: "Qatar",
      airport: "Hamad International Airport",
    },
    {
      id: 5,
      airportCode: "RUH",
      city: "Riyadh",
      country: "Saudi Arabia",
      airport: "King Khalid International Airport",
    },
    {
      id: 6,
      airportCode: "DXB",
      city: "Dubai",
      country: "United Arab Emirates",
      airport: "Dubai International Airport",
    },
    {
      id: 7,
      airportCode: "KWI",
      city: "Kuwait City",
      country: "Kuwait",
      airport: "Kuwait International Airport",
    },
    {
      id: 8,
      airportCode: "TLN",
      city: "Tallinn",
      country: "Estonia",
      airport: "Lennart Meri Tallinn Airport",
    },
    {
      id: 9,
      airportCode: "MCT",
      city: "Muscat",
      country: "Oman",
      airport: "Muscat International Airport",
    },
  ];
  // ############ STATES ##########
  const formData = useAppSelector(selectTicketForm);
  const segment = formData.segments[segmentIndex];
  const dispatch = useAppDispatch();

  // select the selected option
  const selectedElm = options.find(
    (elm) =>
      elm.airportCode.toLowerCase().trim() ===
      (act === "departure" || act === "arrival"
        ? segment[act].airportCode.toLowerCase().trim()
        : "")
  );

  const [selected, setSelected] = useState<number>(
    selectedElm ? selectedElm.id : 0
  );

  const handleSegmentLocationChange = (airportCode: string) => {
    // Update the form data with the modified segment
    const updatedFormData = {
      ...formData,
      segments: formData.segments.map(
        (seg: CreateSegmentFormTypes, i: number) =>
          i === segmentIndex && (act === "departure" || act === "arrival")
            ? {
                ...seg,
                [act]: {
                  ...seg[act],
                  airportCode: airportCode,
                },
              }
            : seg
      ),
    };

    // Dispatch the updated form state
    dispatch(updateTicketForm(updatedFormData));
  };

  const [value, setValue] = useState("");
  const active = false;
  return (
    <Menu as="div" className="relative inline-flex w-full">
      {/* {({ open }) => ( */}
      <>
        <Menu.Button
          className="btn w-full justify-between min-w-[11rem] bg-white dark:bg-transparent border-slate-500 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"
          aria-label="Select option"
        >
          <span className="flex items-center capitalize">
            <input
              className="bg-transparent border-hidden focus:ring-0 focus:ring-offset-0"
              value={value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setValue(event.target.value)
              }
              placeholder="Enter airport code"
            />
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
          // as={Fragment}
          className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-500 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
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
                {/* {({ active }) => ( */}
                <button
                  type="button"
                  className={`flex items-center justify-between text-sm md:text-base w-full py-2 px-3 cursor-pointer capitalize ${
                    active ? "bg-slate-50 dark:bg-slate-700/20" : ""
                  } ${option.id === selected && "text-red-500"}`}
                  onClick={() => {
                    setSelected(option.id);
                    handleSegmentLocationChange(option.airportCode);
                  }}
                >
                  <div className="text-start">
                    <div className="font-bold">{option.airport}</div>
                    <div className="text-xs md:text-sm text-slate-500">{`${option.city}, ${option.country}`}</div>
                  </div>

                  <div className="w-[3rem] flex-col items-center justify-center">
                    <div
                      className={`shrink-0 mr-2 fill-current capitalize w-full ${
                        option.id === selected && "text-red-500"
                      }`}
                    >
                      {option.airportCode}
                    </div>
                    <svg
                      className={`w-full shrink-0 mr-2 fill-current text-red-500 mt-1 ${
                        option.id !== selected && "invisible"
                      }`}
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                    >
                      <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                    </svg>
                  </div>
                </button>
                {/* )} */}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </>
      {/* )} */}
    </Menu>
  );
}
