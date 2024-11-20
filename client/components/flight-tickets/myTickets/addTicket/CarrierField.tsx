"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { airlineData, Airline } from "@/utils/data/CarrierData";

export default function CarrierField({
  segmentIndex,
}: {
  segmentIndex: number;
}) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectTicketForm);

  const [menuActive, setMenuActive] = useState(false);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<Airline>({
    id: "",
    airlineCode: "",
    airlineName: "",
    country: "",
  });

  const options = useMemo(
    () =>
      value
        ? airlineData.filter((airline) =>
            [airline.airlineName, airline.airlineCode, airline.country]
              .map((field) => field.toLowerCase().trim())
              .some((field) => field.includes(value.trim().toLowerCase()))
          )
        : airlineData,
    [value]
  );

  const handleCarrierChange = useCallback(
    (selectedAirline: Airline) => {
      const updatedFormData = {
        ...formData,
        segments: formData.segments.map((seg, i) =>
          i === segmentIndex
            ? {
                ...seg,
                carrier: selectedAirline.airlineName,
              }
            : seg
        ),
      };
      dispatch(updateTicketForm(updatedFormData));
    },
    [dispatch, formData, segmentIndex]
  );

  const menuRef = useRef<HTMLDivElement>(null);

  const [focus, setFocus] = useState(false);

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

  return (
    <div>
      <div className="relative inline-flex w-full">
        {/* <div className="btn py-0 w-full justify-between min-w-[11rem] h-[38px] bg-white dark:bg-transparent border-slate-500 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"> */}
        <div
          className={`w-full border-0 min-w-[11rem] flex items-center justify-between bg-gray-50 dark:bg-gray-600 rounded-lg h-[40px] pr-3 shadow dark:shadow-inner ${
            focus && "ring-2 ring-red-500"
          } focus:outline-none transition-all duration-300 no-arrows`}
        >
          <span className="flex-1 items-center capitalize">
            <input
              className="bg-transparent border-hidden  focus:ring-0 focus:ring-offset-0 w-full text-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70"
              value={value}
              onClick={() => {
                setMenuActive(!menuActive);
                setValue("");
                setFocus(true);
              }}
              onBlur={() => setFocus(false)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                setValue(newValue);
                setMenuActive(true);
              }}
              placeholder={
                selected.airlineCode === ""
                  ? "Search airline"
                  : `${selected.airlineName} (${selected.airlineCode})`
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
                      setSelected(option);
                      handleCarrierChange(option);
                      setValue("");
                      setMenuActive(false);
                    }}
                  >
                    <div className="text-start text-base">
                      <div className="font-bold">{option.airlineName}</div>
                      <div className="text-xs md:text-sm text-slate-500">
                        {option.country}
                      </div>
                    </div>
                    <div className="w-[3rem] flex-col items-center justify-center">
                      <div
                        className={`shrink-0 mr-2 fill-current capitalize w-full text-sm font-bold ${
                          option.id === selected.id && "text-red-500"
                        }`}
                      >
                        {option.airlineCode}
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
