import React from "react";
import { FlightClassProps } from "@/utils/definitions/blockseatsDefinitions";

export const TravelClassInfo = ({ flightClasses }: FlightClassProps) => {
  return (
    <div className="text-lg font-semibold text-gray-950 dark:text-gray-50 md:mt-0 mt-4">
      <span className="text-gray-500/80 dark:text-gray-400 ">
        Travel Class:{" "}
      </span>
      <span className="capitalize">{flightClasses.type}</span>
    </div>
  );
};
