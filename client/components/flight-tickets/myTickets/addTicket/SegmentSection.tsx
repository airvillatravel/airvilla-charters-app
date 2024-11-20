import React from "react";
import LocationField from "./LocationField";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import FlightTime from "./FlightTime";
import { CreateSegmentFormTypes } from "@/utils/definitions/myTicketsDefinitions";
import CarrierField from "./CarrierField";
import { InputField } from "./AddTicketComponents";

export default function SegmentSection({
  segmentIndex,
  validationError,
}: {
  segmentIndex: number;
  validationError: any;
}) {
  // ############## STATES #############
  // segment from data
  const formData = useAppSelector(selectTicketForm);
  const segment = formData.segments[segmentIndex];
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4 my-4">
      <div className="text-lg text-slate-800 dark:text-slate-100 font-bold pt-2">
        {`Segment ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
      </div>
      {/* ROW 1 */}
      <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
        {/* Flight NO */}
        <InputField
          id={`flightNumber-${segmentIndex}`}
          label={`Flight No ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
          type="text"
          min={0}
          max={100}
          placeholder="Enter flight number"
          tooltip="Enter the unique identifier for this flight (e.g., AA1234)"
          value={segment?.flightNumber ?? ""}
          onChange={(e) => {
            // Update the form data with the modified segment
            const updatedFormData = {
              ...formData,
              segments: formData.segments.map(
                (seg: CreateSegmentFormTypes, i: number) =>
                  i === segmentIndex
                    ? {
                        ...seg,
                        flightNumber: e.target.value,
                      }
                    : seg
              ),
            };

            // Dispatch the updated form state
            dispatch(updateTicketForm(updatedFormData));
          }}
          validationError={
            validationError &&
            validationError[`segments.${segmentIndex}.flightNumber`]
          }
        />

        {/* carrier */}
        <InputField
          input={<CarrierField segmentIndex={segmentIndex} />}
          label={`carrier ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
          tooltip="Select the airline operating this flight segment."
          validationError={
            validationError &&
            validationError[`segments.${segmentIndex}.carrier`]
          }
        />
      </div>
      {/* ROW 2 location */}
      <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
        {/* Departure */}
        <InputField
          input={<LocationField segmentIndex={segmentIndex} act="departure" />}
          label={`departure ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
          tooltip="Enter the city or airport code where this flight segment departs from."
          validationError={
            validationError &&
            validationError[`segments.${segmentIndex}.departure.airportCode`]
          }
        />
        {/* Arrival */}
        <InputField
          input={<LocationField segmentIndex={segmentIndex} act="arrival" />}
          label={`arrival ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
          tooltip="Enter the city or airport code where this flight segment arrives at."
          validationError={
            validationError &&
            validationError[`segments.${segmentIndex}.arrival.airportCode`]
          }
        />
      </div>

      {/* ROW 4 time*/}
      <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
        {/* Departure Time */}
        <InputField
          input={<FlightTime act="departureTime" segmentIndex={segmentIndex} />}
          label={`Departure Time ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
          tooltip="Enter the scheduled departure time for this flight segment in 24-hour format (e.g., 14:30)."
          validationError={
            validationError &&
            validationError[`segments.${segmentIndex}.departureTime`]
          }
        />

        {/* Arrival Time */}
        <InputField
          input={<FlightTime act="arrivalTime" segmentIndex={segmentIndex} />}
          label={`Arrival Time ${segmentIndex !== 0 ? segmentIndex + 1 : ""}`}
          tooltip="Enter the scheduled arrival time for this flight segment in 24-hour format (e.g., 16:45)."
          validationError={
            validationError &&
            validationError[`segments.${segmentIndex}.arrivalTime`]
          }
        />
      </div>
    </div>
  );
}
