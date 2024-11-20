import React from "react";
import { Ticket, User } from "lucide-react";

const BookingSummary = () => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg max-w-sm my-6">
      <h2 className="text-2xl font-bold p-4">Your Booking</h2>
      <div className="border-t border-gray-300 dark:border-gray-600"></div>
      <div className="space-y-4 p-4">
        <div className="flex flex-col items-start">
          <div className="flex justify-center items-center space-x-2 pb-2">
            <Ticket className="flex-shrink-0 w-4 h-4 mt-1 text-gray-400" />
            <p className="text-gray-400 text-sm">Flight Ticket</p>
          </div>
          <div className="flex justify-start items-center space-x-2 mt-1">
            <div className="w-4 h-4 bg-orange-500"></div>
            <p className="font-semibold">Mumbai → New York</p>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-200 mt-1">
            25 Jan • 1 Stop • 05h 25m
          </p>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 mt-6"></div>
        <div className="flex flex-col items-start">
          <div className="flex justify-center items-center space-x-2 pb-2">
            <User className="flex-shrink-0 w-4 h-4 mt-1 text-gray-400" />
            <p className="text-gray-400 text-sm">Traveler detail</p>
          </div>
          <p className="font-semibold text-gray-700 dark:text-white">
            Carolyn Ortiz
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-200 mt-1">
            Adult • Female • Dec-2-1990
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-600 mt-1"></div>
      <button className="w-full text-center text-red-400 p-4 hover:text-red-300 transition-colors">
        Review booking
      </button>
    </div>
  );
};

export default BookingSummary;
