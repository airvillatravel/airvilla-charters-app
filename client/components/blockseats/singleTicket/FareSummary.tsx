import React, { useState } from "react";
import { FlightTicketRes } from "@/utils/definitions/blockseatsDefinitions";
import { formattedPrice } from "@/utils/functions/functions";
import { useSearchParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * FareSummary component displays the fare summary for a flight booking.
 * It takes in departure and return ticket data, calculates the fare, and displays it in a formatted manner.
 *
 * @param departureTicket - The departure flight ticket data.
 * @param returnTicket - The return flight ticket data (optional).
 *
 * @returns A React component displaying the fare summary.
 */
export default function FareSummary({
  departureTicket,
  returnTicket,
}: {
  departureTicket: FlightTicketRes;
  returnTicket?: FlightTicketRes;
}) {
  const queryParams = useUrlParams();

  // calculate Fare
  const departureFare = calculateFare(departureTicket, queryParams);
  const returnFare = returnTicket
    ? calculateFare(returnTicket, queryParams)
    : null;

  // Calculate total fare
  const totalFare = departureFare.total + (returnFare ? returnFare.total : 0);
  const isRoundTrip = !!returnFare;
  return (
    <div className="text-base text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 rounded-lg shadow mb-6">
      {/* Header */}
      <div className="w-full border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-bold p-5">Fare Summary</h2>
      </div>

      {/* Departure Fare */}
      <FareSection
        departure={departureTicket.departure.airportCode}
        arrival={departureTicket.arrival.airportCode}
        travelClass={queryParams.travelClass!}
        fare={departureFare}
        showPreTotal={isRoundTrip}
      />
      {/* Separator */}
      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>

      {/* Return Fare */}
      {returnFare && (
        <FareSection
          departure={returnTicket!.departure.airportCode}
          arrival={returnTicket!.arrival.airportCode}
          travelClass={queryParams.travelClass!}
          fare={returnFare}
          showPreTotal={isRoundTrip}
        />
      )}

      {/* Separator */}
      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>

      {/* Total Fare */}
      <div className="p-5">
        <FareItem
          label="Total Fare"
          value={`${formattedPrice(totalFare, departureFare.currency)}`}
          className="font-bold text-xl"
        />
      </div>

      {/* Offer & Discount */}
      <div className="text-base text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 rounded-b-lg shadow p-6 h-fit border-t border-gray-500">
        <h3 className="text-2xl font-bold mb-4">Offer & Discount</h3>
        <div className="flex">
          <label htmlFor="coupon_code" className="sr-only">
            Coupon Code
          </label>
          <input
            id="coupon_code"
            type="text"
            placeholder="Coupon code"
            className="w-full flex-grow border-none focus:border focus:ring-1 focus:ring-red-700 focus:outline-none rounded-l-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-gray-100 "
            aria-label="Coupon code"
            title="Enter your coupon code here"
            autoComplete="off"
          />
          <button
            className="text-lg font-semibold bg-red-600 text-white px-4 py-1 rounded-r hover:bg-red-700"
            aria-label="Apply coupon code"
            title="Apply the entered coupon code"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * FareSection component displays the fare details for a specific flight segment.
 * It takes in departure and arrival airports, travel class, fare details, and a flag to show pre-total fare.
 * It renders the fare breakdown, tax, and pre-total fare if applicable.
 *
 * @param departure - The departure airport code.
 * @param arrival - The arrival airport code.
 * @param travelClass - The travel class (e.g., economy, business, first class).
 * @param fare - The fare details for the flight segment.
 * @param showPreTotal - A flag indicating whether to show the pre-total fare.
 *
 * @returns A React component displaying the fare details for a specific flight segment.
 */
function FareSection({
  departure,
  arrival,
  travelClass,
  fare,
  showPreTotal,
}: {
  departure: string;
  arrival: string;
  travelClass: string;
  fare: any;
  showPreTotal: boolean;
}) {
  return (
    <div className="space-y-2 p-5">
      <h3 className="font-bold flex flex-wrap flex-row justify-between">
        <span className="flex items-center">
          {departure}
          <FaArrowRight className="md:w-5 md:h-5 md:mx-4" />
          {arrival}
        </span>
        <span className="capitalize">{travelClass}</span>
      </h3>
      {fare.fareBreakdown
        .filter((item: any) => item.count > 0)
        .map((item: any) => (
          <TravelerFareItem
            key={item.label}
            label={item.label}
            value={formattedPrice(item.value, fare.currency)}
            perPersonValue={formattedPrice(item.perPersonValue, fare.currency)}
            count={item.count}
          />
        ))}
      <FareItem
        label={`Tax (${fare.taxRate.toFixed(2)}%)`}
        value={`${formattedPrice(fare.tax, fare.currency)}`}
        className="text-gray-500 dark:text-gray-400"
      />
      {showPreTotal && (
        <FareItem
          label="PreTotal Fare"
          value={`${formattedPrice(fare.total, fare.currency)}`}
          className="font-extrabold text-gray-600 dark:text-gray-300"
        />
      )}
    </div>
  );
}

/**
 * TravelerFareItem component displays a single fare item with a label, value, and per person value.
 * It also includes a toggleable section to show the count and per person value.
 *
 * @param label - The label for the fare item.
 * @param value - The total value for the fare item.
 * @param perPersonValue - The per person value for the fare item.
 * @param count - The count of the fare item.
 *
 * @returns A React component displaying a single fare item with toggleable details.
 */
function TravelerFareItem({
  label,
  value,
  perPersonValue,
  count,
}: {
  label: string;
  value: string;
  perPersonValue: string;
  count: number;
}) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <div
        className="flex justify-between items-center font-extrabold text-gray-600 dark:text-gray-300"
        onClick={() => setShowDetails(!showDetails)}
      >
        <span className="font-medium flex items-center justify-between">
          <span className="font-medium w-full">{label}</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform duration-300 ${
              showDetails ? "rotate-180" : "rotate-0"
            }`}
          />
        </span>
        <span className="font-medium">{value}</span>
      </div>
      {showDetails && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {count} X {perPersonValue}
        </div>
      )}
    </div>
  );
}

/**
 * FareItem component displays a single fare item with a label and value.
 *
 * @param label - The label for the fare item.
 * @param value - The value for the fare item.
 * @param info - Indicates whether to show an info icon (optional, default is false).
 * @param className - Additional CSS classes for the fare item (optional).
 *
 * @returns A React component displaying a single fare item.
 */
function FareItem({
  label,
  value,
  info = false,
  className = "",
}: {
  label: string;
  value: string;
  info?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between items-center`}>
      <div className="flex items-center">
        <span className={`font-medium ${className}`}>{label}</span>
        {info && (
          <svg
            className="w-4 h-4 ml-1 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className={`font-medium ${className}`}>{value}</span>
    </div>
  );
}

/**
 * calculateFare function calculates the fare for a given flight ticket and query parameters.
 *
 * @param ticket - The flight ticket data.
 * @param queryParams - The query parameters for the flight booking (optional).
 *
 * @returns An object containing the calculated fare details.
 */
export const calculateFare = (ticket: FlightTicketRes, queryParams?: any) => {
  const { adults, children, infants, travelClass } = queryParams;

  let adultPrice = 0;
  let childPrice = 0;
  let infantPrice = 0;
  let taxRate = 0;
  let currency = "JOD";

  const selectedFlightClass = ticket?.flightClasses?.find(
    (flightClass) => flightClass.type === travelClass?.toLowerCase()
  );

  if (selectedFlightClass) {
    adultPrice = parseFloat(selectedFlightClass.price.adult!.toFixed(2));
    childPrice = parseFloat(selectedFlightClass.price.child!.toFixed(2));
    infantPrice = parseFloat(selectedFlightClass.price.infant!.toFixed(2));
    taxRate = parseFloat(selectedFlightClass.price.tax!.toFixed(2));
    currency = selectedFlightClass.price.currency;
  }

  const adultsPrice = adults * adultPrice;
  const childrenPrice = children * childPrice;
  const infantsPrice = infants * infantPrice;
  const subtotal = adultsPrice + childrenPrice + infantsPrice;

  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const fareBreakdown = [
    {
      label: `${adults} Adult`,
      value: adultsPrice,
      perPersonValue: adultPrice,
      count: adults,
      className: "text-gray-500 dark:text-gray-400",
    },
    {
      label: `${children} Child`,
      value: childrenPrice,
      perPersonValue: childPrice,
      count: children,
      className: "text-gray-500 dark:text-gray-400",
    },
    {
      label: `${infants} Infant`,
      value: infantsPrice,
      perPersonValue: infantPrice,
      count: infants,
      className: "text-gray-500 dark:text-gray-400",
    },
  ];

  return {
    subtotal,
    tax,
    total,
    currency,
    adultsPrice,
    childrenPrice,
    infantsPrice,
    taxRate,
    fareBreakdown,
  };
};

/**
 * useUrlParams function retrieves the query parameters from the URL.
 *
 * @returns An object containing the retrieved query parameters.
 */
const useUrlParams = () => {
  const searchParams = useSearchParams();

  const itinerary = searchParams.get("itinerary");
  const travelClass = searchParams.get("travelClass");
  const adults = parseInt(searchParams.get("adults") || "0");
  const children = parseInt(searchParams.get("children") || "0");
  const infants = parseInt(searchParams.get("infants") || "0");

  return {
    itinerary,
    travelClass,
    adults,
    children,
    infants,
  };
};
