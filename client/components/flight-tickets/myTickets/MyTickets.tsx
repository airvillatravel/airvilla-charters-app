"use client";

import TicketsTable from "./tickets-table";
import { fetchSearchAllUsersTickets } from "@/lib/data/userTicketData";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { selectSelectedTicket } from "@/redux/features/SelectedTicketSlice";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import DepartureFilterField from "./DepartureFilterField";
import {
  FilterFormDataType,
  UserTicketResultType,
} from "@/utils/definitions/myTicketsDefinitions";
import FlightClassTypesFilterField from "./FlightClassTypesFilterField";
import FlightDateFilterField from "./FlightDateFilterField";
import IssuedDateFilterField from "./IssuedDateFilterField";
import { PlusCircle } from "lucide-react";
import {
  MasterUserDataType,
  TicketRequestDataType,
} from "@/utils/definitions/masterDefinitions";

function TicketsContent({
  initialTickets,
}: {
  initialTickets: UserTicketResultType[];
}) {
  // States for the tickets
  const [tickets, setTickets] = useState(initialTickets);
  const [totalTickets, setTotalTickets] = useState(0);

  // States for fetching more tickets
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  // States for deletion
  const deletedTicket = useAppSelector(selectSelectedTicket);

  // States for intersection observer
  const { ref, inView } = useInView();

  // Dispatch
  const dispatch = useAppDispatch();

  // filter tickets
  const [filterFormData, setFilterFormData] = useState<FilterFormDataType>({
    airportCode: "",
    startDate: "",
    endDate: "",
    flightClassType: "",
    createdTimeFilter: "all time",
  });

  // ticket tabs
  const tabs = [
    "all",
    "pending",
    "available",
    "hold",
    "unavailable",
    "updated",
    "rejected",
    "expired",
    "blocked",
  ];
  const [selectedTicketTab, setSelectedTicketTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    return tabs.includes(hash) ? hash : tabs[0];
  });

  // clicked for reset
  const [resetForm, setResetForm] = useState(false);
  // ############ FUNCTIONS ###############
  const loadMoreUsers = async () => {
    if (isLoading || !nextCursor) return;

    // fetch more users
    setIsLoading(true);
    const myTickets = await fetchSearchAllUsersTickets(
      filterFormData,
      selectedTicketTab?.toLowerCase() !== "updated"
        ? selectedTicketTab
        : "all",
      selectedTicketTab?.toLowerCase() === "updated" ? true : null,
      nextCursor
    );

    if (myTickets.success) {
      // update the ticket state
      setTickets((prevTickets) => [
        ...prevTickets,
        ...myTickets.results.tickets,
      ]);
      // update the cursor
      setNextCursor(myTickets.results.nextCursor);
    }
    // update the error state
    if (myTickets.message) {
      dispatch(
        setMsg({ success: myTickets.success, message: myTickets.message })
      );
    }
    setIsLoading(false);
  };

  // ################ USEEFFECT ################

  // track when hash changes to change tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setSelectedTicketTab(tabs.includes(hash) ? hash : tabs[0]);
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Call once on mount
    handleHashChange();

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // call to load more users whenever scroll
  useEffect(() => {
    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

  // FETCH TICKETS
  useEffect(() => {
    const fetchMyTickets = async () => {
      setIsLoading(true);

      setTickets([]);
      const myTickets = await fetchSearchAllUsersTickets(
        filterFormData,
        selectedTicketTab?.toLowerCase() !== "updated"
          ? selectedTicketTab
          : "all",
        selectedTicketTab?.toLowerCase() === "updated" ? true : null
      );

      if (myTickets.success) {
        setTickets(myTickets.results.tickets);
        setTotalTickets(myTickets.results.totalTickets);
        setNextCursor(myTickets.results.nextCursor);
      }
      if (myTickets.message) {
        dispatch(
          setMsg({ success: myTickets.success, message: myTickets.message })
        );
      }
      setIsLoading(false);
    };
    fetchMyTickets();
  }, [selectedTicketTab, filterFormData]);

  // when delete ticket filter the main state
  useEffect(() => {
    if (deletedTicket.status === "delete") {
      setTotalTickets((prev) => prev - 1);

      setTickets((prevTickets) =>
        prevTickets.filter(
          (ticket: UserTicketResultType) =>
            ticket.refId !== deletedTicket.ticketId
        )
      );
    }
  }, [deletedTicket]);

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-8 w-full max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex justify-between items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            My Tickets
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Create Ticket button */}
          <Link
            href={"/flight-tickets/myTickets/add"}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-300"
          >
            <PlusCircle size={20} className="mr-2" />
            <span className="hidden xs:block ml-2">Create Ticket</span>
          </Link>
        </div>
      </div>

      {/* More actions */}
      <div className="relative mb-5 bg-white dark:bg-gray-800 rounded-lg pb-7 pt-5 px-1 sm:px-3 ">
        {/* // Departure filter */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <DepartureFilterField
              filterFormData={filterFormData as FilterFormDataType}
              setFilterFormData={setFilterFormData}
            />
          </div>
          <div className="flex-1">
            <FlightClassTypesFilterField
              filterFormData={filterFormData as FilterFormDataType}
              setFilterFormData={setFilterFormData}
            />
          </div>
          <div className="flex-1">
            <FlightDateFilterField
              resetForm={resetForm}
              setResetForm={setResetForm}
              filterFormData={filterFormData as FilterFormDataType}
              setFilterFormData={setFilterFormData}
            />
          </div>
          {/* data selector */}
          <div className="flex-1">
            <IssuedDateFilterField
              filterFormData={filterFormData as FilterFormDataType}
              setFilterFormData={setFilterFormData}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-300 py-2 px-4 rounded-lg"
            onClick={() => {
              setFilterFormData((prev) => ({
                ...prev,
                airportCode: "",
                startDate: "",
                endDate: "",
                flightClassType: "",
                createdTimeFilter: "all time",
              }));
              setResetForm(true);
            }}
          >
            Clean filter
          </button>
        </div>
      </div>

      {/* Table */}
      <TicketsTable
        refTicket={ref}
        tickets={tickets}
        totalTickets={totalTickets}
        loading={isLoading}
        selectedTicketTab={selectedTicketTab}
        setSelectedTicketTab={setSelectedTicketTab}
        tabs={tabs}
      />
    </div>
  );
}
export default function MyTickets() {
  const initialTickets: UserTicketResultType[] = [];
  // check user's access
  const loading = useAgencyUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }

  return (
    <SelectedItemsProvider>
      <TicketsContent initialTickets={initialTickets} />
    </SelectedItemsProvider>
  );
}
