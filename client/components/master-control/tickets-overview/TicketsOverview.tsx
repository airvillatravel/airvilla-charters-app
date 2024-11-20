"use client";
import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import {
  fetchAllAgencyNamesForMaster,
  fetchAllTicketsForMaster,
} from "@/lib/data/masterTicketsData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  MasterTicketResultType,
  TicketRequestDataType,
} from "@/utils/definitions/masterDefinitions";
import TicketsOverviewTable from "./TicketsOverviewTable";
import FilterAirportDepDropdown from "./FilterAirportDepDropdown";
import FilterDropdown from "./FilterDropdown";
import FlightDateFilterField from "@/components/flight-tickets/myTickets/FlightDateFilterField";
import IssuedDateFilterField from "@/components/flight-tickets/myTickets/IssuedDateFilterField";

const tabs = [
  "available",
  "unavailable",
  "hold",
  "rejected",
  "blocked",
  "expired",
];

const flightClassTypes = [
  { id: 0, value: "" },
  { id: 1, value: "economy" },
  { id: 2, value: "premium economy" },
  { id: 3, value: "business class" },
  { id: 4, value: "first class" },
];
const TicketsOverviewSection = () => {
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

  const [filterData, setFilterData] = useState<TicketRequestDataType>({
    agencyName: "all",
    createdTimeFilter: "all time",
    airportCode: "",
    startDate: "",
    endDate: "",
    flightClassType: "",
  });

  // agencies names state
  const [agencyNamesOptions, setAgencyNamesOptions] = useState([
    {
      id: 0,
      value: "all",
    },
  ]);

  // clicked for reset
  const [resetForm, setResetForm] = useState(false);

  // ########## FUNCTIONS ##########

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

  // fetch agency names
  const fetchAllAgencyNames = async (): Promise<void> => {
    // Fetch all agency names for master
    const agencyData = await fetchAllAgencyNamesForMaster();

    // If the request is successful, update the options state
    if (agencyData.success) {
      // Map the agency names to options format and add them to the existing options
      const agencyNameList = agencyData.results.map(
        (agencyName: string, idx: number) => {
          return { id: idx + 1, value: agencyName };
        }
      );
      setAgencyNamesOptions([...agencyNamesOptions, ...agencyNameList]);
    }
    // Dispatch the action to update the message state
    dispatch(
      setMsg({
        success: agencyData.success,
        message: agencyData.message,
      })
    );
  };

  // ########## EFFECTS ##########
  // call to load more users whenever scroll
  useEffect(() => {
    if (inView) {
      loadingMoreTickets();
    }
  }, [inView]);

  // fetch all tickets
  useEffect(() => {
    fetchAllMasterTickets();
  }, [filterData, selectedTicketTab, resetForm]);

  useEffect(() => {
    fetchAllAgencyNames();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-8 w-full max-w-7xl mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Tickets Overview
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="relative mb-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg pb-7 pt-5 px-1 sm:px-3 ">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Departure filter */}
          <div className="flex-1">
            <FilterAirportDepDropdown
              selectedAirportCode={filterData.airportCode}
              onChangeHandler={(airportCode) =>
                setFilterData({ ...filterData, airportCode })
              }
            />
          </div>

          {/*  Flight class filter */}
          <div className="flex-1">
            <FilterDropdown
              fieldName="Flight class"
              options={flightClassTypes}
              selectedOption={filterData.flightClassType}
              onChangeHandler={(flightClassType) =>
                setFilterData({ ...filterData, flightClassType })
              }
            />
          </div>

          {/* Date filter */}
          <div className="flex-1">
            <FlightDateFilterField
              filterFormData={filterData}
              setFilterFormData={(formData) =>
                setFilterData(formData as TicketRequestDataType)
              }
              resetForm={resetForm}
              setResetForm={setResetForm}
            />
          </div>

          {/* Agency name filter */}
          <div className="flex-1">
            <FilterDropdown
              fieldName="Agency name"
              options={agencyNamesOptions}
              selectedOption={filterData.flightClassType}
              onChangeHandler={(value) =>
                setFilterData({ ...filterData, agencyName: value })
              }
            />
          </div>

          {/* Status filter */}
          <div className="flex-1">
            <IssuedDateFilterField
              filterFormData={filterData}
              setFilterFormData={(formData) => setFilterData(formData as any)}
            />
          </div>
          {/* Clear filter */}
          <button
            type="button"
            className="bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-300 py-2 px-4 rounded-lg"
            onClick={() => {
              setFilterData({
                agencyName: "all",
                createdTimeFilter: "all time",
                airportCode: "",
                startDate: "",
                endDate: "",
                flightClassType: "",
              });
              setResetForm(true);
            }}
          >
            Clean filter
          </button>
        </div>
      </div>

      {/* Table */}
      <TicketsOverviewTable
        tickets={tickets}
        totalTickets={totalTickets}
        isLoading={isLoading}
        refId={ref}
        tabs={tabs}
        selectedTicketTab={selectedTicketTab}
        setSelectedTicketTab={setSelectedTicketTab}
      />
    </div>
  );
};
export default function TicketsOverview() {
  const loading = useAgencyUserAuth();

  if (loading === true) {
    return <ProgressLoading />;
  }
  return <TicketsOverviewSection />;
}
