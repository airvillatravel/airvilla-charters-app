import { HelpCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ContactSupportAccountHub() {
  return (
    <div className="mt-6 flex flex-wrap justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg space-y-2">
      <span className="text-sm dark:text-gray-300">
        Need assistance? Our support team is here to help.
      </span>
      <Link href="/support">
        <button
          // onClick={handleContactSupport}
          className="bg-blue-500 hover:bg-blue-600 text-sm md:text-base text-white font-semibold py-1 md:py-2 px-2 md:px-4 rounded-lg transition-colors duration-300 flex items-center"
        >
          <HelpCircle size={18} className="mr-2" />
          Contact Support
        </button>
      </Link>
    </div>
  );
}
