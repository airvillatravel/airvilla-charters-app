import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/functions/functions";
import {
  initialAirport,
  initialSearchState,
  SearchState,
} from "@/utils/definitions/blockseatsDefinitions";

export const useSearchState = () => {
  const router = useRouter();

  // ######### useState #########
  const [searchState, setSearchState] =
    useState<SearchState>(initialSearchState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ######### Handlers #########

  /**
   * Updates the search state with a new itinerary type.
   *
   * @param {("one way" | "round trip")} value - The new itinerary type to be set in the search state.
   * @returns {void}
   */
  const handleItineraryChange = useCallback(
    (value: "one way" | "round trip") => {
      setSearchState((prev) => ({
        ...prev,
        itinerary: value,
      }));
    },
    []
  );

  /**
   * Updates the search state with a new travel class.
   *
   * @param {string} value - The new travel class to be set in the search state.
   * @return {void}
   */
  const handleTravelClassChange = useCallback((value: string) => {
    setSearchState((prev) => ({
      ...prev,
      travelClass: value,
    }));
  }, []);

  /**
   * Updates the search state with new passenger information.
   *
   * @param {object} value - An object containing new passenger data.
   * @return {void}
   */
  const handlePassengersChange = useCallback((value: object) => {
    setSearchState((prevState) => ({
      ...prevState,
      passengers: { ...prevState.passengers, ...value },
    }));
  }, []);

  /**
   * Updates the search state with new location data and handles errors for departure and arrival cities.
   *
   * @param {keyof SearchState} key - The key of the location to update (either "departure" or "arrival").
   * @param {any} value - The new location data.
   * @return {void}
   */
  const handleLocationsChange = useCallback(
    (key: keyof SearchState, value: any) => {
      setSearchState((prevState) => {
        if (key === "departure" || key === "arrival") {
          const otherKey = key === "departure" ? "arrival" : "departure";

          // Check if both fields are empty
          if (!value.airportCode && !prevState[otherKey].airportCode) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[key];
              delete newErrors[otherKey];
              return newErrors;
            });
            return { ...prevState, [key]: value };
          }

          // Auto-clear the other field if the same airport is selected
          if (
            value.airportCode &&
            value.airportCode === prevState[otherKey].airportCode
          ) {
            // setErrors((prev) => ({
            //   ...prev,
            //   [key]:
            //     "The same airport cannot be selected for both fields. The other field has been cleared.",
            // }));

            // Clear the other field to avoid duplication
            return {
              ...prevState,
              [key]: value,
              [otherKey]: { airportCode: "", airportName: "" }, // Clear the other field
            };
          }

          // Check if the cities are the same (only if both have values)
          if (
            value.airportCode &&
            value.airportCode === prevState[otherKey].airportCode
          ) {
            setErrors((prev) => ({
              ...prev,
              [key]: "Departure and arrival cities cannot be the same.",
              [otherKey]: "Departure and arrival cities cannot be the same.",
            }));
            return prevState;
          }

          // Clear errors if everything is valid
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[key];
            delete newErrors[otherKey];
            return newErrors;
          });

          return { ...prevState, [key]: value };
        }

        return prevState;
      });
    },
    []
  );

  /**
   * Updates the search state with new flight date and return date information.
   *
   * @param {{ flightDate: string; returnDate: string | null }} dates - An object containing new flight date and return date data.
   * @return {void}
   */
  const handleDateChange = useCallback(
    (dates: { flightDate: string; returnDate: string | null }) => {
      setSearchState((prev) => ({
        ...prev,
        flightDate: dates.flightDate,
        returnDate: dates.returnDate,
      }));
    },
    []
  );

  /**
   * Handles the flipping of departure and arrival locations in the search state.
   *
   * @remarks
   * This function is a callback for a button click or similar event that triggers the flipping of the departure and arrival locations.
   * It updates the search state by swapping the departure and arrival location objects.
   *
   * @returns {void}
   */
  const handleFlipLocations = useCallback(() => {
    setSearchState((prev) => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure,
    }));
  }, []);

  /**
   * Converts the search state object into a URLSearchParams string.
   *
   * @param {SearchState} searchState - The search state object to convert.
   * @return {string} The URLSearchParams string representation of the search state.
   */
  const searchStateToParams = useCallback((searchState: SearchState) => {
    const params = new URLSearchParams();
    const simpleParams = ["itinerary", "travelClass"] as const;

    simpleParams.forEach((param) => {
      if (searchState[param]) params.set(param, searchState[param] as string);
    });

    ["departure", "arrival"].forEach((location) => {
      const loc = searchState[location as "departure" | "arrival"];
      if (loc.id !== -1) params.set(`${location}Id`, loc.id.toString());
      if (loc.airportCode) params.set(`${location}Code`, loc.airportCode);
      if (loc.city) params.set(`${location}City`, loc.city);
      if (loc.country) params.set(`${location}Country`, loc.country);
      if (loc.airport) params.set(`${location}Airport`, loc.airport);
    });

    if (searchState.flightDate)
      params.set("flightDate", formatDate(searchState.flightDate));
    if (searchState.returnDate)
      params.set("returnDate", formatDate(searchState.returnDate));

    Object.entries(searchState.passengers).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    return params.toString();
  }, []);

  /**
   * Updates the URL with the provided search state parameters.
   *
   * @param {string} URL - The base URL to update.
   * @param {SearchState} searchState - The search state object to convert into URL parameters.
   * @return {string} The updated URL with the search state parameters appended.
   */
  const updateUrlParams = useCallback(
    (URL: string, searchState: SearchState) => {
      const paramsString = searchStateToParams(searchState);
      return `${URL}?${paramsString}`;
    },
    [searchStateToParams]
  );

  /**
   * Validates the search state inputs and updates the errors state accordingly.
   *
   * Checks for missing or invalid departure city, arrival city, flight date, return date, travel class, and passenger information.
   *
   * @return {boolean} True if all inputs are valid, false otherwise.
   */
  const validateInputs = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!searchState.departure.airportCode)
      newErrors.departure = "Please select a departure city.";
    if (!searchState.arrival.airportCode)
      newErrors.arrival = "Please select an arrival city.";
    if (!searchState.flightDate)
      newErrors.flightDate = "Please select a departure date.";
    if (searchState.itinerary === "round trip" && !searchState.returnDate) {
      newErrors.returnDate = "Please select a return date.";
    }
    if (!searchState.travelClass)
      newErrors.travelClass = "Please select a travel class.";

    const totalPassengers = Object.values(searchState.passengers).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalPassengers === 0) {
      newErrors.passengers = "Please select at least one passenger.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [searchState]);

  /**
   * Handles the search form submission and updates the URL with the provided search state parameters.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {void}
   *
   * @remarks
   * This function is a callback for the form submission event. It prevents the default form behavior,
   * validates the search inputs, and updates the URL with the search state parameters if all inputs are valid.
   **/
  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateInputs()) {
        router.push(updateUrlParams("/blockseats/list", searchState));
      }
    },
    [validateInputs, updateUrlParams, searchState, router]
  );

  return {
    searchState,
    setSearchState,
    errors,
    setErrors,
    handleItineraryChange,
    handleTravelClassChange,
    handlePassengersChange,
    handleLocationsChange,
    handleFlipLocations,
    handleDateChange,
    validateInputs,
    searchStateToParams,
    updateUrlParams,
    handleSearch,
  };
};
