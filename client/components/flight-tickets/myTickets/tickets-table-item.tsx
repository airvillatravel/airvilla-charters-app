import { getFormatDate, getFormatTime } from "@/utils/functions/functions";
import { SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { setSelectedTicket } from "@/redux/features/SelectedTicketSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserTicketResultType } from "@/utils/definitions/myTicketsDefinitions";
import { Clock, Edit, EyeIcon, Trash2 } from "lucide-react";

export const TicketsTableItem = ({
  ticket,
  setDangerModalOpen,
}: {
  ticket: UserTicketResultType;
  setDangerModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  // ################ STATES ################
  const dispatch = useDispatch();
  const router = useRouter();

  // ########## Handlers #################

  // handle delete ticket
  const handleDeleteTicket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // open delete window alert
    setDangerModalOpen(true);

    // update the selected state and set as pending
    dispatch(setSelectedTicket({ ticketId: ticket.refId, status: "pending" }));
  };

  // Helper function to check if the ticket is editable
  const isEditable = (status: string, flightDate: string) => {
    // Check if the status is available, rejected or if the status is unavailable but the date is in the future
    return ["rejected"].includes(status.toLowerCase());
  };

  // Helper function to check if the ticket is view-only
  const isDeletable = (status: string, flightDate: string) => {
    return ["pending", "blocked", "rejected"].includes(status.toLowerCase());
  };

  // Render Status with Dot
  const renderStatus = (status: string) => {
    const { style, dot } =
      statusStyles[status.toLowerCase()] || statusStyles.default;

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`}
        ></span>
        {status}
      </span>
    );
  };

  // Render Icon Actions (View, Edit, Delete)
  const renderIconActions = () => (
    <div className="flex flex-row-reverse justify-start space-x-1">
      {isDeletable(ticket.ticketStatus, ticket.flightDate) && (
        <button
          className="text-red-400 hover:text-red-500 dark:hover:text-red-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
          onClick={handleDeleteTicket}
        >
          <Trash2 size={18} />
        </button>
      )}

      {isEditable(ticket.ticketStatus, ticket.flightDate) && (
        <button
          type="button"
          onClick={() => {
            dispatch(
              setSelectedTicket({ ticketId: ticket.id, status: "update" })
            );
            router.push(`/flight-tickets/myTickets/${ticket.refId}`);
          }}
          className="text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
        >
          <Edit size={18} />
        </button>
      )}

      <Link
        href={`/flight-tickets/myTickets/${ticket.refId}`}
        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
      >
        <EyeIcon size={18} />
      </Link>

      {/* Pending  */}
      {ticket.updated && (
        <div
          className="tooltip"
          data-tip="This ticket is waiting for admin user accepting the update request"
        >
          <div className="text-orange-400 rounded-full p-1">
            <Clock size={18} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Id */}
      <td className="table-list-field">
        <div className="font-medium text-blue-400">
          {"#" + String(ticket.refId)}
        </div>
      </td>
      {/* Flight No */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.segments[0].flightNumber}
        </div>
      </td>

      {/* Ticket Status  */}
      <td className="table-list-field">{renderStatus(ticket.ticketStatus)}</td>

      {/* Departure */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.departure.airportCode}
        </div>
      </td>

      {/* Arrival */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.arrival.airportCode}
        </div>
      </td>
      {/* Flight Date */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100 flex-col">
          <div>{getFormatDate(ticket.flightDate)}</div>
        </div>
      </td>
      {/* Departure Time */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100 flex-col">
          <div>{getFormatTime(ticket.departureTime)}</div>
        </div>
      </td>

      {/* Arrival Time*/}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100  flex-col ">
          <div>{getFormatTime(ticket.arrivalTime)}</div>
        </div>
      </td>

      {/* carrier */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.segments[0].carrier}
        </div>
      </td>
      {/* Seats  */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.seats}
        </div>
      </td>

      {/* Ecomoey Price  */}
      <td className="table-list-field">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {ticket.flightClasses[0].price.adult}
        </div>
      </td>

      {/* Issued date */}
      <td className="table-list-field w-fit">
        <div className="font-medium text-gray-800 dark:text-gray-100 w-fit flex-col ">
          <div>
            {getFormatDate(ticket.createdAt as string)} {" | "}
            {getFormatTime(ticket.createdAt as string)}
          </div>
        </div>
      </td>

      {/* Icon Actions */}
      <td className="table-list-field">{renderIconActions()}</td>
    </>
  );
};

// Status Style and Dot Mapping
const statusStyles: {
  [key: string]: { style: string; dot: string }; //+
} = {
  updated: { style: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" },
  unavailable: { style: "bg-red-100 text-red-800", dot: "bg-red-400" },
  available: { style: "bg-green-100 text-green-800", dot: "bg-green-400" },
  pending: { style: "bg-blue-100 text-blue-800", dot: "bg-blue-400" },
  rejected: { style: "bg-yellow-100 text-yellow-800", dot: "bg-[#d1b000]" },
  blocked: { style: "bg-gray-100 text-gray-800", dot: "bg-gray-400" },
  hold: { style: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
  default: { style: "bg-gray-100 text-gray-800", dot: "bg-gray-400" },
};
