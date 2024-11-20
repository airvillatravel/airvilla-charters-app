import React from "react";
import { formattedPrice } from "@/utils/functions/functions";

export default function FareSummary() {
  let adultPrice: number | undefined;
  let taxPrice: number | undefined;
  let currency: string | undefined;

  const totalFare = (adultPrice ?? 0) + (taxPrice ?? 0);

  return (
    <div className="text-base text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="w-full border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-bold p-5">Fare Summary</h2>
      </div>

      {/* Fare Items */}
      <div className="space-y-2 p-5">
        <FareItem
          label="Base Fare"
          value={`${formattedPrice(adultPrice ?? 0, currency ?? "JOD")}`}
          info
          className="text-gray-500 dark:text-gray-400"
        />
        <FareItem
          label="Discount"
          value={`${formattedPrice(taxPrice ?? 0, currency ?? "JOD")}`}
          className="text-green-500"
        />
        <FareItem
          label="Other Services"
          value={`${formattedPrice(0.0, currency ?? "JOD")}`}
          className="text-gray-500 dark:text-gray-400"
        />
      </div>

      {/* Total Fare */}
      <div className="w-full border-t border-gray-300 dark:border-gray-600 p-5">
        <FareItem
          label="Total Fare"
          value={`${formattedPrice(totalFare!, currency ?? "JOD")}`}
          className="font-bold text-xl"
        />
      </div>
    </div>
  );
}

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
