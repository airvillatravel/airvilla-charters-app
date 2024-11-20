"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Plane } from "lucide-react";
import { useSearchState } from "@/components/hooks/useSearchState";
import { ClassSelector } from "./ClassSelector";
import { SvgFigure } from "./SVGFigure";
import { TripTypeSelector } from "./TripTypeSelector";
import { FlipButton } from "./FlipButton";
import { TravelersSelector } from "./TravelersSelector";
import { SearchButton } from "./SearchButton";
import { DateSelector } from "./DateSelector";
import { LocationSelector } from "./LocationSelector";
import { UserProfileResultType } from "@/utils/definitions/userProfileDefinitions";
import { fetchUserProfile } from "@/lib/data/userProfileData";
import ProgressLoading from "@/components/utils/ProgressLoading";
import useAffiliateUserAuth from "@/components/hooks/useAffiliateUserAuth";

export const SearchBarComponent = () => {
  // ######## CUSTOM HOOKS ########
  const {
    searchState,
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

  const [userInfo, setUserInfo] = useState<UserProfileResultType | {}>({});

  const user = userInfo as UserProfileResultType;

  const fetchUserInfo = async () => {
    // Fetch user profile data
    const data = await fetchUserProfile();

    // Set user info
    if (data.success && data.results) {
      setUserInfo(data.results);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <section className="px-4">
      <form
        onSubmit={handleSearch}
        className="bg-gradient-to-b from-sky-200 to-white dark:from-gray-400 dark:to-gray-500 p-4 md:p-12 rounded-lg shadow-lg bg-cover bg-center bg-blend-overlay max-w-7xl mt-10 px-4 md:mx-auto"
        style={{
          backgroundImage: 'url("/images/element/102.png")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundBlendMode: "overlay",
        }}
      >
        <h2 className="mx-auto text-2xl md:text-[54px] font-extrabold md:leading-[70px] my-8  md:mb-24 text-gray-900">
          <p>
            Hello, <span className="text-red-500">{user.firstName}</span>
          </p>
          Ready to book your flight?
        </h2>

        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 relative h-full ">
          <SvgFigure position="top-0 left-0" additionalClasses="-ml-[6px]" />
          <SvgFigure
            position="top-0 right-0"
            additionalClasses="-mr-[6px] rotate-180"
          />
          <div className="grid grid-cols-1 xl:grid-cols-2 xl:justify-between gap-4">
            <TripTypeSelector
              itinerary={search.itinerary}
              setItinerary={handleItineraryChange}
            />
            <div className="flex flex-col xl:justify-end xl:flex-row xl:space-x-4">
              <ClassSelector
                travelClass={search.travelClass}
                setTravelClass={handleTravelClassChange}
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
                onChange={(value: Location) =>
                  handleLocationsChange("departure", value)
                }
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
                onChange={(value: Location) =>
                  handleLocationsChange("arrival", value)
                }
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
                handleDateChange={(dates: {
                  flightDate: string;
                  returnDate: string | null;
                }) =>
                  handleDateChange({
                    flightDate: dates.flightDate,
                    returnDate: dates.returnDate,
                  })
                }
                error={errors.flightDate || errors.returnDate}
                initialDates={{
                  flightDate: search.flightDate,
                  returnDate: search.returnDate,
                }}
              />
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <SearchButton />
          </div>
        </div>
      </form>
    </section>
  );
};

export default function SearchBarLanding() {
  const loading = useAffiliateUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }

  return <SearchBarComponent />;
}
