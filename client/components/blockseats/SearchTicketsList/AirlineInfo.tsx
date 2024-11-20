import React from "react";
import { TicketProps } from "@/utils/definitions/blockseatsDefinitions";
import { PlaneIcon } from "lucide-react";

export default function AirlineInfo({ ticket }: TicketProps) {
  return (
    <div className="flex flex-wrap items-center space-x-2 text-base md:text-xl font-bold text-gray-900 dark:text-white">
      <PlaneIcon />
      <span>
        {ticket.segments[0].carrier} ({ticket.segments[0].flightNumber})
      </span>
    </div>
  );
}
