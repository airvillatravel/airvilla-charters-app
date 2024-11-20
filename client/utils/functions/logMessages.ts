import { formatDate } from "react-datepicker/dist/date_utils";
import { getFormatDate } from "./functions";
import { capitalize } from "lodash";

export const formatKey = (key: string) => {
  // Define special cases
  const specialCases: any = {
    ticketStatus: "Ticket Status",
    "departure.airportCode": "Departure Airport Code",
    "departure.country": "Departure Country",
    "departure.city": "Departure City",
    "departure.airport": "Departure Airport",
    "arrival.airportCode": "Arrival Airport Code",
    "arrival.country": "Arrival Country",
    "arrival.city": "Arrival City",
    "arrival.airport": "Arrival Airport",
  };

  // Return special case formatting if it exists
  if (specialCases[key]) {
    return specialCases[key];
  }

  // General formatting for array indices and other keys
  return key
    .replace(/\[(\d+)\]/g, (match: any, num: string) => ` ${parseInt(num) + 1}`) // Convert array index notation to " Index + 1"
    .replace(/\./g, " ") // Replace dots with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camel case words
    .replace(/(\s+)(\d+)/g, " $2") // Ensure space before numbers
    .replace(/([a-z])(\d+)/g, "$1 $2") // Ensure space between letters and numbers
    .replace(/^(\d)/, " $1") // Add space after the first character if it’s a digit
    .replace(/(\s+)(\d+)/g, " $2") // Ensure space between words and numbers
    .replace(/\s+$/, ""); // Trim any trailing spaces
};

export const generateUpdateMessage = (
  key: string,
  oldValue: any,
  newValue: any
) => {
  const readableKey = formatKey(key);
  const oldValueStr = oldValue === null ? "None" : oldValue;
  const newValueStr = newValue === null ? "None" : newValue;

  // check old value and new value are array
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length < newValue.length) {
      return `${capitalize(readableKey)} has been added.`;
    } else if (oldValue.length > newValue.length) {
      return `${capitalize(readableKey)} has been removed.`;
    }
  }

  if (key === "flightDate") {
    return `${capitalize(readableKey)}: ${getFormatDate(
      oldValueStr
    )} -> ${getFormatDate(newValueStr)}.`;
  }

  return `${capitalize(readableKey)}: ${oldValueStr} -> ${newValueStr}.`;
};
