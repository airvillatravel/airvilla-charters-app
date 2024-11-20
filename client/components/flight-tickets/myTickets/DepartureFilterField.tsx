"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { airportLocations, Location } from "@/utils/data/AirportLocationData";
import { FilterFormDataType } from "@/utils/definitions/myTicketsDefinitions";
import { Check, ChevronDown } from "lucide-react";

export default function DepartureFilterField({
  filterFormData,
  setFilterFormData,
}: // validationError,
{
  filterFormData: FilterFormDataType;
  setFilterFormData: React.Dispatch<React.SetStateAction<FilterFormDataType>>;
  // validationError: any;
}) {
  // ############### STATES ##############

  const [menuActive, setMenuActive] = useState(false); // menu dropdown toggle state
  const [value, setValue] = useState(""); // input value
  const [selected, setSelected] = useState<Location>({
    id: "",
    airportCode: "",
    city: "",
    country: "",
    airport: "",
  });

  useEffect(() => {
    if (filterFormData.airportCode === "") {
      setSelected({
        id: "",
        airportCode: "",
        city: "",
        country: "",
        airport: "",
      });
    }
  }, [filterFormData]);

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
      <label
        className="block text-sm font-medium mb-1 capitalize text-gray-600 dark:text-gray-400"
        htmlFor="description"
      >
        Departure Location
      </label>
      <div className="relative inline-flex w-full">
        <div
          onClick={() => {
            setMenuActive(!menuActive);
            setValue("");
          }}
          className={`btn py-0 pl-0 w-full justify-between min-w-[11rem] h-[45px] bg-gray-100 dark:bg-gray-700 hover:border hover:border-red-500  hover:ring-1 hover:ring-red-500 text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-200${
            menuActive ? "border border-red-500 ring-1 ring-red-500" : ""
          }`}
        >
          <span className="flex-1 items-center capitalize">
            <input
              className="absolute left-0 top-0 bg-transparent border-hidden focus:ring-0 focus:ring-offset-0 w-full dark:placeholder:text-gray-300 placeholder:text-gray-700 placeholder:text-sm"
              value={value}
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
          <ChevronDown
            className="text-gray-500 dark:text-gray-400 ml-3"
            size={20}
          />
        </div>
        {menuActive && (
          <div className="z-20 absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-700 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1">
            <div className="font-medium text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none max-h-40 overflow-auto custom-scrollbar">
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
                      setSelected(option); // update the selected option
                      setValue(""); // reset the value
                      setMenuActive(false); // stop showing the menu dropdown
                      setFilterFormData({
                        ...filterFormData,
                        airportCode: option.airportCode,
                      });
                    }}
                  >
                    <div className="text-start text-base">
                      <div className="font-bold">{option.airport}</div>
                      <div className="text-xs md:text-sm text-gray-500">{`${option.city}, ${option.country}`}</div>
                    </div>
                    <div className="w-[3rem] flex-col items-center justify-center">
                      <div
                        className={`shrink-0 mr-2 fill-current capitalize w-full text-sm font-bold ${
                          option.id === selected.id && "text-red-500"
                        }`}
                      >
                        {option.airportCode}
                      </div>
                      <Check
                        className={`w-full shrink-0 mr-2 text-red-500 ${
                          option.id !== selected.id && "invisible"
                        }`}
                        size={20}
                      />
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
