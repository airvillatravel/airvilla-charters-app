import React, { useRef } from "react";
import { TicketDetails } from "./TicketDetails";
import { TicketHeader } from "./TicketHeader";
import {
  FlightClassesRes,
  FlightTicketRes,
  TicketListProps,
} from "@/utils/definitions/blockseatsDefinitions";

export const TicketList = ({
  searchedTickets,
  searchState,
  onSelectTicket,
  selectedDeparture,
  selectedReturn,
  getTicketState,
  combinedId,
}: TicketListProps) => {
  const { departureTicket, returnTicket } = searchedTickets;
  const isRoundTrip = searchState.itinerary === "round trip";
  const lastTicketElementRef = useRef<HTMLDivElement>(null);

  // Helper function to get the lowest price from a ticket
  const getLowestPrice = (ticket: FlightTicketRes): number => {
    return Math.min(
      ...ticket.flightClasses.map((fc: FlightClassesRes) => {
        // Ensure we're dealing with a number
        const price =
          typeof fc.price.adult === "number" ? fc.price.adult : Infinity;
        return isNaN(price) ? Infinity : price;
      })
    );
  };

  // Sort departure tickets by the lowest price in flightClasses
  const sortedDepartureTickets = [...departureTicket].sort(
    (a, b) => getLowestPrice(a) - getLowestPrice(b)
  );

  // Sort return tickets by the lowest price in flightClasses (if round trip)
  const sortedReturnTickets = isRoundTrip
    ? [...returnTicket].sort((a, b) => getLowestPrice(a) - getLowestPrice(b))
    : [];

  return (
    <>
      <TicketHeader
        from={searchState?.departure?.city}
        to={searchState?.arrival?.city}
        type="departure"
      />
      {sortedDepartureTickets.map((ticket, index) => (
        <TicketDetails
          key={ticket?.id}
          ref={
            index === sortedDepartureTickets.length - 1
              ? lastTicketElementRef
              : null
          }
          combinedId={combinedId}
          ticket={ticket}
          searchState={searchState}
          selectedDeparture={selectedDeparture}
          selectedReturn={selectedReturn}
          getTicketState={getTicketState}
          onSelect={() => onSelectTicket(ticket, false)}
          buttonState={getTicketState(ticket?.id!, false)}
        />
      ))}

      {isRoundTrip && (
        <>
          <TicketHeader
            from={searchState?.arrival?.city}
            to={searchState?.departure?.city}
            type="return"
          />
          {sortedReturnTickets.map((ticket, index) => (
            <TicketDetails
              key={ticket?.id}
              ref={
                index === sortedReturnTickets.length - 1
                  ? lastTicketElementRef
                  : null
              }
              ticket={ticket}
              combinedId={combinedId}
              searchState={searchState}
              selectedDeparture={selectedDeparture}
              selectedReturn={selectedReturn}
              getTicketState={getTicketState}
              onSelect={() => onSelectTicket(ticket, true)}
              buttonState={getTicketState(ticket?.id!, true)}
            />
          ))}
        </>
      )}
    </>
  );
};
