import { getFormatDate, getFormatTime } from "@/utils/functions/functions";

import React, { useEffect } from "react";
import { TicketsProperties } from "../tickets-properties";
import { generateUpdateMessage } from "@/utils/functions/logMessages";
import { useAppDispatch } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";

export default function MyTicketHistoryLogs({
  ticketLogs,
  index,
}: {
  ticketLogs: any;
  index: number;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const { statusColor } = TicketsProperties();
  const dispatch = useAppDispatch();
  const [logMessages, setLogMessages] = React.useState<string[]>([]);

  // let LogMessages;
  useEffect(() => {
    if (!ticketLogs?.changeDetails) return; // Add a check for ticketLogs
    try {
      const data = JSON.parse(ticketLogs.changeDetails);
      const ignoreKeys = [
        "departureTime",
        "arrivalTime",
        "departure.airportCode",
        "departure.country",
        "departure.city",
        "departure.airport",
        "arrival.airportCode",
        "arrival.country",
        "arrival.city",
        "arrival.airport",
        "createdAt",
        "updatedAt",
        "id",
        "ticketHistoryLogs",
      ];
      const LogMessages = Object.keys(data)
        .filter(
          (key) =>
            !ignoreKeys.includes(key) && !key.toLowerCase().includes("id")
        )
        .map((key) => {
          if (key === "comment") {
            return data[key];
          }
          const { oldValue, newValue } = data[key];
          return generateUpdateMessage(key, oldValue, newValue);
        });
      // .reverse();
      setLogMessages(LogMessages);
    } catch (error) {
      // console.error("Failed to parse JSON:", error);
      dispatch(
        setMsg({
          success: false,
          message: "Failed to display the logs. Please try again later.",
        })
      );
      // return;
    }
  }, [ticketLogs?.id, dispatch]);

  return (
    <div
      key={ticketLogs.id}
      className={`py-4 px-3 mb-2 border border-gray-200 dark:border-gray-500/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500/50 transition-colors duration-150 flex flex-wrap space-y-4 md:space-y-0`}
    >
      {/* Numbered circle */}
      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
        <span className="text-white font-semibold">{index}</span>
      </div>
      {/* Log entry details */}
      <div className="flex-grow space-y-4 xs:space-y-0">
        <div className="flex flex-col xs:flex-row justify-start items-start xs:justify-between xs:items-center space-y-4 xs:space-y-0">
          <span className="text-lg font-semibold text-gray-800 dark:text-white font-mono">
            {ticketLogs.agency?.agencyName ? (
              <span className="mt-4 xs:mt-0">
                {ticketLogs.agency?.agencyName}
                {ticketLogs.agencyAgent &&
                  ` - ${ticketLogs.agencyAgent.firstName} ${ticketLogs.agencyAgent.lastName}`}
              </span>
            ) : (
              <span>Airvilla</span>
            )}
          </span>
          {/* Status badge */}
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${getStatusColor(
              ticketLogs.changeType
            )} text-white font-mono`}
          >
            {ticketLogs.changeType}
          </span>
        </div>
        {/* Date and details */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
          {`${getFormatDate(ticketLogs.changedAt)} at ${getFormatTime(
            ticketLogs.changedAt
          )}`}
        </p>
        <div className="text-sm text-gray-600 dark:text-white mt-1 font-mono">
          {logMessages.length > 0 &&
            logMessages
              .slice(0, 4)
              .map((message, index) => <p key={index}>{message}</p>)}
          {showAll &&
            logMessages
              .slice(4)
              .map((message, index) => <p key={index}>{message}</p>)}
          {logMessages.length > 4 && (
            <button
              type="button"
              className="text-sm font-bold text-red-500 dark:text-red-400 hover:text-indigo-900 dark:hover:text-indigo-900"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Function to determine the background color based on the ticket status
const getStatusColor = (status: string) => {
  switch (status) {
    case "created":
      return "bg-blue-500";
    case "accepted":
      return "bg-green-500";
    case "rejected":
      return "bg-[#d1b000]";
    case "blocked":
      return "bg-red-500";
    case "unavailable":
      return "bg-gray-500";
    case "available":
      return "bg-indigo-500";
    case "hold":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

// Function to format the date string
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
