import React from "react";
import { OfferSectionProps } from "@/utils/definitions/blockseatsDefinitions";
import { DollarSign, Users } from "lucide-react";

export const OfferSection = ({ seats, refundable }: OfferSectionProps) => {
  // Find the refundable offer in the array
  const refundableOffer = refundable.find((offer) => {
    return offer.name.toLowerCase() === "refundable ticket";
  });

  let refundableStatus = "Non-Refundable";
  if (refundableOffer) {
    refundableStatus =
      refundableOffer.available.toLowerCase() === "no"
        ? "Non-Refundable"
        : "Refundable";
  }

  return (
    <div className="pt-0">
      <div className="flex flex-wrap justify-between items-center text-sm text-red-500 dark:text-red-400 list-inline bg-slate-100 dark:bg-gray-900 rounded-lg text-center justify-content-sm-between mb-0 px-4 py-2">
        <div className="flex justify-center items-center space-x-2">
          <Users />
          <span>{seats} Seat Left</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-2 ${
            refundableStatus === "Refundable" ? "text-green-500" : ""
          }`}
        >
          <DollarSign />
          <span>{refundableStatus}</span>
        </div>
      </div>
    </div>
  );
};
