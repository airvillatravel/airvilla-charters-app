import { formatTicketTime, getFormatDate } from "@/utils/functions/functions";
import { FlightSegmentProps } from "@/utils/definitions/blockseatsDefinitions";
import { CardHeader } from "./CardHeader";
import { FlightDetails } from "./FlightDetails";
import { FlightDuration } from "./FlightDuration";

export const FlightSegment = ({
  segment,
  stops,
  segmentClass,
}: FlightSegmentProps) => {
  return (
    <div className="flex items-start space-x-4 mb-4 p-4">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-4 flex-wrap">
          {/* CARD HEADER */}
          <CardHeader segment={segment} />
          <div className="text-sm font-medium text-gray-950 dark:text-gray-50">
            <span className="text-gray-500 dark:text-gray-400">
              Travel Class:{" "}
            </span>
            {/* FLIGHT CLASS */}
            <span className="capitalize">{segmentClass}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row text-sm pt-4">
          {/* DEPARTURE */}
          <FlightDetails
            title="Departure"
            airportCode={segment?.departure?.airportCode || "Unknown"}
            time={formatTicketTime(segment?.departureTime) || "Unknown"}
            date={getFormatDate(segment?.departureTime) || "Unknown"}
            airport={segment?.departure?.airport || "Unknown"}
          />

          {/* DURATION */}
          <FlightDuration duration={segment?.duration} stops={stops} />

          {/* ARRIVAL */}
          <FlightDetails
            title="Arrival"
            airportCode={segment?.arrival?.airportCode || "Unknown"}
            time={formatTicketTime(segment?.arrivalTime) || "Unknown"}
            date={getFormatDate(segment?.arrivalTime) || "Unknown"}
            airport={segment?.arrival?.airport || "Unknown"}
          />
        </div>
      </div>
    </div>
  );
};
