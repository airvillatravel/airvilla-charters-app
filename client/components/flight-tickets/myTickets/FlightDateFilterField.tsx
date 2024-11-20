"use client";

import Flatpickr from "react-flatpickr";
import { Hook, Options } from "flatpickr/dist/types/options";
import { FilterFormDataType } from "@/utils/definitions/myTicketsDefinitions";
import moment from "moment";
import { useEffect, useRef } from "react";
import { TicketRequestDataType } from "@/utils/definitions/masterDefinitions";
import { ChevronDown } from "lucide-react";

export default function FlightDateFilterField({
  filterFormData,
  setFilterFormData,
  align,
  resetForm,
  setResetForm,
}: {
  filterFormData: FilterFormDataType | TicketRequestDataType;
  setFilterFormData: React.Dispatch<
    React.SetStateAction<FilterFormDataType | TicketRequestDataType>
  >;
  align?: "left" | "right";
  resetForm: boolean;
  setResetForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Reference to the Flatpickr instance
  const flatpickrRef = useRef<Flatpickr | null>(null);
  const onReady: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    const customClass = align ?? "";
    instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
  };

  const onChange: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");

    // Convert selected dates to the desired format
    const dates = selectedDates.map((date) =>
      moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS")
    );

    // Update the filter form data with the start and end dates
    setFilterFormData((prev) => ({
      ...prev,
      startDate: dates[0],
      endDate: dates[1],
    }));
  };

  const options: Options = {
    allowInput: false,
    mode: "range",
    // static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: "",
    disableMobile: true,
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady,
    onChange,
  };

  useEffect(() => {
    if (resetForm) {
      flatpickrRef.current!.flatpickr.clear(); // Clear the selected dates
      setResetForm(false);
    }
  }, [resetForm]);

  return (
    <>
      <label className="block text-sm font-medium mb-1 capitalize text-gray-600 dark:text-gray-400">
        Flight Date
      </label>
      <div className="relative w-full">
        <Flatpickr
          ref={(instance) => {
            flatpickrRef.current = instance;
          }}
          className=" h-[45px] dark:placeholder:text-gray-300 text-sm leading-5 rounded px-3 focus:ring-2 focus:ring-red-500 border-gray-300 hover:ring-2 outline-none border-none hover:ring-red-500 hover:border-red-500 focus:border-red-500 shadow-sm py-[11.5px] pl-3 bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200 font-medium w-full "
          options={options}
          name="flightDate"
          placeholder="Select Flight Dates"
        />
        <ChevronDown
          className="text-gray-500 dark:text-gray-400 absolute top-3 right-3 pointer-events-none"
          size={20}
        />
      </div>
    </>
  );
}
