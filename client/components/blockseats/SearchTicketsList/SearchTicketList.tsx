"use client";
import React from "react";
import { SearchSideBarFilters } from "./SideBarFilters/SideBarFilters";
import SearchBarList from "./SearchBarList";
import { TicketList } from "./TicketList";
import useAffiliateUserAuth from "@/components/hooks/useAffiliateUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { useSearchTickets } from "@/components/hooks/useSearchTicket";
import Banner from "./Banner";
import FlightSearchSummary from "./FlightSearchSummary";
import { SideBarToggleButton } from "./SideBarToggleButton";

const SearchTicketsListSection = () => {
  const {
    loading,
    error,
    state,
    isSidebarOpen,
    toggleSidebar,
    handleSelectTicket,
    getTicketState,
    combinedId,
    departureTickets,
    returnTickets,
    filteredDepartureTickets,
    filteredReturnTickets,
    selectedDeparture,
    selectedReturn,
    priceRange,
    noTicketsFound,
  } = useSearchTickets();

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Search Bar */}
      <SearchBarList />

      {/* Main content */}
      <div className="w-full max-w-7xl px-2 md:px-10">
        {/* Flight Search Summary */}
        <FlightSearchSummary
          departureTickets={departureTickets}
          returnTickets={returnTickets}
          state={state}
        />

        {/* Banner  */}
        <Banner />

        <section className="mx-auto w-full min-w-7xl flex flex-col md:flex-row items-center justify-center">
          <div className="container">
            <div className="flex flex-col md:flex-row mt-8 xl:space-x-8">
              {/* Sidebar filters */}
              <SearchSideBarFilters
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                priceRange={priceRange}
              />

              <div className="w-full 2xl:w-3/4 mx-auto mt-8 md:mt-0">
                {/*   LOADING & ERROR */}
                {loading && <StatusMessage type="loading" />}
                {error && <StatusMessage type="error" message={error} />}

                {!loading && !error && noTicketsFound && (
                  <StatusMessage type="noTickets" />
                )}

                {/*  TICKETS  LIST*/}
                {!loading && !error && !noTicketsFound && (
                  <section className="max-w-7xl mx-auto w-full">
                    <span className="flex justify-end pb-4">
                      <SideBarToggleButton
                        isOpen={isSidebarOpen}
                        onClick={toggleSidebar}
                      />
                    </span>
                    <TicketList
                      searchedTickets={{
                        departureTicket: filteredDepartureTickets,
                        returnTicket: filteredReturnTickets,
                      }}
                      searchState={state}
                      onSelectTicket={handleSelectTicket}
                      selectedDeparture={selectedDeparture}
                      selectedReturn={selectedReturn}
                      getTicketState={getTicketState}
                      combinedId={combinedId}
                    />
                    <div style={{ height: "20px" }}></div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatusMessage = ({
  type,
  message,
}: {
  type: "loading" | "error" | "noTickets";
  message?: string;
}) => {
  const messages = {
    loading: "Loading tickets...",
    error: message || "An error occurred",
    noTickets: "No Tickets Found",
  };
  const className = `text-center text-4xl font-bold ${
    type === "error" ? "text-red-500" : ""
  }`;
  return <div className={className}>{messages[type]}</div>;
};

export default function SearchTicketsList() {
  const loading = useAffiliateUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }

  return <SearchTicketsListSection />;
}
