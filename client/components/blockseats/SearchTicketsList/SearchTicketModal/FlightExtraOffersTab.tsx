import { ExtraOffersTable } from "./ExtraOffersTable";
import { TicketProps } from "@/utils/definitions/blockseatsDefinitions";
import { CardHeader } from "./CardHeader";

export const FlightExtraOffersTab = ({ ticket }: TicketProps) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 min-h-96 h-full max-h-fit w-full max-w-5xl mx-auto my-2 transition-transform transform duration-300 ease-in-out"
      id="extra-offers-tab"
      role="tabpanel"
      aria-labelledby="extra-offers"
    >
      <div className="card border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-6">
        {ticket ? (
          <>
            <CardHeader segment={ticket.segments[0]} />
            <div className="card-body p-4">
              {ticket.flightClasses && ticket.flightClasses.length > 0 ? (
                ticket.flightClasses.map((flightClass, index) => (
                  <ExtraOffersTable key={index} flightClasses={flightClass} />
                ))
              ) : (
                <div className="p-4">No flight classes available.</div>
              )}
            </div>
          </>
        ) : (
          <div className="p-4">No ticket information available.</div>
        )}
      </div>
    </div>
  );
};
