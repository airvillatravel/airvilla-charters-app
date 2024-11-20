import React, { RefObject, forwardRef, useState } from "react";
import { TicketDetailsProps } from "@/utils/definitions/blockseatsDefinitions";
import AirlineInfo from "./AirlineInfo";
import { TravelClassInfo } from "./TravelClassInfo";
import { FlightSegment } from "../singleTicket/TicketDetailsCard";
import { PriceBookingSection } from "./PriceBookingSection";
import { OfferSection } from "./OfferSection";
import { SearchTicketModal } from "./SearchTicketModal/SearchTicketModal";

export const TicketDetails = forwardRef<HTMLDivElement, TicketDetailsProps>(
  (
    {
      ticket,
      // ref,
      searchState,
      onSelect,
      buttonState,
      combinedId,
      selectedDeparture,
      selectedReturn,
      getTicketState,
    },
    ref
  ) => {
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const flightClass =
      ticket.flightClasses.find(
        (fc) => fc.type.toLowerCase() === searchState.travelClass.toLowerCase()
      ) || ticket.flightClasses[0];

    const buttonText = {
      select: "Select",
      selected: "Selected",
      "book now": "Book Now",
    }[buttonState];

    const buttonClass = {
      select: "bg-slate-950 hover:bg-slate-700",
      selected: "bg-green-500 hover:bg-green-700",
      "book now": "bg-red-500 hover:bg-red-700",
    }[buttonState];

    return (
      <div
        ref={ref}
        className={`rounded-lg shadow-lg p-6 w-full max-w-5xl mx-auto mt-6 transition-colors duration-300 hover:bg-gray-100/75 dark:hover:bg-gray-700 group ${
          buttonState === "selected"
            ? "bg-gray-100 dark:bg-gray-700"
            : "bg-white dark:bg-gray-800"
        }`}
      >
        {/* Airline info */}
        <div className="flex justify-between items-start mb-4 flex-wrap">
          <AirlineInfo ticket={ticket} />
          <TravelClassInfo flightClasses={flightClass} />
        </div>

        {/* Flight Segments */}
        <div className="flex flex-col md:flex-row md:justify-center md:items-center flex-nowrap">
          <FlightSegment
            segment={ticket.segments[0]}
            stops={ticket.stops}
            flightDate={ticket.flightDate}
            img="https://via.placeholder.com/150x150"
            segmentClass={flightClass.type}
          />

          <PriceBookingSection
            flightClass={flightClass}
            searchState={searchState}
            ticket={ticket}
            combinedId={combinedId}
            onSelect={onSelect}
            selectedDeparture={selectedDeparture}
            selectedReturn={selectedReturn}
            getTicketState={() => "select"}
            buttonText={buttonText}
            buttonClass={buttonClass}
            setFeedbackModalOpen={setFeedbackModalOpen}
          />
        </div>

        {/* Offers */}
        <OfferSection
          seats={ticket.seats}
          refundable={flightClass.extraOffers}
        />

        <SearchTicketModal
          feedbackModalOpen={feedbackModalOpen}
          setFeedbackModalOpen={setFeedbackModalOpen}
          ticket={ticket}
        />
      </div>
    );
  }
);
