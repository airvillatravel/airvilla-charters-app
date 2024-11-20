import React, { useState } from "react";
import { formatPrice } from "@/utils/functions/functions";
import { EyeIcon } from "lucide-react";
import { PriceBookingSectionProps } from "@/utils/definitions/blockseatsDefinitions";
import { useSearchState } from "@/components/hooks/useSearchState";

export const PriceBookingSection = ({
  flightClass,
  searchState,
  ticket,
  combinedId,
  onSelect,
  selectedDeparture,
  selectedReturn,
  getTicketState,
  setFeedbackModalOpen,
}: PriceBookingSectionProps) => {
  const { updateUrlParams } = useSearchState();

  // Determine if this ticket is for departure or return
  let isReturnTicket = searchState.itinerary === "round trip";
  let isDepartureTicket = searchState.itinerary === "round trip";

  if (searchState.itinerary === "round trip") {
    if (!selectedDeparture) {
      isDepartureTicket = true;
    } else if (!selectedReturn) {
      isReturnTicket = true;
    }
  } else {
    // For one-way trips, there's only a departure ticket
    isDepartureTicket = true;
  }

  // Get the ticket state
  const ticketState = getTicketState(ticket.id, isReturnTicket as boolean);

  // Determine button state and text
  let buttonState = "select";
  let buttonDisplayText = ticketState === "selected" ? "Selected" : "Select";

  if (searchState.itinerary === "round trip") {
    if (
      (isDepartureTicket && selectedDeparture === ticket.id) ||
      (isReturnTicket && selectedReturn === ticket.id)
    ) {
      if (selectedDeparture && selectedReturn) {
        buttonState = "book now";
        buttonDisplayText = "Book Now";
      } else {
        buttonState = "selected";
        buttonDisplayText = "Selected";
      }
    }
  } else if (searchState.itinerary === "one way") {
    buttonState = "book now";
    buttonDisplayText = "Book Now";
  }

  // Generate link URL
  const linkUrl =
    buttonState === "book now"
      ? updateUrlParams(
          `/blockseats/list/${
            searchState.itinerary === "one way" ? ticket.id : combinedId
          }`,
          {
            ...searchState,
          }
        )
      : "#";

  // Handle button click
  const handleButtonClick = () => {
    if (buttonState === "book now" && linkUrl !== "#") {
      window.location.href = linkUrl;
    } else if (searchState.itinerary === "round trip") {
      onSelect(ticket, false);
    }
  };

  // Render button
  const renderButton = () => (
    <button
      className={`btn min-w-32 py-2 px-4 rounded-lg mr-2 ${
        buttonState === "book now"
          ? "bg-red-500 hover:bg-red-700 text-white"
          : buttonState === "selected"
          ? "bg-blue-500 hover:bg-blue-700 text-white"
          : "bg-slate-950 hover:bg-slate-700 text-white"
      }`}
      onClick={handleButtonClick}
    >
      {buttonDisplayText}
    </button>
  );

  return (
    <div className="mt-4 text-blue-500 dark:text-blue-400 text-sm text-end w-full md:w-1/5 flex flex-col md:items-end">
      <div className="flex flex-col items-start mb-4">
        {/* Price */}
        <div className="text-justify text-xl md:text-2xl font-bold text-gray-950 dark:text-gray-50  transition-colors duration-300 group-hover:text-green-400">
          {formatPrice(
            typeof flightClass.price.adult === "number"
              ? flightClass.price.adult
              : 0,
            flightClass.price.currency
          )}
          <div className="flex flex-col sm:flex-row xl:justify-end items-start xl:items-center font-light text-sm list-inline text-center justify-content-sm-between mb-0 pb-2 text-gray-800 dark:text-gray-400">
            per traveler
          </div>
        </div>
        <div className="flex flex-col xs:flex-row sm:flex-col md:items-start items-center justify-between">
          {renderButton()}
          <div className="mt-2 flex items-start text-white dark:text-slate-800">
            <EyeIcon
              style={{
                fill: "rgb(239, 68, 68)",
              }}
            />
            <button
              className="text-red-500 underline offset-1"
              aria-controls="feedback-modal"
              onClick={() => setFeedbackModalOpen(true)}
            >
              <span className="underline-offset-1 ml-1">Flight Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
