import {
  FlightTicketRes,
  SearchState,
} from "@/utils/definitions/blockseatsDefinitions";
import {
  ArrowLeftRight,
  ArrowRight,
  BarChart,
  Briefcase,
  Search,
  Users,
} from "lucide-react";
import moment from "moment";
import React from "react";

export default function FlightSearchSummary({
  departureTickets,
  returnTickets,
  state,
}: {
  departureTickets: FlightTicketRes[];
  returnTickets: FlightTicketRes[];
  state: SearchState;
}) {
  const isRoundTrip = state.itinerary === "round trip";
  const TripTypeIcon = isRoundTrip ? ArrowLeftRight : ArrowRight;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg relative overflow-hidden shadow-lg group">
      <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"></div>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="flex items-center space-x-3 text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-300">
          <Search style={{ color: "#60A5FA" }} strokeWidth={1.5} />
          <span>Flight Search Summary</span>
        </h2>
        <div className="text-sm bg-gray-500 text-white px-3 my-4 md:my-0  py-1 rounded-full flex items-center transition-all duration-300 ease-in-out transform hover:scale-105">
          <BarChart className="w-4 h-4 mr-1 text-white" strokeWidth={1.5} />
          <span className="flex justify-center items-center space-x-2">
            <p>
              {/* {search.tickets.departure.length + search.tickets.return.length} */}
              {departureTickets.length + returnTickets.length}
            </p>
            <p>results found</p>
          </span>
        </div>
      </div>
      <div className="flex flex-col md:items-center mb-6">
        <h2 className="text-lg md:text-3xl font-bold mb-2 flex flex-row flex-wrap items-center ">
          <span className="text-red-500">
            {state.departure.city} ({state.departure.airportCode})
          </span>
          <TripTypeIcon
            className="w-7 h-7 mx-2 transition-all duration-300 ease-in-out"
            style={{ color: "#60A5FA" }}
            strokeWidth={1.5}
          />
          <span className="text-red-500">
            {state.arrival.city} ({state.arrival.airportCode})
          </span>
        </h2>
        <p className="text-lg text-gray-800 dark:text-gray-300 mb-2">
          {moment(state.flightDate).format("dddd, MMM DD, YYYY")}
          {isRoundTrip &&
            ` -  ${moment(state.returnDate).format("ddd, MMM DD, YYYY")}`}
        </p>
      </div>
      <div className="flex flex-wrap justify-start  md:justify-center items-start md:items-center gap-4">
        <div className="flex items-center bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg">
          <TripTypeIcon
            className="w-5 h-5 mr-2"
            style={{ color: "#60A5FA" }}
            strokeWidth={1.5}
          />
          <span className="capitalize">{state.itinerary}</span>
        </div>
        <div className="flex items-center bg-gray-300 dark:bg-gray-700  px-4 py-2 rounded-lg">
          <Briefcase
            className="w-5 h-5 mr-2"
            style={{ color: "#60A5FA" }}
            strokeWidth={1.5}
          />
          <span className="capitalize">{state.travelClass}</span>
        </div>
        <div className="flex items-center bg-gray-300 dark:bg-gray-700  px-4 py-2 rounded-lg">
          <Users
            className="w-5 h-5 mr-2"
            style={{ color: "#60A5FA" }}
            strokeWidth={1.5}
          />
          <span className="space-x-2">
            <span>
              {state.passengers.adults +
                state.passengers.children +
                state.passengers.infants}
            </span>
            <span className="capitalize">Passenger</span>
            {state.passengers.adults +
              state.passengers.children +
              state.passengers.infants >
            1
              ? "s"
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
