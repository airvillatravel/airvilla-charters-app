import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  FilteredResults,
  FlightTicketRes,
  SearchSideBarFiltersProps,
  SelectedFilters,
} from "@/utils/definitions/blockseatsDefinitions";
import { setPriceRange, updateTicket } from "@/redux/features/TicketSlice";
import {
  aggregateStops,
  extractLayoverAirports,
  extractAirlines,
  aggregatePrices,
  filterTickets,
  initializeFilters,
  filterValidTickets,
  combineFlights,
  handlePriceChange,
  resetFilters,
  updateFilter,
} from "@/utils/functions/flightSearchTickets";

// Main hook
export const useSideBarFilters = ({
  isOpen,
  toggleSidebar,
}: SearchSideBarFiltersProps) => {
  const dispatch = useDispatch();
  const { departureTickets, returnTickets, priceRange } = useSelector(
    (state: RootState) => state.fetchedTicket
  );

  // ########## REFS & STATES ##############
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isApplyFiltersHovered, setIsApplyFiltersHovered] =
    useState<Boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState(
    initializeFilters(priceRange)
  );
  const [minValue, setMinValue] = useState<number>(priceRange.minPrice);
  const [maxValue, setMaxValue] = useState<number>(priceRange.maxPrice);

  // ########## MEMOIZED VALUES ##############
  const filteredTickets = useMemo(
    () => filterValidTickets({ departureTickets, returnTickets }),
    [departureTickets, returnTickets]
  );
  const combinedFlights = useMemo(
    () => combineFlights(filteredTickets),
    [filteredTickets]
  );

  const departureStops = useMemo(
    () => aggregateStops(combinedFlights.departureFlights),
    [combinedFlights]
  );
  const returnStops = useMemo(
    () => aggregateStops(combinedFlights.returnFlights),
    [combinedFlights]
  );
  const layoverAirports = useMemo(
    () => extractLayoverAirports(combinedFlights.allFlights),
    [combinedFlights]
  );
  const preferredAirline = useMemo(
    () => extractAirlines(combinedFlights.allFlights),
    [combinedFlights]
  );
  const prices = useMemo(
    () => aggregatePrices(combinedFlights.allFlights),
    [combinedFlights]
  );

  // ########## EFFECTS ##############
  useEffect(() => {
    setMinValue(prices.minPrice); // to set min value input
    setMaxValue(prices.maxPrice); // to set max value input
    setSelectedFilters(initializeFilters(prices)); // to set prices to min & max values of slider and all checkboxes & button of filters
  }, [prices]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, toggleSidebar]);

  // ########## HANDLERS ##############
  const handleSliderChange = useCallback((min: number, max: number) => {
    setMinValue(min);
    setMaxValue(max);
    updateFilter("minPrice", setSelectedFilters, min);
    updateFilter("maxPrice", setSelectedFilters, max);
  }, []);

  const handleMinChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      handlePriceChange(event, "minPrice", setSelectedFilters),
    []
  );

  const handleMaxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      handlePriceChange(event, "maxPrice", setSelectedFilters),
    []
  );

  const handleFilterChange = useCallback(
    (filterType: keyof SelectedFilters, value: string | number) => {
      updateFilter(filterType, setSelectedFilters, value.toString());
    },
    []
  );

  const applyFilters = useCallback(() => {
    const { filteredDepartureTickets, filteredReturnTickets } = filterTickets(
      departureTickets,
      returnTickets,
      selectedFilters
    );

    const filteredResults: FilteredResults = {
      departureTickets,
      returnTickets,
      filteredDepartureTickets: filteredDepartureTickets ?? departureTickets,
      filteredReturnTickets: filteredReturnTickets ?? returnTickets,
    };
    dispatch(updateTicket(filteredResults));
  }, [departureTickets, returnTickets, selectedFilters, dispatch]);

  const handleClear = useCallback(() => {
    resetFilters(
      dispatch,
      setSelectedFilters,
      priceRange,
      departureTickets,
      returnTickets
    );
    setMinValue(prices.minPrice);
    setMaxValue(prices.maxPrice);
    dispatch(setPriceRange(prices));
  }, [dispatch, selectedFilters, priceRange, prices, applyFilters]);

  // ########## RETURN OBJECT ##############
  return {
    filters: {
      isApplyFiltersHovered,
      setIsApplyFiltersHovered,
      selectedFilters,
      departureStops,
      returnStops,
      preferredAirline,
      layoverAirports,
      handleFilterChange,
      handleClear,
      applyFilters,
    },
    priceControls: {
      minValue,
      maxValue,
      prices: priceRange,
      handleSliderChange,
      handleMinChange,
      handleMaxChange,
    },
    sidebarRef,
    overlayRef,
  };
};
