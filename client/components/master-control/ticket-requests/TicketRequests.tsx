"use client";
import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { fetchAllTicketsForMaster } from "@/lib/data/masterTicketsData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AgencyNamesFilter from "./AgencyNamesFilter";
import {
  MasterTicketResultType,
  TicketRequestDataType,
} from "@/utils/definitions/masterDefinitions";
import IssuedDateFilterMaster from "./IssuedDateFilterMaster";
import TicketRequestsTable from "./TicketRequestsTable";

// ticket tabs
const tabs = ["pending", "updated"];

const TicketRequestsList = () => {
  // ########## STATES #########
  // hooks
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView();
  // data state for tickets
  const [tickets, setTickets] = useState<MasterTicketResultType[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);

  // states for loading
  const [isLoading, setIsLoading] = useState(false);

  // states tabs
  const [selectedTicketTab, setSelectedTicketTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    return tabs.includes(hash) ? hash : tabs[0];
  });

  // filter data
  const [filterData, setFilterData] = useState<TicketRequestDataType>({
    agencyName: "all",
    createdTimeFilter: "all time",
    airportCode: "",
    startDate: "",
    endDate: "",
    flightClassType: "",
  });

  const [resetForm, setResetForm] = useState(false);

  // ########## FUNCTIONS ##########
  // load more users
  const loadingMoreTickets = async (): Promise<void> => {
    // Check if there is already a loading or if there is no next cursor
    if (isLoading || !nextCursor) return;

    // Set the loading state to true
    setIsLoading(true);

    // Fetch the next page of tickets
    const ticketData = await fetchAllTicketsForMaster(
      filterData,
      selectedTicketTab?.toLowerCase() !== "updated"
        ? selectedTicketTab
        : "all",
      selectedTicketTab?.toLowerCase() === "updated" ? true : null,
      nextCursor
    );

    // If the request is successful, update the tickets state
    if (ticketData.success) {
      setTickets([...tickets, ...ticketData?.results?.tickets]);
      setNextCursor(ticketData.results.nextCursor);
    }

    // Dispatch the action to update the message state
    dispatch(
      setMsg({
        success: ticketData.success,
        message: ticketData.message,
      })
    );

    // Reset the loading state
    setIsLoading(false);
  };

  // ########## EFFECTS ##########
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
      loadingMoreTickets();
    }
  }, [inView]);

  // fetch all tickets
  useEffect(() => {
    // fetch all tickets for master
    const fetchAllMasterTickets = async (): Promise<void> => {
      setIsLoading(true);
      setTickets([]);
      // Fetch all tickets for master
      const ticketData = await fetchAllTicketsForMaster(
        filterData,
        selectedTicketTab?.toLowerCase() !== "updated"
          ? selectedTicketTab
          : "all",
        selectedTicketTab?.toLowerCase() === "updated" ? true : null
      );

      // If the request is successful, update the tickets state
      if (ticketData.success) {
        setTickets(ticketData?.results?.tickets);
        setTotalTickets(ticketData.results.totalTickets);
        setNextCursor(ticketData.results.nextCursor);
      }

      // Dispatch the action to update the message state
      dispatch(
        setMsg({
          success: ticketData.success,
          message: ticketData.message,
        })
      );

      // Set the loading state to false
      setIsLoading(false);
    };

    fetchAllMasterTickets();
  }, [filterData, selectedTicketTab, resetForm]);

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-8 w-full max-w-7xl mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Ticket Requests
          </h1>
        </div>
      </div>
      <div className="relative mb-5 bg-white dark:bg-gray-800 rounded-lg pb-7 pt-5 px-1 sm:px-3 ">
        {/* Right side */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
          {" "}
          <div className="flex-1">
            <AgencyNamesFilter
              filterData={filterData}
              setFilterData={setFilterData}
            />
          </div>
          <div className="flex-1">
            <IssuedDateFilterMaster
              filterData={filterData}
              setFilterData={setFilterData}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-300 py-2 px-4 rounded-lg flex-1"
            onClick={() => {
              setFilterData((prev) => ({
                ...prev,
                agencyName: "all",
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
      <TicketRequestsTable
        tickets={tickets}
        totalTickets={totalTickets}
        isLoading={isLoading}
        refId={ref}
        selectedTicketTab={selectedTicketTab}
        setSelectedTicketTab={setSelectedTicketTab}
      />
    </div>
  );
};
export default function TicketRequests() {
  const loading = useAgencyUserAuth();

  if (loading === true) {
    return <ProgressLoading />;
  }
  return <TicketRequestsList />;
}
