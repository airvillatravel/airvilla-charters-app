import { useSideBarFilters } from "@/components/hooks/useSideBarFilters";
import { SearchSideBarFiltersProps } from "@/utils/definitions/blockseatsDefinitions";
import { Overlay } from "./Overlay";
import { Header } from "./Header";
import { FilterSection } from "./FilterSection";
import { CheckboxFilter } from "./CheckboxFilter";
import { PriceFilter } from "./PriceFilter";
import { ChangeEvent, FormEvent, useState } from "react";
import { ToggleButton } from "./ToggleButton";

export const SearchSideBarFilters = ({
  isOpen,
  toggleSidebar,
  priceRange,
}: SearchSideBarFiltersProps) => {
  const { filters, priceControls, sidebarRef } = useSideBarFilters({
    isOpen,
    toggleSidebar,
    priceRange,
  });
  const {
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
  } = filters;

  const {
    minValue,
    maxValue,
    handleSliderChange,
    handleMinChange,
    handleMaxChange,
  } = priceControls;

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
      <aside
        ref={sidebarRef}
        className={`fixed top-16 xl:top-0 xl:-mt-2 right-0 z-50 xl:z-0 w-10/12 xs:w-1/3 h-full bg-white dark:bg-gray-800 xl:bg-transparent xl:dark:bg-transparent overflow-y-auto transition-transform transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } xl:translate-x-0 xl:sticky xl:transform-none shadow-lg xl:shadow-none rounded-lg border border-gray-100 dark:border-gray-700 xl:dark:border-transparent`}
      >
        <div
          className="shadow-lg xl:shadow-none bg-slate-100 dark:bg-slate-800 xl:dark:bg-transparent bg-opacity-30 xl:bg-transparent transition-opacity"
          aria-labelledby="offcanvasSidebarLabel"
        >
          <Header onClose={toggleSidebar} />
          <div className="flex flex-col space-y-6 overflow-y-auto h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <form className="rounded-lg shadow dark:shadow-none">
              <FilterSection title="Price" className="rounded-t-lg">
                <PriceFilter
                  minValue={minValue}
                  maxValue={maxValue}
                  minLimit={priceRange.minPrice}
                  maxLimit={priceRange.maxPrice}
                  onMinChange={(event: FormEvent) => {
                    handleMinChange(event as ChangeEvent<HTMLInputElement>);
                  }}
                  onMaxChange={(event: FormEvent) => {
                    handleMaxChange(event as ChangeEvent<HTMLInputElement>);
                  }}
                  onSliderChange={(min, max) => {
                    handleSliderChange(min, max);
                  }}
                />
              </FilterSection>

              {departureStops!.length > 0 && (
                <FilterSection title="Onward Stops" className="border-t">
                  <div className="flex flex-wrap items-baseline justify-start space-y-1 space-x-1">
                    {departureStops.map((stop, index) => (
                      <ToggleButton
                        key={index}
                        label={stop}
                        isChecked={selectedFilters.departureStops.has(stop)}
                        onChange={() =>
                          handleFilterChange("departureStops", stop)
                        }
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              {returnStops!.length > 0 && (
                <FilterSection title="Return Stops" className="border-t">
                  <div className="flex flex-wrap items-baseline justify-start space-y-1 space-x-1">
                    {returnStops.map((stop, index) => (
                      <ToggleButton
                        key={index}
                        label={stop}
                        isChecked={selectedFilters.returnStops.has(stop)}
                        onChange={() => handleFilterChange("returnStops", stop)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              {preferredAirline!.length > 0 && (
                <FilterSection
                  title="Preferred Airline"
                  className="border-t overflow-y-auto max-h-52 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <CheckboxFilter
                    filters={preferredAirline.map(({ code, name, count }) => ({
                      label: name,
                      count,
                    }))}
                    selectedFilters={selectedFilters.preferredAirlines}
                    onFilterChange={(value) =>
                      handleFilterChange("preferredAirlines", value)
                    }
                  />
                </FilterSection>
              )}

              {layoverAirports!.length > 0 && (
                <FilterSection
                  title="Layover Airport"
                  className="border-y overflow-y-auto max-h-52 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  <CheckboxFilter
                    filters={layoverAirports.map(
                      ({ airportCode, city, count }) => ({
                        label: airportCode,
                        count,
                      })
                    )}
                    selectedFilters={selectedFilters.layoverAirports}
                    onFilterChange={(value) =>
                      handleFilterChange("layoverAirports", value)
                    }
                  />
                </FilterSection>
              )}
            </form>
          </div>

          {/*  for large screens  */}
          <div className="hidden xl:block bottom-14 xl:bottom-0 z-20 bg-white dark:bg-gray-800/70 p-4">
            <div className="flex justify-between xl:p-0 sm:mt-4 w-full">
              <button
                type="button"
                className="text-red-600 dark:text-red-500"
                onClick={handleClear}
              >
                Clear all
              </button>
              <button
                type="button"
                className={`text-white px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isApplyFiltersHovered ? "bg-red-500" : "bg-gray-600"
                }`}
                onClick={applyFilters}
                onMouseEnter={() => setIsApplyFiltersHovered(true)}
                onMouseLeave={() => setIsApplyFiltersHovered(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
          {/*  for large screens  */}

          {/*  for small screens  */}
          <div className="sticky bottom-14 xl:bottom-0 z-20 bg-white dark:bg-gray-700 xl:bg-transparent xl:dark:bg-transparent shadow-lg mt-10 xl:hidden">
            <div className="flex justify-between xl:justify-around p-2 xl:p-0 sm:mt-4">
              <button
                type="button"
                className="text-red-600 dark:text-red-500"
                onClick={handleClear}
              >
                Clear all
              </button>
              <button
                type="button"
                className={`text-white px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isApplyFiltersHovered ? "bg-red-500" : "bg-gray-600"
                }`}
                onClick={applyFilters}
                onMouseEnter={() => setIsApplyFiltersHovered(true)}
                onMouseLeave={() => setIsApplyFiltersHovered(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
          {/*  for small screens  */}
        </div>
      </aside>
    </>
  );
};
