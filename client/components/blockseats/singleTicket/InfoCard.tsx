import React from "react";
import { FlightTicketRes } from "@/utils/definitions/blockseatsDefinitions";

export default function InfoCard({ ticket }: { ticket: FlightTicketRes }) {
  return (
    <div className="text-base text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-700 ">
      {/* Header */}
      <div className="w-full border-b border-gray-300 dark:border-gray-700 mb-4 p-5 px-4">
        <h2 className="text-xl md:text-4xl font-bold font-inter">
          Ticket Description
        </h2>
      </div>
      <div className="p-5">
        <h3 className="text-lg md:text-xl font-bold mb-2">
          → {ticket.description}
        </h3>
      </div>
    </div>
  );
}
