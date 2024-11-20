import ModalBasic from "@/components/modal-basic";
import React, { useState } from "react";
import { TicketDetails } from "./TicketDetails";
import { FlightFareTab } from "./FlightFareTab";
import { FlightBaggageTab } from "./FlightBaggageTab";
import { FlightExtraOffersTab } from "./FlightExtraOffersTab";
import { SearchTicketModalProps } from "@/utils/definitions/blockseatsDefinitions";
import img from "@/public/images/user-avatar-32.png";

const tabs = [
  { id: "flight-info", label: "Flight Info", Component: TicketDetails },
  { id: "flight-fare", label: "Flight Fare", Component: FlightFareTab },
  {
    id: "flight-baggage",
    label: "Flight Baggage",
    Component: FlightBaggageTab,
  },
  {
    id: "extra-offers",
    label: "Extra Offers",
    Component: FlightExtraOffersTab,
  },
];

export const SearchTicketModal = ({
  feedbackModalOpen,
  setFeedbackModalOpen,
  ticket,
}: SearchTicketModalProps) => {
  const [activeTab, setActiveTab] = useState("flight-info");

  return (
    <div className="h-full relative">
      <div className="flex flex-wrap items-center -m-1.5 absolute">
        <div className="m-1.5">
          <ModalBasic
            isOpen={feedbackModalOpen}
            setIsOpen={setFeedbackModalOpen}
            title="Flight Details"
            className="xl:mx-0 xl:-ml-[-35rem]"
          >
            <div className="w-full min-h-96 max-h-fit h-full max-w-4xl mx-auto py-12 px-4">
              <ul className="flex overflow-x-scroll md:overflow-auto flex-no-wrap gap-0 bg-red-100 dark:bg-red-500/30 text-red-500 dark:text-red-400 rounded-lg py-2">
                {tabs.map(({ id, label }) => (
                  <li key={id} className="flex-1 px-4">
                    <button
                      className={`w-full mb-0 cursor-pointer py-2 whitespace-nowrap rounded-lg focus:outline-none ${
                        activeTab === id
                          ? "active bg-red-500 text-white dark:text-white rounded-lg"
                          : ""
                      }`}
                      onClick={() => setActiveTab(id)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 min-h-80 max-h-96 overflow-y-auto px-4">
                {tabs.map(
                  ({ id, Component }) =>
                    activeTab === id && <Component key={id} ticket={ticket} />
                )}
              </div>
            </div>
          </ModalBasic>
        </div>
      </div>
    </div>
  );
};
