import avatarPlaceholder from "@/public/images/placeholders/profile-placeholder.jpg";
import React from "react";
import Image from "next/image";
import { getFormatDate, getFormatTime } from "@/utils/functions/functions";
import Link from "next/link";
import { MasterTicketResultType } from "@/utils/definitions/masterDefinitions";

const getStatusStyle = (status: string) => {
  const baseStyle =
    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  switch (status.toLowerCase()) {
    case "updated":
      return `${baseStyle} bg-yellow-100 text-yellow-800`;
    case "unavailable":
      return `${baseStyle} bg-red-100 text-red-800`;
    case "available":
      return `${baseStyle} bg-green-100 text-green-800`;
    case "pending":
      return `${baseStyle} bg-blue-100 text-blue-800`;
    case "rejected":
      return `${baseStyle} bg-yellow-100 text-yellow-800`;
    case "hold":
      return `${baseStyle} bg-orange-100 text-orange-800`;
    case "blocked":
      return `${baseStyle} bg-gray-100 text-gray-800`;
    default:
      return `${baseStyle} bg-gray-100 text-gray-800`;
  }
};

const getStatusDot = (status: string) => {
  switch (status.toLowerCase()) {
    case "updated":
      return "bg-yellow-400";
    case "unavailable":
      return "bg-red-400";
    case "available":
      return "bg-green-400";
    case "pending":
      return "bg-blue-400";
    case "rejected":
      return "bg-[#d1b000]";
    case "hold":
      return "bg-orange-500";
    case "blocked":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};
export default function TicketsOverviewList({
  ticket,
}: {
  ticket: MasterTicketResultType;
}) {
  return (
    <>
      {/* RefId */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
        <div className="font-medium text-sky-500">#{ticket.refId}</div>
      </td>

      {/* Agency */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center ">
          <div className="h-10 shrink-0 mr-2 sm:mr-3">
            <Image
              className="rounded-full"
              src={ticket?.owner?.logo || avatarPlaceholder}
              width={40}
              height={40}
              alt={"agency image"}
            />
          </div>
          <div className="font-medium text-gray-800 dark:text-gray-100 overflow-hidden whitespace-nowrap text-ellipsis">
            {ticket?.owner?.agencyName && ticket?.owner?.agencyName?.length > 20
              ? ticket?.owner?.agencyName?.slice(0, 20) + "..."
              : ticket?.owner?.agencyName}
          </div>
        </div>
      </td>

      {/* User Name */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">{`${ticket?.owner?.firstName} ${ticket?.owner?.lastName}`}</div>
      </td>

      {/* Status */}
      <td className="table-list-field">
        <span className={getStatusStyle(ticket.ticketStatus)}>
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
              ticket.ticketStatus
            )}`}
          ></span>
          {ticket.ticketStatus}
        </span>
      </td>

      {/* Flight Date */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {getFormatDate(ticket.flightDate)}
        </div>
      </td>

      {/* Departure */}

      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.segments[0].departure.airportCode}
        </div>
      </td>

      {/* Arrival */}

      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.segments[0].arrival.airportCode}
        </div>
      </td>

      {/* Issued On */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          <div>
            {getFormatDate(ticket.createdAt as string)}
            {" | "}
            {getFormatTime(ticket.createdAt as string)}
          </div>
        </div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        {/* Menu button */}
        <Link
          href={`/master-control/tickets-overview/${ticket.refId}`}
          className="text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 rounded-full font-bold"
        >
          <span className="sr-only font-bold">Menu</span>
          View
        </Link>
      </td>
    </>
  );
}
