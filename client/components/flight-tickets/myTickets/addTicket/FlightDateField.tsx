"use client";

import Flatpickr from "react-flatpickr";
import { Hook, Options } from "flatpickr/dist/types/options";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import moment from "moment";
import { Calendar } from "lucide-react";

const FlightDateField = ({ align }: { align?: "left" | "right" }) => {
  // ########## STATE #################
  // segment from data
  const formData = useAppSelector(selectTicketForm);
  const dispatch = useAppDispatch();

  // ############# FUNCTIONS ##################
  const onReady: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    const customClass = align ?? "";
    instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
  };

  const onChange: Hook = (selectedDates, dateStr, instance) => {
    (instance.element as HTMLInputElement).value = dateStr.replace("to", "-");
    const dates = selectedDates.map((date) =>
      moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS")
    );
    // update the departure time on form data
    const updatedFormData = {
      ...formData,
      flightDates: dates,
    };

    // Dispatch the updated form state
    dispatch(updateTicketForm(updatedFormData));
  };

  // ################### OPTIONS ##################
  const optionsDate: Options = {
    allowInput: false,
    mode: "multiple",
    // static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: "",
    minDate: moment().add(1, "day").toDate(),
    disableMobile: true,
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady,
    onChange,
  };

  return (
    <div className="flex-1">
      <div className="relative mr-10 w-full">
        <Flatpickr
          // className="form-input pl-9 dark:bg-transparent text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 font-medium w-full"
          className="w-full border-1 border-0 text-gray-600 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 shadow dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows"
          options={optionsDate}
          name="flightDate"
          placeholder="Select flight dates"
        />

        <span className="absolute right-3 top-2.5 text-gray-400 bg-gray-50 dark:bg-gray-600 pl-2">
          <Calendar size={20} />
        </span>
      </div>
    </div>
  );
};

export default FlightDateField;
