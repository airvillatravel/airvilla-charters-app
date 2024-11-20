"use client";

import Flatpickr from "react-flatpickr";
import { Hook, Options } from "flatpickr/dist/types/options";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import moment from "moment";
import {
  selectSingleTicket,
  setTicketUpdateData,
} from "@/redux/features/SingleTicketSlice";

import { getFormatDate } from "@/utils/functions/functions";
import { UserTicketResultType } from "@/utils/definitions/myTicketsDefinitions";

export default function FlightDateUpdateField({
  align,
}: {
  align?: "left" | "right";
}) {
  // ########## STATE #################
  // Flight date from data
  const flightTicket: UserTicketResultType | {} =
    useAppSelector(selectSingleTicket);
  const formData = flightTicket as UserTicketResultType;
  const dispatch = useAppDispatch();

  // ############# FUNCTIONS ##################
  const onReady: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    const customClass = align ?? "";
    instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
  };

  const onChange: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");

    // update the departure time on form data
    const updatedFormData = {
      ...formData,
      flightDate: moment(selectedDates[0]).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    };

    // Dispatch the updated form state
    dispatch(setTicketUpdateData(updatedFormData));
  };

  // ################### OPTIONS ##################
  const optionsDate: Options = {
    allowInput: false,
    mode: "single",
    // static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: "",
    minDate: new Date(),
    disableMobile: true,
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady,
    onChange,
  };

  return (
    <div className="relative mr-10 w-full flex-1">
      <Flatpickr
        id="flightDate"
        className="pl-9 w-full border-0 
              text-opacity-70 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 shadow dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows disabled:cursor-not-allowed"
        options={optionsDate}
        name="flightDate"
        placeholder={getFormatDate(formData.flightDate)}
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
