import { FlightDetailsProps } from "@/utils/definitions/blockseatsDefinitions";

export const FlightDetails = ({
  title,
  airportCode,
  time,
  date,
  airport,
}: FlightDetailsProps) => {
  title = title || "Departure";
  airportCode = airportCode || "Unknown";
  time = time || new Date(Date.now()).toISOString();
  airport = airport || "Unknown Airport";
  return (
    <div
      className={`${title === "Arrival" ? "md:text-end " : ""}w-full md:w-1/4`}
    >
      {/* CODE */}
      <p className="font-inter font-bold text-3xl text-gray-800 dark:text-white leading-8 pb-4">
        {airportCode}
      </p>
      {/* TIME */}
      <p className="font-inter font-bold text-base leading-5 text-gray-800 dark:text-white pb-2">
        {time}
      </p>
      {/* DATE */}
      <p className="font-inter font-normal text-base leading-6 text-gray-600 dark:text-gray-400 pb-2">
        {date}
      </p>
      {/* AIRPORT */}
      <p className="font-inter font-normal text-base leading-6 text-gray-600 dark:text-gray-400">
        {airport}
      </p>
    </div>
  );
};
