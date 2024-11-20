import React from "react";
import {
  TicketProps,
  FlightSegmentRes,
} from "@/utils/definitions/blockseatsDefinitions";
import { FlightSegment } from "./FlightSegment";
import img from "@/public/images/user-avatar-32.png";
import { calculateTimeDifference } from "@/utils/functions/functions";

export const TicketDetails = ({ ticket }: TicketProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-full w-full max-w-5xl mx-auto my-2 transition-transform transform duration-300 ease-in-out border border-gray-300 dark:border-gray-700">
      {ticket.segments.map((segment: FlightSegmentRes, index: number) => (
        <React.Fragment key={index}>
          <FlightSegment
            segment={segment}
            stops={ticket.stops}
            segmentClass={ticket.flightClasses[0].type}
          />
          {index < ticket.segments.length - 1 && (
            <div className="pt-4">
              <div className="flex justify-center items-center text-sm text-gray-500 dark:text-gray-400 list-inline bg-slate-100 dark:bg-gray-900 rounded-lg d-sm-flex text-center justify-content-sm-between mb-0 px-4 py-2">
                <div>
                  Layover:{" "}
                  {calculateTimeDifference(
                    segment.arrivalTime,
                    ticket.segments[index + 1].departureTime
                  )}{" "}
                  in {ticket.segments[index + 1].departure.airport}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
