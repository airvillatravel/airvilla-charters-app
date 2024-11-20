import React, { useEffect, useRef } from "react";
import { MapPin, Plane } from "lucide-react";
import {
  initialSearchState,
  SearchState,
} from "@/utils/definitions/blockseatsDefinitions";
import { TripTypeSelector } from "../landing/TripTypeSelector";
import { ClassSelector } from "../landing/ClassSelector";
import { TravelersSelector } from "../landing/TravelersSelector";
import { LocationSelector } from "../landing/LocationSelector";
import { FlipButton } from "../landing/FlipButton";
import { DateSelector } from "../landing/DateSelector";
import { SearchButton } from "../landing/SearchButton";
import { useSearchState } from "@/components/hooks/useSearchState";
import { getFormatDate } from "@/utils/functions/functions";
import { useSearchParams } from "next/navigation";
import { paramsToSearchState } from "@/utils/functions/flightSearchTickets";

export default function SearchTicketBarLanding() {
  const prevSearchStateRef = useRef<SearchState>(initialSearchState);
  const searchParams = useSearchParams();

  const {
    searchState,
    setSearchState,
    errors,
    handleItineraryChange,
    handleTravelClassChange,
    handlePassengersChange,
    handleLocationsChange,
    handleFlipLocations,
    handleDateChange,
    handleSearch,
  } = useSearchState();

  const search = searchState;

  // to convert params to searchState and update search bar fields in list page
  useEffect(() => {
    const newSearchState = paramsToSearchState(searchParams);
    if (
      JSON.stringify(newSearchState) !==
      JSON.stringify(prevSearchStateRef.current)
    ) {
      setSearchState((prevState) => {
        return { ...prevState, ...newSearchState };
      });
      prevSearchStateRef.current = newSearchState;
    }
  }, [searchParams]);

  return (
    <section className="max-w-7xl w-full px-2 md:px-10">
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-gray-800 p-4 md:p-6 relative h-full w-full rounded-lg mx-auto mt-4 mb-10"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 xl:justify-between gap-4">
          <TripTypeSelector
            itinerary={search.itinerary}
            setItinerary={handleItineraryChange}
          />
          <div className="flex flex-col xl:justify-end xl:flex-row xl:space-x-4">
            <ClassSelector
              travelClass={search.travelClass}
              setTravelClass={(value: string) => handleTravelClassChange(value)}
              error={errors.travelClass}
            />
            <TravelersSelector
              travelers={search.passengers}
              setTravelers={handlePassengersChange}
              error={errors.passengers}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10">
          <div className="col-span-3 md:col-span-1 relative">
            <LocationSelector
              key={`departure-${search.departure.id}`}
              label="From"
              icon={MapPin}
              value={search.departure.airportCode}
              onChange={(value: Location) => {
                handleLocationsChange("departure", value);
              }}
              disabledOption={search.arrival.city}
              error={errors.departure}
            />
            <div className="absolute top-auto right-[46%] rotate-90 md:rotate-0  md:top-1/3 md:-right-10 z-10">
              <FlipButton onClick={handleFlipLocations} />
            </div>
          </div>
          <div className="col-span-3 md:col-span-1 ml-0 mr-0 md:ml-3 md:-mr-6 lg:ml-0 lg:-mr-0">
            <LocationSelector
              key={`arrival-${search.arrival.id}`}
              label="To"
              icon={Plane}
              value={search.arrival.airportCode}
              onChange={(value: Location) => {
                handleLocationsChange("arrival", value);
              }}
              disabledOption={search.departure.city}
              error={errors.arrival}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <DateSelector
              label={
                search.itinerary === "one way"
                  ? "Departure"
                  : "Departure - Return"
              }
              itinerary={search.itinerary}
              departureDateError={errors.flightDate}
              returnDateError={errors.returnDate}
              handleDateChange={handleDateChange}
              error={errors.flightDate || errors.returnDate}
              initialDates={{
                flightDate: getFormatDate(search.flightDate!),
                returnDate: search.returnDate,
              }}
            />
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <SearchButton />
        </div>
      </form>
    </section>
  );
}
