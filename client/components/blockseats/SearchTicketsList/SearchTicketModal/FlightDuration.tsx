import { FaPlane } from "react-icons/fa";
import { FlightDurationProps } from "@/utils/definitions/blockseatsDefinitions";

export const FlightDuration = ({ duration, stops }: FlightDurationProps) => {
  return (
    <div className="relative mt-16 mb-6 w-full md:w-1/3 lg:w-1/2">
      <div className="flex items-center">
        <div className="flex-grow border-t border-red-500"></div>
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="bg-primary text-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-2">
              <FaPlane className="w-5 h-5 transform" />
            </div>
          </div>
        </div>
        <div className="flex-grow border-t border-red-500"></div>
      </div>
      {/* Duration */}
      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-sm font-inter font-bold px-0 text-xl leading-7 text-gray-800 dark:text-white max-w-max w-full">
        {duration.replace(/(\d+h)(\d+m)/, "$1 $2")}
      </span>
      <span className="absolute -bottom-16  left-1/2 transform -translate-x-1/2 -translate-y-full text-sm font-inter font-bold px-0 text-xl leading-7 text-gray-800 dark:text-white max-w-max w-full">
        {stops === 0 ? "Non Stop" : `${stops} Stop${stops > 1 ? "s" : ""}`}
      </span>
    </div>
  );
};
