import { setTickets } from "@/redux/features/TicketSlice";
import { RootState } from "@/redux/store";
import {
  FlightTicketRes,
  initialSearchState,
  SearchState,
} from "@/utils/definitions/blockseatsDefinitions";
import { apiService } from "@/utils/functions/flightSearchTickets";
import { paramsToSearchState } from "@/utils/functions/flightSearchTickets";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useSearchTickets = () => {
  // Selectors to get the necessary ticket data from the Redux store
  const {
    priceRange,
    departureTickets,
    returnTickets,
    filteredDepartureTickets,
    filteredReturnTickets,
  } = useSelector((state: RootState) => state.fetchedTicket);

  // Check if no tickets were found after filtering
  const noTicketsFound =
    filteredDepartureTickets.length === 0 && filteredReturnTickets.length === 0;

  const searchParams = useSearchParams(); // Hook to access the search parameters from the URL
  const dispatch = useDispatch();

  const prevSearchStateRef = useRef<SearchState>(initialSearchState); // Reference to hold the previous search state

  // ######### useState #########
  const [searchState, setSearchState] =
    useState<SearchState>(initialSearchState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
    null
  );
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);

  // Combine selected departure and return ticket IDs
  const combinedId = `${selectedDeparture}_${selectedReturn}`;

  // Handle the completion of the search and dispatch the results to Redux store
  const handleSearchComplete = useCallback(
    (tickets: {
      departureTicket: FlightTicketRes[];
      returnTicket: FlightTicketRes[];
    }) => {
      dispatch(
        setTickets({
          departureTickets: tickets.departureTicket,
          returnTickets: tickets.returnTicket,
          filteredDepartureTickets: tickets.departureTicket,
          filteredReturnTickets: tickets.returnTicket,
        })
      );
    },
    [dispatch]
  );

  // Fetch data based on the current search state
  const fetchData = useCallback(async (state: SearchState) => {
    if (!state.departure?.airportCode || !state.arrival?.airportCode) return;

    setLoading(true);
    setError(null);

    try {
      const results = await apiService.fetchRoundTripTickets(state);
      handleSearchComplete(results);
    } catch (error) {
      setError("An error occurred while fetching tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to monitor changes in the search parameters and trigger a new search if necessary
  useEffect(() => {
    const newSearchState = paramsToSearchState(searchParams);

    if (
      JSON.stringify(newSearchState) !==
      JSON.stringify(prevSearchStateRef.current)
    ) {
      setSearchState(newSearchState);
      prevSearchStateRef.current = newSearchState;
      fetchData(newSearchState);
    }
  }, [searchParams]);

  // Toggle the visibility of the sidebar
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    []
  );

  // Handle the selection of a ticket
  const handleSelectTicket = useCallback(
    (ticket: FlightTicketRes, isReturnFlight: boolean) => {
      const setSelected = isReturnFlight
        ? setSelectedReturn
        : setSelectedDeparture;
      setSelected((prev) => (prev === ticket.id ? null : ticket.id));
    },
    []
  );

  // Determine the state of a ticket (selected or not)
  const getTicketState = useCallback(
    (ticketId: string, isReturnFlight: boolean): "select" | "selected" =>
      (isReturnFlight ? selectedReturn : selectedDeparture) === ticketId
        ? "selected"
        : "select",
    [selectedDeparture, selectedReturn]
  );

  return {
    loading,
    setLoading,
    error,
    setError,
    fetchData,
    state: searchState,
    setState: setSearchState,
    isSidebarOpen,
    toggleSidebar,
    handleSelectTicket,
    getTicketState,
    combinedId,
    handleFindTicketsClick: () => fetchData(searchState),
    departureTickets,
    returnTickets,
    filteredDepartureTickets,
    filteredReturnTickets,
    selectedDeparture,
    selectedReturn,
    priceRange,
    noTicketsFound,
  };
};
