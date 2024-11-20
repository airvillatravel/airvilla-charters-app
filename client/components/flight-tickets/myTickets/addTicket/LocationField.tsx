"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { airportLocations, Location } from "@/utils/data/AirportLocationData";
import { CreateSegmentFormTypes } from "@/utils/definitions/myTicketsDefinitions";

export default function LocationField({
  segmentIndex,
  act,
}: {
  segmentIndex: number;
  act: string;
}) {
  // ############### STATES ##############
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectTicketForm);

  const [focus, setFocus] = useState(false);


  const [menuActive, setMenuActive] = useState(false); // menu dropdown toggle state
  const [value, setValue] = useState(""); // input value
  const [selected, setSelected] = useState<Location>({
    id: "",
    airportCode: "",
    city: "",
    country: "",
    airport: "",
  });

  // filter the locations according to the input value
  const options = useMemo(() => {
    if (!value) return airportLocations;

    const lowercaseValue = value.trim().toLowerCase();

    return airportLocations
      .sort((a, b) => {
        const aCode = a.airportCode.toLowerCase();
        const bCode = b.airportCode.toLowerCase();

        // Exact match for airport code
        if (aCode === lowercaseValue) return -1;
        if (bCode === lowercaseValue) return 1;

        // Starts with for airport code
        if (
          aCode.startsWith(lowercaseValue) &&
          !bCode.startsWith(lowercaseValue)
        )
          return -1;
        if (
          bCode.startsWith(lowercaseValue) &&
          !aCode.startsWith(lowercaseValue)
        )
          return 1;

        // Check other fields
        const aMatch = [a.airport, a.country, a.city].some((field) =>
          field.toLowerCase().includes(lowercaseValue)
        );
        const bMatch = [b.airport, b.country, b.city].some((field) =>
          field.toLowerCase().includes(lowercaseValue)
        );

        if (aMatch && !bMatch) return -1;
        if (bMatch && !aMatch) return 1;

        return 0;
      })
      .filter((location) =>
        [
          location.airport,
          location.airportCode,
          location.country,
          location.city,
        ].some((field) => field.toLowerCase().includes(lowercaseValue))
      );
  }, [value]);

  // update the form state from selected option
  const handleSegmentLocationChange = useCallback(
    (selectedLocation: Location) => {
      const updatedFormData = {
        ...formData,
        segments: formData.segments.map(
          (seg: CreateSegmentFormTypes, i: number) =>
            i === segmentIndex && (act === "departure" || act === "arrival")
              ? {
                  ...seg,
                  [act]: {
                    airportCode: selectedLocation.airportCode,
                    country: selectedLocation.country,
                    city: selectedLocation.city,
                    airport: selectedLocation.airport,
                  },
                }
              : seg
        ),
      };
      dispatch(updateTicketForm(updatedFormData));
    },
    [dispatch, formData, segmentIndex, act]
  );

  const menuRef = useRef<HTMLDivElement>(null);
  // const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !menuRef.current?.contains(event.target as Node) &&
      !(
        (event.target instanceof HTMLInputElement)
        // inputRef.current?.contains(event.target)
      )
    ) {
      setMenuActive(false);
      setValue("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="relative inline-flex w-full">
        <div
          className={`w-full border-0 min-w-[11rem] flex items-center justify-between bg-gray-50 dark:bg-gray-600 rounded-lg h-[40px] pr-3 shadow dark:shadow-inner ${
            focus && "ring-2 ring-red-500"
          } focus:outline-none transition-all duration-300 no-arrows`}
        >
          <span className="flex-1 items-center capitalize">
            <input
              className="bg-transparent border-hidden focus:ring-0 focus:ring-offset-0 w-full text-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70"
              value={value}
              onClick={() => {
                setMenuActive(!menuActive);
                setValue("");
                setFocus(true);
              }}
              onBlur={() => setFocus(false)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                setValue(newValue); // update the value
                setMenuActive(true); // show the menu dropdown
              }}
              placeholder={
                selected.airportCode === ""
                  ? "Search city"
                  : selected.airportCode
              }
            />
          </span>
          <svg
            className="shrink-0 ml-1 fill-current text-slate-400"
            width="11"
            height="7"
            viewBox="0 0 11 7"
            onClick={() => {
              setMenuActive(!menuActive);
              setValue("");
            }}
          >
            <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
          </svg>
        </div>
        {menuActive && (
          <div className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-500 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1">
            <div className="font-medium text-sm text-slate-600 dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700 focus:outline-none max-h-40 overflow-auto">
              {options.length === 0 && (
                <div className="text-center py-3">
                  <span>No Results</span>
                </div>
              )}
              {options.length > 0 &&
                options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`flex items-center justify-between text-sm md:text-base w-full py-2 px-3 cursor-pointer capitalize ${
                      option.id === selected.id && "text-red-500"
                    }`}
                    onClick={() => {
                      if (
                        (act === "departure" &&
                          option.airportCode !==
                            formData.segments[segmentIndex].arrival
                              .airportCode) ||
                        (act === "arrival" &&
                          option.airportCode !==
                            formData.segments[segmentIndex].departure
                              .airportCode)
                      ) {
                        setSelected(option); // update the selected option
                        handleSegmentLocationChange(option); // update the for state
                        setValue(""); // reset the value
                        setMenuActive(false); // stop showing the menu dropdown
                      }
                    }}
                  >
                    <div className="text-start text-base">
                      <div className="font-bold">{option.airport}</div>
                      <div className="text-xs md:text-sm text-slate-500">{`${option.city}, ${option.country}`}</div>
                    </div>
                    <div className="w-[3rem] flex-col items-center justify-center">
                      <div
                        className={`shrink-0 mr-2 fill-current capitalize w-full text-sm font-bold ${
                          option.id === selected.id && "text-red-500"
                        }`}
                      >
                        {option.airportCode}
                      </div>
                      <svg
                        className={`w-full shrink-0 mr-2 fill-current text-red-500 mt-1 ${
                          option.id !== selected.id && "invisible"
                        }`}
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                      >
                        <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                      </svg>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
