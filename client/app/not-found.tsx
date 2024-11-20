import React from "react";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-12">
        <AirplaneIcon />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900 dark:text-white text-5xl md:text-6xl font-bold">
          404
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Oops! Page Not Found
      </h1>
      <p className="dark:text-gray-400 text-base md:text-xl mb-12 max-w-2xl">
        We're sorry, but the page you're looking for doesn't exist or has been
        moved. It seems our flight plan led us to an empty runway!
      </p>

      <div className="mb-12">
        <Link
          href="/blockseats"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          Return to Home
          <Home className="ml-2" size={18} />
        </Link>
      </div>

      <p className="text-xs md:text-sm dark:text-gray-400">
        If you believe this is an error, please contact our support team.
      </p>
    </div>
  );
}

const AirplaneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-red-500 w-36 h-36 md:w-48 md:h-48"
  >
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);
