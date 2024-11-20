"use client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";

import { CreateSegmentFormTypes } from "@/utils/definitions/myTicketsDefinitions";

export default function FlightTime({
  segmentIndex,
  act,
}: {
  segmentIndex: number;
  act: "departureTime" | "arrivalTime";
}) {
  // ########## STATE #################
  // segment form data
  const formData = useAppSelector(selectTicketForm);
  const segment = formData.segments[segmentIndex];
  const dispatch = useAppDispatch();

  // ############# FUNCTIONS ##################
  const handleTimeChange = (newTime: any) => {
    if (newTime) {
      // update the time on form data
      const updatedFormData = {
        ...formData,
        segments: formData.segments.map(
          (seg: CreateSegmentFormTypes, i: number) =>
            i === segmentIndex
              ? {
                  ...seg,
                  [act]: dayjs(newTime).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                }
              : seg
        ),
      };

      // Dispatch the updated form state
      dispatch(updateTicketForm(updatedFormData));
    }
  };

  return (
    <>
      {/* TIME */}
      <div className="flex-1 w-full">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeField
            className="custom-time-field w-full"
            format="HH:mm"
            value={dayjs(segment[act])}
            onChange={handleTimeChange}
          />
        </LocalizationProvider>
      </div>
    </>
  );
}
