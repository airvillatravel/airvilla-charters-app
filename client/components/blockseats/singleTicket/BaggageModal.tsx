import ModalBasic from "@/components/modal-basic";
import img from "@/public/images/user-avatar-32.png";
import React from "react";
// import { FlightBaggageTab } from "../SearchTicketModal";
import { FlightBaggageTab } from "../SearchTicketsList/SearchTicketModal/FlightBaggageTab";

export default function BaggageModal({
  feedbackModalOpen,
  setFeedbackModalOpen,
  ticket,
}: any) {
  return (
    <div className="h-full relative">
      <div className="flex flex-wrap items-center -m-1.5 absolute">
        <div className="m-1.5">
          {/* Start */}
          <ModalBasic
            isOpen={feedbackModalOpen}
            setIsOpen={setFeedbackModalOpen}
            title="Baggage & Fare Rules"
          >
            {/* Modal content */}
            <div className="w-full min-h-96 max-w-4xl mx-auto">
              {/* Tab Content */}
              <div className="mt-0">
                {/* Tab content */}
                <FlightBaggageTab ticket={ticket} />
              </div>
            </div>
          </ModalBasic>
          {/* End */}
        </div>
      </div>
    </div>
  );
}
