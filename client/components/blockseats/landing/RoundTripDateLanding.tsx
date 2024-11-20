"use client";

import Flatpickr from "react-flatpickr";
import { Hook, Options } from "flatpickr/dist/types/options";
import { useEffect, useRef } from "react";
import { getFormatDate } from "@/utils/functions/functions";
import moment from "moment";

export default function RoundTripDate({
  align,
  onDateChange,
  initialDates,
}: {
  align?: "left" | "right";
  onDateChange: (dates: {
    flightDate: string;
    returnDate: string | null;
  }) => void;
  initialDates?: {
    flightDate: string | null;
    returnDate: string | null;
  };
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

    const flightDate = selectedDates[0]
      ? getFormatDate(selectedDates[0].toISOString())
      : null;
    const returnDate = selectedDates[1]
      ? getFormatDate(selectedDates[1].toISOString())
      : null;
    onDateChange({ flightDate: flightDate ?? "", returnDate });
  };

  const parseDateSafely = (
    dateString: string | null | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;

    const formats = [
      moment.ISO_8601,
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ",
      "MMMM D, YYYY",
      "M/D/YYYY",
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

  const getInitialDates = (): Date[] | undefined => {
    if (!initialDates) return undefined;

    const flightDate = parseDateSafely(initialDates.flightDate);
    const returnDate = parseDateSafely(initialDates.returnDate);

    if (flightDate && returnDate) {
      return [flightDate, returnDate];
    } else if (flightDate) {
      return [flightDate];
    }

    return undefined;
  };

  const options: Options = {
    mode: "range",
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    // defaultDate:
    //   initialDates?.flightDate && initialDates?.returnDate
    //     ? [new Date(initialDates.flightDate), new Date(initialDates.returnDate)]
    //     : undefined,
    defaultDate: getInitialDates(),
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady,
    onChange,
    minDate: "today",
  };

  // destroy the flatpickr instance when unmounting the component
  // to prevent memory leaks and potential bugs related to the flatpickr instance
  // being left hanging around in memory
  // This is especially important when using this component in a functional component using hooks like useState or useEffect.
  // TypeError: _this.flatpickr.destroy is not a function
  useEffect(() => {
    // destroy the flatpickr instance when unmounting the component
    return () => {
      if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
        flatpickrRef.current.flatpickr.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <Flatpickr
        ref={flatpickrRef}
        // value={
        //   initialDates && initialDates.flightDate && initialDates.returnDate
        //     ? [
        //         moment(initialDates.flightDate).toDate(),
        //         moment(initialDates.returnDate).toDate(),
        //       ]
        //     : undefined
        // }
        value={getInitialDates()}
        options={options}
        className="w-full form-input pl-9 h-[3.5rem] text-slate-500 dark:placeholder:text-gray-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 font-medium bg-gray-50 dark:bg-gray-800"
        placeholder="Departure - Return Date"
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
