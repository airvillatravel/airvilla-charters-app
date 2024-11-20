import { TicketProps } from "@/utils/definitions/blockseatsDefinitions";
import { CardHeader } from "./CardHeader";
import { FlightClassTable } from "./FlightClassTable";

export const FlightFareTab = ({ ticket }: TicketProps) => (
  <div
    className="bg-white dark:bg-gray-800 p-6 min-h-96 max-h-fit h-full w-full max-w-5xl mx-auto my-2 transition-transform transform duration-300 ease-in-out"
    id="flight-fare-tab"
    role="tabpanel"
    aria-labelledby="flight-fare"
  >
    <div className="card border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-6">
      <CardHeader segment={ticket.segments[0]} />
      <div className="card card-body p-4">
        {ticket.flightClasses && ticket.flightClasses.length > 0 ? (
          ticket.flightClasses.map((flightClass, index) => (
            <FlightClassTable key={index} flightClasses={flightClass} />
          ))
        ) : (
          <div className="p-4">No flight classes available.</div>
        )}
      </div>
    </div>
  </div>
);
