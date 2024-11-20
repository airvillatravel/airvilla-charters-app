"use client";

import Flatpickr from "react-flatpickr";
import { Hook, Options } from "flatpickr/dist/types/options";
import { useEffect, useRef } from "react";
import { getFormatDate } from "@/utils/functions/functions";
import moment from "moment";

export default function OneWayDate({
  align,
  onDateChange,
  initialDate,
}: {
  align?: "left" | "right";
  onDateChange: (dates: {
    flightDate: string;
    returnDate: string | null;
  }) => void;
  initialDate?: string | null;
}) {
  const flatpickrRef = useRef<Flatpickr | null>(null);

  const onReady: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    const customClass = align ?? "";
    if (instance.calendarContainer) {
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    }
  };

  const onChange: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    // update departure date
    if (selectedDates[0]) {
      const flightDate = getFormatDate(selectedDates[0].toISOString());
      onDateChange({
        flightDate: flightDate,
        returnDate: null,
      });
    }
  };

  const parseDateSafely = (
    dateString: string | null | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;

    const formats = [
      moment.ISO_8601,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ",
      "MMMM D, YYYY", // Added this format for "September 6, 2024"
      "M/D/YYYY", // Also added this common format just in case
    ];

    for (const format of formats) {
      const parsed = moment(dateString, format, true);
      if (parsed.isValid()) {
        return parsed.toDate();
      }
    }

    console.warn(`Unable to parse date: ${dateString}`);
    return undefined;
  };

  const options: Options = {
    mode: "single",
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    // defaultDate: initialDate ? new Date(initialDate) : undefined,
    defaultDate: parseDateSafely(initialDate),
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady,
    onChange,
    disableMobile: true,
    minDate: "today",
  };

  // destroy the flatpickr instance when unmounting the component
  // to prevent memory leaks and potential bugs related to the flatpickr instance
  // being left hanging around in memory
  // This is especially important when using this component in a functional component using hooks like useState or useEffect.
  // Solved Error: TypeError: _this.flatpickr.destroy is not a function
  useEffect(() => {
    // Clean up function to destroy the Flatpickr instance
    return () => {
      if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
        flatpickrRef.current.flatpickr.destroy();
      }
    };
  }, []);
  const initialDateValue = parseDateSafely(initialDate);
  return (
    <div className="relative">
      <Flatpickr
        ref={flatpickrRef}
        // value={initialDate ? moment(initialDate).toDate() : undefined}
        value={initialDateValue}
        className="w-full form-input pl-9 h-[3.5rem] text-slate-500 dark:placeholder:text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 font-medium bg-gray-50 dark:bg-gray-800"
        options={options}
        placeholder="Departure Date"
      />
      <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
          viewBox="0 0 16 16"
        >
          <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
        </svg>
      </div>
    </div>
  );
}
