import React, { lazy, Suspense } from "react";
import ListLoading from "@/components/flight-tickets/myTickets/ListLoading";
import { MasterTicketResultType } from "@/utils/definitions/masterDefinitions";
import TicketRequestStatusTabs from "./TicketRequestStatusTabs";
import SearchByRefIdBar from "@/components/flight-tickets/myTickets/SearchByRefIdBar";

const TicketRequestsList = lazy(() => import("./TicketRequestsList"));
export default function TicketRequestsTable({
  tickets,
  isLoading,
  totalTickets,
  refId,
  selectedTicketTab,
  setSelectedTicketTab,
}: {
  tickets: MasterTicketResultType[];
  isLoading: boolean;
  totalTickets: number;
  refId: (node?: Element | null) => void;
  selectedTicketTab: string;
  setSelectedTicketTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg relative overflow-hidden">
      {/* SMALL SCREENS */}
      <header className="xl:hidden bg-gray-50 dark:bg-gray-800 py-4 px-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between w-full">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
            <span className="text-2xl font-bold text-red-500 mr-2">
              {totalTickets}
            </span>
            <span className="text-lg font-semibold">Total Tickets</span>
          </h2>
          <SearchByRefIdBar
            path="/master-control/ticket-requests"
            placeholder="Search by Ticket ID…"
          />
        </div>
        <div className="w-full overflow-x-auto mt-8 xl:mt-0">
          <TicketRequestStatusTabs
            selectedTicketTab={selectedTicketTab}
            setSelectedTicketTab={setSelectedTicketTab}
          />
        </div>
      </header>
      {/* LARGE SCREENS */}
      <header className="hidden bg-gray-50 dark:bg-gray-800 py-4 px-6 xl:flex flex-col sm:flex-row sm:flex-wrap items-center justify-between border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center flex-1 space-x-6 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="flex items-center space-x-6 flex-1">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              <span className="text-2xl font-bold text-red-500 mr-2">
                {totalTickets}
              </span>
              <span className="text-lg font-semibold">Total Tickets</span>
            </h2>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
            <TicketRequestStatusTabs
              selectedTicketTab={selectedTicketTab}
              setSelectedTicketTab={setSelectedTicketTab}
            />
          </div>
          <SearchByRefIdBar
            path="/master-control/ticket-requests"
            placeholder="Search by Ticket ID…"
          />
        </div>
      </header>
      <div>
        {/* Table */}
        <div
          className="overflow-x-auto custom-scrollbar"
          style={{ maxHeight: "calc(100vh - 400px)" }}
        >
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs font-semibold capitalize text-gray-800 dark:text-gray-50 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-200 dark:border-gray-700 text-left sticky -top-0.5">
              <tr>
                <th className="pl-8 p-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  ID
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Agency
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Full Name
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  status
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Flight Date
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Departure
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Arrival
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Issued On
                </th>
                <th className="pr-4 pl-2 py-4  whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  actions
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <Suspense
                fallback={
                  <tr>
                    <td colSpan={7} className="py-3">
                      <div className="flex justify-center">
                        <ListLoading />
                      </div>
                    </td>
                  </tr>
                }
              >
                {tickets.map((ticket) => (
                  <tr ref={refId} key={ticket.id}>
                    <TicketRequestsList ticket={ticket} />
                  </tr>
                ))}
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="py-3">
                      <div className="flex justify-center">
                        <ListLoading />
                      </div>
                    </td>
                  </tr>
                )}
              </Suspense>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
