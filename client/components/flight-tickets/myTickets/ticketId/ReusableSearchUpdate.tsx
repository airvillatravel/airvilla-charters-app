"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { airlineData, Airline } from "@/utils/data/CarrierData";
import { airportLocations, Location } from "@/utils/data/AirportLocationData";
import {
  CreateSegmentFormTypes,
  UserTicketResultType,
} from "@/utils/definitions/myTicketsDefinitions";
import {
  selectSingleTicket,
  setTicketUpdateData,
} from "@/redux/features/SingleTicketSlice";

type FieldType = "carrier" | "departure" | "arrival";

type OptionType = Airline | Location;

interface ReusableSearchUpdateProps {
  segmentIndex: number;
  fieldType: FieldType;
  validationError?: any;
}

export default function ReusableSearchUpdate({
  segmentIndex,
  fieldType,
  validationError,
}: ReusableSearchUpdateProps) {
  const dispatch = useAppDispatch();
  const ticket = useAppSelector(selectSingleTicket);
  const formData = ticket as UserTicketResultType;

  const [menuActive, setMenuActive] = useState(false);
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);

  // Initialize selected with the existing value from Redux store
  const [selected, setSelected] = useState<OptionType>(() => {
    const segment = formData.segments?.[segmentIndex];
    if (!segment) {
      return fieldType === "carrier"
        ? { id: "", airlineCode: "", airlineName: "", country: "" }
        : { id: "", airportCode: "", city: "", country: "", airport: "" };
    }

    if (fieldType === "carrier") {
      const carrierName = segment.carrier;
      return (
        airlineData.find((airline) => airline.airlineName === carrierName) || {
          id: "",
          airlineCode: "",
          airlineName: "",
          country: "",
        }
      );
    } else {
      const location = segment[fieldType];
      return {
        id: location?.airportCode || "",
        airportCode: location?.airportCode || "",
        city: location?.city || "",
        country: location?.country || "",
        airport: location?.airport || "",
      };
    }
  });

  const options = useMemo(() => {
    const lowercaseValue = value.trim().toLowerCase();

    if (fieldType === "carrier") {
      return value
        ? airlineData.filter((airline) =>
            [airline.airlineName, airline.airlineCode, airline.country]
              .map((field) => field.toLowerCase().trim())
              .some((field) => field.includes(lowercaseValue))
          )
        : airlineData;
    } else {
      if (!value) return airportLocations;

      return airportLocations
        .sort((a, b) => {
          const aCode = a.airportCode.toLowerCase();
          const bCode = b.airportCode.toLowerCase();

          if (aCode === lowercaseValue) return -1;
          if (bCode === lowercaseValue) return 1;

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
    }
  }, [value, fieldType]);

  const handleChange = useCallback(
    (selectedOption: OptionType) => {
      const updatedFormData = {
        ...formData,
        segments: formData.segments.map(
          (seg: CreateSegmentFormTypes, i: number) => {
            if (i === segmentIndex) {
              if (fieldType === "carrier") {
                return {
                  ...seg,
                  carrier: (selectedOption as Airline).airlineName,
                };
              } else {
                return {
                  ...seg,
                  [fieldType]: {
                    airportCode: (selectedOption as Location).airportCode,
                    country: (selectedOption as Location).country,
                    city: (selectedOption as Location).city,
                    airport: (selectedOption as Location).airport,
                  },
                };
              }
            }
            return seg;
          }
        ),
      };
      dispatch(setTicketUpdateData(updatedFormData));
    },
    [dispatch, formData, segmentIndex, fieldType]
  );

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !menuRef.current?.contains(event.target as Node) &&
      !(event.target instanceof HTMLInputElement)
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

  const getPlaceholder = () => {
    if (fieldType === "carrier") {
      return selected.id !== ""
        ? `${(selected as Airline).airlineName} (${
            (selected as Airline).airlineCode
          })`
        : "Search airline";
    } else {
      return selected.id !== ""
        ? `${(selected as Location).city} - ${
            (selected as Location).country
          } - ${(selected as Location).airport} (${
            (selected as Location).airportCode
          })
        `
        : "Search city";
    }
  };

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
              id={`${fieldType}-${segmentIndex}`}
              className="bg-transparent border-hidden focus:ring-0 focus:ring-offset-0 w-full text-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70"
              value={value}
              onClick={() => {
                setMenuActive(!menuActive);
                setValue("");
                setFocus(true);
              }}
              onBlur={() => setFocus(false)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue(event.target.value);
                setMenuActive(true);
              }}
              placeholder={getPlaceholder()}
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
                        fieldType === "carrier" ||
                        (fieldType === "departure" &&
                          (option as Location).airportCode !==
                            formData.segments[segmentIndex].arrival
                              .airportCode) ||
                        (fieldType === "arrival" &&
                          (option as Location).airportCode !==
                            formData.segments[segmentIndex].departure
                              .airportCode)
                      ) {
                        setSelected(option);
                        handleChange(option);
                        setValue("");
                        setMenuActive(false);
                      }
                    }}
                  >
                    <div className="text-start text-base">
                      <div className="font-bold">
                        {fieldType === "carrier"
                          ? (option as Airline).airlineName
                          : (option as Location).airport}
                      </div>
                      <div className="text-xs md:text-sm text-slate-500">
                        {fieldType === "carrier"
                          ? (option as Airline).country
                          : `${(option as Location).city}, ${
                              (option as Location).country
                            }`}
                      </div>
                    </div>
                    <div className="w-[3rem] flex-col items-center justify-center">
                      <div
                        className={`shrink-0 mr-2 fill-current capitalize w-full text-sm font-bold ${
                          option.id === selected.id && "text-red-500"
                        }`}
                      >
                        {fieldType === "carrier"
                          ? (option as Airline).airlineCode
                          : (option as Location).airportCode}
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

      {/* error validation */}
      {validationError?.[
        `segments.${segmentIndex}.${fieldType}.${
          fieldType === "carrier" ? "carrier" : "airportCode"
        }`
      ] && (
        <div className="text-[10px] mt-1 text-rose-500">
          {
            validationError[
              `segments.${segmentIndex}.${fieldType}.${
                fieldType === "carrier" ? "carrier" : "airportCode"
              }`
            ]
          }
        </div>
      )}
    </div>
  );
}
