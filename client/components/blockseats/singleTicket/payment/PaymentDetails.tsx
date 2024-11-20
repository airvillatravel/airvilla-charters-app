import React from "react";
import PaymentCard from "./PaymentCard";
import FareSummary from "./FareSummary";
import BookingSummary from "./BookingSummary";

export default function PaymentDetails() {
  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-grow">
          <PaymentCard />
          {/* Mobile screens */}
          <div className="xl:hidden mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FareSummary />
            <BookingSummary />
          </div>
        </div>
        {/* Right side for large screens */}
        <div className="hidden xl:block xl:sticky xl:top-4 self-start w-full md:w-1/4 mt-[244.5px]">
          <FareSummary />
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}
