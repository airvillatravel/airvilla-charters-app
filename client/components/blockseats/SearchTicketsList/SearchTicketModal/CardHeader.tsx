import { SegmentProps } from "@/utils/definitions/blockseatsDefinitions";
import { PlaneIcon } from "lucide-react";

export const CardHeader = ({ segment }: SegmentProps) => {
  const airline = segment?.carrier || "Unknown Airline";
  const flightNumber = segment?.flightNumber || "Unknown Flight Number";
  return (
    <div className="flex flex-wrap items-center space-x-2 text-base md:text-xl font-bold text-gray-900 dark:text-white">
      <PlaneIcon />
      <span>{`${airline} (${flightNumber})`}</span>
    </div>
  );
};
