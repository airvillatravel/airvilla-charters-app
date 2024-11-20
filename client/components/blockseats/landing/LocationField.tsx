"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { airportLocations, Location } from "@/utils/data/AirportLocationData";

export default function LocationField({
  segmentIndex,
  act,
  disabled,
  validationError,
  onChange,
  inputValue,
}: {
  segmentIndex: number;
  act: string;
  disabled: string;
  validationError: any;
  onChange: (newValue: Location) => void;
  inputValue: string;
}) {
  // ############### STATES ##############
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectTicketForm);

  const segment = formData.segments[segmentIndex];
  const [menuActive, setMenuActive] = useState(false); // menu dropdown toggle state
  const [value, setValue] = useState(inputValue);
  const [selected, setSelected] = useState<Location>({
    id: "-1",
    airportCode: "",
    city: "",
    country: "",
    airport: "",
  });
  const otherAction = act === "departure" ? "arrival" : "departure";
  const disabledOption = segment[otherAction].airportCode;
  const disabledCity = segment[otherAction].city;

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
      // Prevent setting the same city for both departure and arrival
      if (selectedLocation.airportCode === disabledOption) {
        console.error("Departure and Arrival cities cannot be the same.");
        return;
      }

      const updatedFormData = {
        ...formData,
        segments: formData.segments.map(
          (seg: (typeof formData.segments)[number], i: number) =>
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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !menuRef.current?.contains(event.target as Node) &&
      !(event.target instanceof HTMLInputElement)
    ) {
      setMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSelectAirport = (airport: Location) => {
    setSelected(airport); // update the selected option
    handleSegmentLocationChange(airport); // update the form state
    setValue(airport.airportCode); // reset the value
    setMenuActive(false); // stop showing the menu dropdown
    onChange(airport); //
  };

  return (
    <div>
      <div className="relative inline-flex w-full">
        <div
          className={`btn  w-full justify-between min-w-[11rem] h-[38px] border-slate-500 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-7 ${
            validationError ? "border-red-500 border-2" : ""
          } `}
        >
          <span className="flex-1 items-center capitalize">
            <input
              ref={inputRef}
              className="bg-transparent border-hidden focus:ring-0 focus:ring-offset-0 w-full dark:placeholder:text-slate-100 placeholder:text-slate-700 placeholder:text-sm"
              value={value}
              onClick={() => {
                setMenuActive(!menuActive);
                setValue("");
              }}
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
          <div className="z-20 absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-500 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1">
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
                    onClick={() => handleSelectAirport(option)}
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

      {/* error validation  */}
      {validationError?.[`segments.${segmentIndex}.${act}.airportCode`] && (
        <div className="text-[10px] mt-1 text-rose-500">
          {validationError[`segments.${segmentIndex}.${act}.airportCode`]}
        </div>
      )}
    </div>
  );
}
