import { RootState } from "@/redux/store";
import {
  FlightTicketRes,
  AirlineInfo,
  SelectedFilters,
  SearchState,
  Location,
  SearchFormData,
  FilteredResults,
} from "@/utils/definitions/blockseatsDefinitions";
import { useSelector } from "react-redux";
import { fetchSearchTickets } from "@/lib/data/ticketData";
import { getMinMaxPricesFromLocalStorage } from "./functions";
import { ChangeEvent } from "react";
import { setPriceRange, updateTicket } from "@/redux/features/TicketSlice";

// ################ useSideBarFilters #####################

/**
 * Formats the number of stops into a human-readable label.
 *
 * @param {number | undefined} stops - The number of stops.
 * @returns {string} The formatted stop label.
 *
 * @remarks
 * This function takes a number of stops and returns a human-readable label.
 * If the number of stops is 0, it returns "Direct".
 * If the number of stops is 1, it returns "1 Stop".
 * If the number of stops is greater than 1, it returns "2+ Stops".
 * If the number of stops is undefined or not a number, it returns "Unknown".
 */
export const formatStops = (stops: number | undefined): string => {
  if (stops === 0) return "Direct";
  if (stops === 1) return "1 Stop";
  if (stops && stops > 1) return "2+ Stops";
  return "Unknown";
};

/**
 * Aggregates unique stop labels from a list of flight tickets.
 *
 * @param {FlightTicketRes[]} flights - The list of flight tickets to extract stop labels from.
 * @returns {string[]} An array of unique stop labels.
 *
 * @remarks
 * This function iterates through the provided flight tickets, formats each stop count using the `formatStops` function,
 * and adds the formatted stop label to a set. The set ensures uniqueness of stop labels.
 * Finally, it converts the set to an array and returns it.
 */
export const aggregateStops = (flights: FlightTicketRes[]): string[] => {
  const stopsSet = new Set<string>();
  flights.forEach((flight) => stopsSet.add(formatStops(flight.stops)));
  return Array.from(stopsSet);
};

/**
 * Extracts layover airports from a list of flight tickets.
 *
 * @param {FlightTicketRes[]} flights - The list of flight tickets to extract layover airports from.
 * @returns {Array<{ airportCode: string, city: string, count: number }>} An array of layover airport information objects,
 * each containing the airport code, city, and the number of times it appears as a layover.
 *
 * @remarks
 * This function iterates through the provided flight tickets, extracts layover airports from each segment,
 * and aggregates their counts. The result is an array of layover airport information objects, where each object
 * contains the airport code, city, and the number of times it appears as a layover.
 */
export const extractLayoverAirports = (flights: FlightTicketRes[]) => {
  const layoverMap = new Map<string, { city: string; count: number }>();

  flights.forEach((flight) => {
    flight.segments.forEach((segment, index) => {
      if (index < flight.segments.length - 1) {
        const { airportCode, city } = segment.arrival;
        if (airportCode === flight.segments[index + 1].departure.airportCode) {
          layoverMap.set(airportCode, {
            city,
            count: (layoverMap.get(airportCode)?.count || 0) + 1,
          });
        }
      }
    });
  });

  return Array.from(layoverMap.entries()).map(
    ([airportCode, { city, count }]) => ({
      airportCode,
      city,
      count,
    })
  );
};

/**
 * Extracts airlines from a list of flight tickets and aggregates their counts.
 *
 * @param {FlightTicketRes[]} flights - The list of flight tickets to extract airlines from.
 * @returns {AirlineInfo[]} An array of airline information objects, each containing the airline code, name, and count.
 *
 * @remarks
 * This function iterates through the provided flight tickets, extracts the airline codes from each segment,
 * and aggregates their counts. The result is an array of airline information objects, where each object
 * contains the airline code, name, and count.
 */
export const extractAirlines = (flights: FlightTicketRes[]): AirlineInfo[] => {
  const airlineMap = new Map<string, { name: string; count: number }>();

  flights.forEach((flight) => {
    flight.segments.forEach(({ carrier }) => {
      airlineMap.set(carrier, {
        name: carrier,
        count: (airlineMap.get(carrier)?.count || 0) + 1,
      });
    });
  });

  return Array.from(airlineMap.entries()).map(([code, { name, count }]) => ({
    code,
    name,
    count,
  }));
};

/**
 * Aggregates the minimum and maximum prices from a list of flight tickets.
 *
 * @param {FlightTicketRes[]} flights - The list of flight tickets to aggregate prices from.
 * @returns {{ minPrice: number, maxPrice: number }} An object containing the minimum and maximum prices.
 */
export const aggregatePrices = (flights: FlightTicketRes[]) => {
  const prices = flights.flatMap((flight) =>
    flight.flightClasses
      .filter(({ price }) => price.adult !== null)
      .map(({ id, price }) => ({
        id,
        price: price.adult!,
        currency: price.currency,
      }))
  );

  const pricesArr = prices.map(({ price }) => price);
  return {
    minPrice: Math.min(...pricesArr),
    maxPrice: Math.max(...pricesArr),
  };
};

/**
 * Filters a flight ticket based on its price.
 *
 * @param {FlightTicketRes} ticket - The flight ticket to filter.
 * @param {number} minPrice - The minimum price of the ticket.
 * @param {number} maxPrice - The maximum price of the ticket.
 * @return {boolean} True if the ticket's price is within the specified range, false otherwise.
 */
const filterByPrice = (
  ticket: FlightTicketRes,
  minPrice: number,
  maxPrice: number
): boolean => {
  const ticketPrice = Math.min(
    ...ticket.flightClasses.map((fc) => Number(fc.price.adult) || 10000)
  );
  return ticketPrice >= minPrice && ticketPrice <= maxPrice;
};

/**
 * Filters a flight ticket based on its stops.
 *
 * @param {FlightTicketRes} ticket - The flight ticket to filter.
 * @param {Set<string>} stops - The set of stop labels to filter by.
 * @return {boolean} True if the ticket's stops match the specified stop labels, false otherwise.
 */
const filterByStops = (
  ticket: FlightTicketRes,
  stops: Set<string>,
  isReturn: boolean
): boolean => {
  const stopLabel = formatStops(ticket.stops);
  return stops.size === 0 || stops.has(stopLabel);
};

/**
 * Filters a flight ticket based on its airlines.
 *
 * @param {FlightTicketRes} ticket - The flight ticket to filter.
 * @param {Set<string>} preferredAirlines - The set of preferred airlines to filter by.
 * @return {boolean} True if the ticket's airlines match the preferred airlines, false otherwise.
 */
const filterByPreferredAirlines = (
  ticket: FlightTicketRes,
  preferredAirlines: Set<string>
): boolean => {
  const ticketAirlines = ticket.segments.map((segment) => segment.carrier);
  return (
    preferredAirlines.size === 0 ||
    ticketAirlines.some((airline) => preferredAirlines.has(airline))
  );
};

/**
 * Checks if a flight ticket's layover airports match the specified airports.
 *
 * @param {FlightTicketRes} ticket - The flight ticket to check.
 * @param {Set<string>} layoverAirports - The set of layover airports to check against.
 * @return {boolean} True if the ticket's layover airports match the specified airports, false otherwise.
 */
const filterByLayoverAirports = (
  ticket: FlightTicketRes,
  layoverAirports: Set<string>
): boolean => {
  const layoverCodes = ticket.segments
    .slice(0, -1)
    .map((segment) => segment.arrival.airportCode);
  return (
    layoverAirports.size === 0 ||
    layoverCodes.some((code) => layoverAirports.has(code))
  );
};

/**
 * Filters departure and return flight tickets based on the provided filters.
 *
 * @param {FlightTicketRes[]} departureTickets - The list of departure flight tickets to filter.
 * @param {FlightTicketRes[]} returnTickets - The list of return flight tickets to filter.
 * @param {SelectedFilters} filters - The filters to apply to the flight tickets.
 * @return {{filteredDepartureTickets: FlightTicketRes[], filteredReturnTickets: FlightTicketRes[]}} - An object containing the filtered departure and return flight tickets.
 */
export const filterTickets = (
  departureTickets: FlightTicketRes[],
  returnTickets: FlightTicketRes[],
  filters: SelectedFilters
): {
  filteredDepartureTickets: FlightTicketRes[];
  filteredReturnTickets: FlightTicketRes[];
} => {
  const filteredDepartureTickets = departureTickets.filter((ticket) => {
    return (
      filterByPrice(ticket, filters.minPrice, filters.maxPrice) &&
      filterByStops(ticket, filters.departureStops, false) &&
      filterByPreferredAirlines(ticket, filters.preferredAirlines) &&
      filterByLayoverAirports(ticket, filters.layoverAirports)
    );
  });

  const filteredReturnTickets = returnTickets.filter((ticket) => {
    return (
      filterByPrice(ticket, filters.minPrice, filters.maxPrice) &&
      filterByStops(ticket, filters.returnStops, true) &&
      filterByPreferredAirlines(ticket, filters.preferredAirlines) &&
      filterByLayoverAirports(ticket, filters.layoverAirports)
    );
  });

  return { filteredDepartureTickets, filteredReturnTickets };
};

/**
 * Initializes the filters for the search results page.
 *
 * @param {Object} priceRange - The range of prices for the tickets.
 * @param {number} priceRange.minPrice - The minimum price for the tickets.
 * @param {number} priceRange.maxPrice - The maximum price for the tickets.
 *
 * @returns {SelectedFilters} - The initialized filters object.
 *
 * The filters object contains sets for popular filters, departure stops, return stops,
 * preferred airlines, layover airports, and the minimum and maximum prices.
 */
export const initializeFilters = (priceRange: {
  minPrice: number;
  maxPrice: number;
}): SelectedFilters => ({
  popularFilters: new Set<string>(),
  departureStops: new Set<string>(),
  returnStops: new Set<string>(),
  preferredAirlines: new Set<string>(),
  layoverAirports: new Set<string>(),
  minPrice: priceRange.minPrice,
  maxPrice: priceRange.maxPrice,
});

/**
 * Filters departure and return tickets to only include those with valid adult prices.
 *
 * @param {Object} obj - An object containing departure and return tickets.
 * @param {FlightTicketRes[]} obj.departureTickets - Array of departure flight tickets.
 * @param {FlightTicketRes[]} obj.returnTickets - Array of return flight tickets.
 * @return {Object} An object containing filtered departure and return tickets.
 */
export const filterValidTickets = ({
  departureTickets,
  returnTickets,
}: {
  departureTickets: FlightTicketRes[];
  returnTickets: FlightTicketRes[];
}) => ({
  departureTickets: departureTickets.filter((ticket) =>
    ticket.flightClasses.some(
      (flightClass) =>
        flightClass.price.adult && !isNaN(Number(flightClass.price.adult))
    )
  ),
  returnTickets: returnTickets.filter((ticket) =>
    ticket.flightClasses.some(
      (flightClass) =>
        flightClass.price.adult && !isNaN(Number(flightClass.price.adult))
    )
  ),
});

/**
 * Combines departure and return flights into a single object.
 *
 * @param {Object} filteredTickets - An object containing departure and return tickets.
 * @param {FlightTicketRes[]} filteredTickets.departureTickets - Array of departure flight tickets.
 * @param {FlightTicketRes[]} filteredTickets.returnTickets - Array of return flight tickets.
 * @return {Object} An object containing departure flights, return flights, and all flights combined.
 */
export const combineFlights = (filteredTickets: {
  departureTickets: FlightTicketRes[];
  returnTickets: FlightTicketRes[];
}) => ({
  departureFlights: filteredTickets.departureTickets,
  returnFlights: filteredTickets.returnTickets,
  allFlights: [
    ...filteredTickets.departureTickets,
    ...filteredTickets.returnTickets,
  ],
});

/**
 * Handles changes to the price sliders in the search results page.
 * Adjusts the minimum or maximum price based on the user's input and the current filter values.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The event object that triggered the price change.
 * @param {"minPrice" | "maxPrice"} priceType - The type of price being changed ("minPrice" or "maxPrice").
 * @param {React.Dispatch<React.SetStateAction<SelectedFilters>>} setSelectedFilters - The function to update the selected filters.
 * @return {void}
 */
export const handlePriceChange = (
  event: ChangeEvent<HTMLInputElement>,
  priceType: "minPrice" | "maxPrice",
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>
) => {
  const value = Number(event.target.value);
  setSelectedFilters((prevFilters: SelectedFilters) => {
    const adjustedValue =
      priceType === "minPrice"
        ? Math.min(value, prevFilters.maxPrice - 1)
        : Math.max(value, prevFilters.minPrice + 1);
    return { ...prevFilters, [priceType]: adjustedValue };
  });
};

/**
 * Checks if the given filter type is a price filter.
 *
 * @param {keyof SelectedFilters} filterType - The type of filter to check.
 * @return {boolean} True if the filter type is a price filter, false otherwise.
 */
const isPriceFilter = (filterType: keyof SelectedFilters): boolean =>
  filterType === "minPrice" || filterType === "maxPrice";

/**
 * Toggles the presence of a value in a set.
 *
 * @param {Set<string>} set - The original set to modify.
 * @param {string} value - The value to add or remove from the set.
 * @return {Set<string>} A new set with the value added or removed.
 */
const toggleSetValue = (set: Set<string>, value: string): Set<string> => {
  const newSet = new Set(set);
  newSet.has(value) ? newSet.delete(value) : newSet.add(value);
  return newSet;
};

/**
 * Resets the filters to their initial state.
 *
 * @param {any} dispatch - The dispatch function from the Redux store.
 * @param {SelectedFilters} selectedFilters - The current selected filters.
 * @param {React.Dispatch<React.SetStateAction<SelectedFilters>>} setSelectedFilters - The function to update the selected filters.
 * @param {{ minPrice: number; maxPrice: number }} priceRange - The current price range.
 * @param {() => void} applyFilters - The function to apply the filters.
 * @return {void}
 */
export const resetFilters = (
  dispatch: any,
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>,
  priceRange: { minPrice: number; maxPrice: number },
  departureTickets: FlightTicketRes[],
  returnTickets: FlightTicketRes[]
) => {
  setSelectedFilters(initializeFilters(priceRange));
  dispatch(setPriceRange(priceRange));
  const filteredResults: FilteredResults = {
    departureTickets,
    returnTickets,
    filteredDepartureTickets: departureTickets,
    filteredReturnTickets: returnTickets,
  };
  dispatch(updateTicket(filteredResults));
};

/**
 * Updates the selected filters by changing the value of a specific filter type.
 *
 * @param {keyof SelectedFilters} filterType - The type of filter to update.
 * @param {React.Dispatch<React.SetStateAction<SelectedFilters>>} setSelectedFilters - The function to update the selected filters.
 * @param {string | number} value - The new value for the filter.
 * @return {void}
 */
export const updateFilter = (
  filterType: keyof SelectedFilters,
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>,
  value: string | number
) => {
  setSelectedFilters((prevFilters) => ({
    ...prevFilters,
    [filterType]: isPriceFilter(filterType)
      ? (value as number)
      : toggleSetValue(prevFilters[filterType] as Set<string>, value as string),
  }));
};

// ################ useSideBarFilters #####################

// ################ useSearchTickets #####################

// Custom hook to select state from the Redux store
export const useAppSelector = (selector: (state: RootState) => any) =>
  useSelector(selector);

// Creates an Airport object from URLSearchParams for a given prefix
const createAirport = (params: URLSearchParams, prefix: string): Location => ({
  id: parseInt(params.get(`${prefix}Id`) || "-1"),
  airportCode: params.get(`${prefix}Code`) || "",
  city: params.get(`${prefix}City`) || "",
  country: params.get(`${prefix}Country`) || "",
  airport: params.get(`${prefix}Airport`) || "",
});

// Maps a stop description to a corresponding code
const parseStops = (params: URLSearchParams): string[] => {
  const stopMapping: Record<string, string> = {
    Direct: "0",
    "1 Stop": "1",
    "2+ Stops": "2+",
  };

  const convertStopsToNumber = (stop: string): string =>
    stopMapping[stop] !== undefined ? stopMapping[stop] : "-1";

  // Parses the stop information from the URLSearchParams for a specific direction
  const parseStopsForDirection = (direction: string): string[] =>
    params
      .getAll(`${direction}Stops`)
      .map((stop) => convertStopsToNumber(decodeURIComponent(stop)));

  const departureStops = parseStopsForDirection("departure");
  const returnStops = parseStopsForDirection("return");

  return Array.from(new Set([...departureStops, ...returnStops]));
};

// Converts URLSearchParams to a SearchState object
export const paramsToSearchState = (params: URLSearchParams): SearchState => ({
  itinerary:
    params.get("itinerary") === "round trip" ? "round trip" : "one way",
  departure: createAirport(params, "departure"),
  arrival: createAirport(params, "arrival"),
  flightDate: params.get("flightDate"),
  returnDate: params.get("returnDate"),
  travelClass: params.get("travelClass") || "Economy",
  passengers: {
    adults: parseInt(params.get("adults") || "1"),
    children: parseInt(params.get("children") || "0"),
    infants: parseInt(params.get("infants") || "0"),
  },
  price: {
    gr: params.get("gr") !== null ? parseFloat(params.get("gr")!) : 0,
    ls: params.get("ls") !== null ? parseFloat(params.get("ls")!) : 0,
  },
  airlines: params.getAll("preferredAirlines") || [],
  layoverAirports: params.getAll("layoverAirports") || [],
  stops: parseStops(params),
});

// fetch function

/**
 * Creates a SearchFormData object based on the provided SearchState and return flag.
 *
 * @param {SearchState} searchState - The search state to derive the form data from.
 * @param {boolean} [isReturn=false] - Whether the form data is for a return flight.
 * @return {SearchFormData} The created form data.
 */
const createFormData = (
  searchState: SearchState,
  isReturn: boolean = false
): SearchFormData => {
  const baseFormData: SearchFormData = {
    from: isReturn
      ? searchState.arrival.airportCode
      : searchState.departure.airportCode,
    to: isReturn
      ? searchState.departure.airportCode
      : searchState.arrival.airportCode,
    itinerary: "one way", // Always set as "one way" since round trip is handled by separate calls
    flightDate: isReturn ? searchState.returnDate : searchState.flightDate,
    flightClass: searchState.travelClass?.toLowerCase() || "economy",
    price: {
      gr: searchState.price.gr!,
      ls: searchState.price.ls!,
    },
    airlines: searchState.airlines ?? [],
    layoverAirports: searchState.layoverAirports ?? [],
    stops: searchState.stops ?? [],
  };

  return baseFormData;
};

export const apiService = {
  /**
   * Fetches search tickets based on the provided form data and status.
   *
   * @param {SearchFormData} formData - The form data containing search criteria.
   * @param {string} status - The status of the tickets to fetch.
   * @param {string} [cursor] - The cursor for pagination.
   * @return {any} The fetched search tickets.
   */
  fetchSearchTickets: async (
    formData: SearchFormData,
    status: string,
    cursor?: string
  ) => {
    return fetchSearchTickets(formData, status, cursor);
  },

  /**
   * Fetches round trip tickets based on the provided search state.
   *
   * @param {SearchState} searchState - The search state containing departure and return dates, itinerary, etc.
   * @return {{ departureTicket: any[], returnTicket: any[] }} - An object containing departure and return tickets.
   */
  fetchRoundTripTickets: async (searchState: SearchState) => {
    // Create form data for both departure and return flights
    const departureFormData = createFormData(searchState);
    const returnFormData = createFormData(searchState, true);

    const [departureResponse, returnResponse] = await Promise.all([
      apiService.fetchSearchTickets(departureFormData, "active"), // Fetch departure tickets
      searchState.itinerary === "round trip" && searchState.returnDate // Fetch return tickets only if it's a round trip and a return date is provided
        ? apiService.fetchSearchTickets(returnFormData, "active")
        : Promise.resolve({
            // If not, return an empty list for return tickets
            success: true,
            results: {
              departure: { tickets: [], totalTickets: 0, nextCursor: null },
            },
          }),
    ]);

    // Extract tickets from the responses, defaulting to empty arrays if undefined
    const results = {
      departureTicket: departureResponse?.results?.departure?.tickets || [],
      returnTicket: returnResponse?.results?.departure?.tickets || [],
    };

    // Calculate and store min/max prices for the fetched tickets
    getMinMaxPricesFromLocalStorage(
      results.departureTicket,
      results.returnTicket
    );
    return {
      departureTicket: results.departureTicket,
      returnTicket: results.returnTicket,
    };
  },
};
// fetch function

// ################ useSearchTickets #####################
