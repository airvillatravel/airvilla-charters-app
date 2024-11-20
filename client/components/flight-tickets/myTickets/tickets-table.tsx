"use client";
import { TicketsTableItem } from "./tickets-table-item";
import DeleteTicketAlart from "./DeleteTicketAlart";
import { useState } from "react";
import ListLoading from "./ListLoading";
import { UserTicketResultType } from "@/utils/definitions/myTicketsDefinitions";
import MyTicketsStatusTabs from "./MyTicketsStatusTabs";
import SearchByRefIdBar from "./SearchByRefIdBar";

export default function TicketsTable({
  tickets,
  loading,
  totalTickets,
  refTicket,
  selectedTicketTab,
  setSelectedTicketTab,
  tabs,
}: {
  tickets: UserTicketResultType[];
  loading: boolean;
  totalTickets: number;
  refTicket: (node?: Element | null) => void;
  tabs: string[];
  selectedTicketTab: string;
  setSelectedTicketTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  // ############# STATES ################
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg relative overflow-hidden">
      {/* Delete tickets window alart  */}
      <DeleteTicketAlart
        dangerModalOpen={dangerModalOpen}
        setDangerModalOpen={setDangerModalOpen}
      />
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
            path="/flight-tickets/myTickets"
            placeholder="Search by Ticket ID…"
          />
        </div>
        <div className="w-full overflow-x-auto mt-8 xl:mt-0">
          <MyTicketsStatusTabs
            selectedTicketTab={selectedTicketTab}
            setSelectedTicketTab={setSelectedTicketTab}
            tabs={tabs}
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
            <MyTicketsStatusTabs
              selectedTicketTab={selectedTicketTab}
              setSelectedTicketTab={setSelectedTicketTab}
              tabs={tabs}
            />
          </div>
          <SearchByRefIdBar
            path="/flight-tickets/myTickets"
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
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold capitalize text-gray-800 dark:text-gray-50 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-200 dark:border-gray-700 text-left sticky -top-0.5">
              <tr>
                <th className="pl-5 p-4 whitespace-nowrap font-semibold text-sm bg-gray-300 dark:bg-gray-700 z-10">
                  Tickets ID
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  flight NO.
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  status
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  departure
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  arrival
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  Flight Date
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  departure time
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  arrival time
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  carrier
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  seats
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  price
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  issued on
                </th>
                <th className="pr-4 pl-2 py-4 whitespace-nowrap font-semibold text-sm  bg-gray-300 dark:bg-gray-700 z-10">
                  actions
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {Array.isArray(tickets) &&
                tickets.map((ticket: UserTicketResultType, index) => (
                  <tr ref={refTicket} key={index}>
                    <TicketsTableItem
                      key={ticket.id}
                      ticket={ticket}
                      setDangerModalOpen={setDangerModalOpen}
                    />
                  </tr>
                ))}
            </tbody>
          </table>
          {tickets?.length < 1 && (
            <div className="text-lg my-10 flex justify-center items-center">
              <h1>No Tickets Found</h1>
            </div>
          )}
        </div>
      </div>
      {loading && <ListLoading />}
    </div>
  );
}
