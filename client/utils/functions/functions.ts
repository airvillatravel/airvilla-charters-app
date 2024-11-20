import moment from "moment";
import {
  FlightClassesRes,
  FlightTicketRes,
} from "../definitions/blockseatsDefinitions";

// ticket format date
export const getFormatDate = (date: string) => {
  return moment(date).format("MMMM D, YYYY");
};
// ticket format date
export const getFormatTime = (date: string) => {
  return moment(date).format("HH:mm");
};

export const convertTimeToISOString = (time: any) => {
  const [hours, minutes] = time.split(":");
  const date = moment().set({
    hour: hours,
    minute: minutes,
    second: 0,
    millisecond: 0,
  });

  // Format to ISO string without timezone conversion
  return date.format("YYYY-MM-DDTHH:mm:ss.SSS");
};

// Helper function to format itinerary
export const formatItinerary = (itinerary: string): string => {
  switch (itinerary) {
    case "one_way":
      return "One Way";
    case "multi_city":
      return "Multi City";
    case "round_trip":
      return "Round Trip";
    default:
      return itinerary;
  }
};

// Helper function to format price
export const formatPrice = (amount: number, currency: string): string => {
  if (amount === undefined || currency === undefined) {
    return "N/A";
  }
  return `${amount.toFixed(2)} ${currency} `;
};

// Helper function to format Date
export const formatCustomDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Replace slashes with hyphens for the date part
  const [datePart, timePart] = formattedDate.split(", ");
  const dateWithHyphens = datePart.replace(/\//g, "-");

  return `${dateWithHyphens}, ${timePart}`;
};

// Helper function to format price
export function formattedPrice(price: number, currency: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  // Remove the currency symbol and append "JD" manually
  const formattedWithoutCurrency = formatted.replace(/[^\d.,]/g, "");
  return `${formattedWithoutCurrency} JD`;
}

// Helper function to calculate time difference
export function calculateTimeDifference(
  startTime: string,
  endTime: string
): string {
  const diffInMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Helper function to format ticket date in ####### single ticket page of block seates ################
export const formatTicketDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  try {
    return date.toLocaleDateString("en-GB", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown Date";
  }
};

// Helper function to format ticket time in ####### single ticket page of block seats ################
export const formatTicketTime = (date: string): string => {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  try {
    return newDate.toLocaleTimeString("en-US", options);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Unknown Time";
  }
};

// helper function to show fee in ####### search ticket modal page of block seats ################
export const getCheckedFeeText = (
  checkedFee: number,
  additionalFee: number
) => {
  if (checkedFee === 0 && !additionalFee) {
    return "Free";
  } else if (checkedFee !== 0 && !additionalFee) {
    return `${checkedFee} JOD`;
  } else if (checkedFee === 0 && additionalFee) {
    return `Free / ${additionalFee} JOD`;
  } else if (checkedFee !== 0 && additionalFee) {
    return `${checkedFee} JOD / ${additionalFee} JOD`;
  }
};

// helper function to format date by adding 1 day in params for search ticket list page ################# search ticket list page of block seats ################
export const formatDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to Handle availability icon for search ticket list page ################# search ticket modal page of block seats ################
export const getAvailabilityIcon = (availability: string) => {
  if (availability === "yes") {
    // return <CheckIcon className="h-6 w-6 text-green-500 inline" />;
    return "✔️";
  } else if (availability === "no") {
    // return <XIcon className="h-6 w-6 text-red-500 inline" />;
    return "❌";
  } else {
    return "At charge";
  }
};

export const calculateMinMaxPrices = (
  departureTickets: FlightTicketRes[],
  returnTickets: FlightTicketRes[]
) => {
  const allTickets = [...departureTickets, ...returnTickets];
  const prices = allTickets.flatMap((ticket) =>
    ticket.flightClasses.map((fc: FlightClassesRes) => Number(fc.price.adult))
  );

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
};

/**
 * Retrieves the min and max prices from local storage.
 *
 * @return {Object} An object containing the minimum and maximum prices.
 * @property {number} minPrice - The minimum price retrieved from local storage.
 * @property {number} maxPrice - The maximum price retrieved from local storage.
 */
export const getMinMaxPricesFromLocalStorage = (
  departureTickets: FlightTicketRes[],
  returnTickets: FlightTicketRes[]
) => {
  // const minPrice = localStorage.getItem("initialMinPrice");
  // const maxPrice = localStorage.getItem("initialMaxPrice");

  const { minPrice: calculatedMinPrice, maxPrice: calculatedMaxPrice } =
    calculateMinMaxPrices(departureTickets, returnTickets);

  return {
    minPrice: calculatedMinPrice,
    maxPrice: calculatedMaxPrice,
    // minPrice: calculatedMinPrice ?? parseFloat(minPrice!),
    // maxPrice: calculatedMaxPrice ?? parseFloat(maxPrice!),
  };
};
