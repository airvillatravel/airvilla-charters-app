"use client";

import { useEffect, useState } from "react";
import ModalBasic from "@/components/modal-basic";
import Image from "next/image";
import img from "@/public/images/user-avatar-32.png";
import React from "react";
import { CancelModalProps } from "@/utils/definitions/blockseatsDefinitions";
import { CardHeader } from "@/components/blockseats/SearchTicketsList/SearchTicketModal/CardHeader";

export default function CancelModal({
  feedbackModalOpen,
  setFeedbackModalOpen,
  ticket,
}: CancelModalProps) {
  const [activeTab, setActiveTab] = useState("cancellation-charge");
  const [selectedClass, setSelectedClass] = useState<string>("Economy");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const travelClass = params.get("travelClass") || "Economy";
    setSelectedClass(travelClass);
  }, []);

  // set flight class depending on selected class state
  const flightClass =
    ticket.flightClasses.find(
      (fc: { type: string }) =>
        fc.type.toLowerCase() === selectedClass.toLowerCase()
    ) || ticket.flightClasses[0];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="h-full relative">
      <div className="flex flex-wrap items-center -m-1.5 absolute">
        <div className="m-1.5">
          {/* Start */}
          <ModalBasic
            isOpen={feedbackModalOpen}
            setIsOpen={setFeedbackModalOpen}
            title="Cancellation & Date Change Charges"
          >
            {/* Modal content */}
            {/* Tab navigation */}
            <ul className="flex overflow-x-scroll md:overflow-auto flex-no-wrap gap-2 sm:gap-0 bg-red-100 dark:bg-red-500/30 text-red-500 dark:text-red-400 rounded-lg p-2 px-4 mt-4">
              {/* Tab items */}
              {["cancellation-charge", "date-change-charge"].map((tabId) => (
                <li key={tabId} className="flex-1 px-4">
                  <button
                    className={`w-full mb-0 cursor-pointer p-2 whitespace-nowrap rounded-lg focus:outline-none ${
                      activeTab === tabId
                        ? "active bg-red-600 dark:bg-red-600/30 text-white dark:text-white rounded-lg"
                        : ""
                    }`}
                    id={tabId}
                    onClick={() => handleTabClick(tabId)}
                  >
                    {tabId
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </button>
                </li>
              ))}
            </ul>

            <div className="w-full max-w-4xl mx-auto">
              {/* Tab content */}
              {activeTab === "cancellation-charge" && (
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg pt-6 w-full max-w-5xl mx-auto my-2 transition-transform transform duration-300 ease-in-out py-6 px-4"
                  id="date-change-charge-tab"
                  role="tabpanel"
                  aria-labelledby="date-change-charge"
                >
                  <div className="card dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4">
                    {/* Card header */}
                    {ticket.segments.map((segment: any, index: number) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-wrap justify-between items-center mb-4">
                          <div className="grid grid-cols-1 gap-1">
                            <CardHeader segment={segment} />
                            {/* TRAVEL CLASS */}
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white pl-0 md:pl-10">
                              <span className="text-gray-500/80 dark:text-gray-400">
                                Travel Class:
                              </span>{" "}
                              <span className="capitalize">
                                {flightClass.type}
                              </span>
                            </h2>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}

                    {/* Card body */}
                    <div className="flex-1 p-5">
                      {/* Table START */}
                      <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch">
                        <table className="table caption-bottom mb-0 w-full">
                          {/* Caption */}
                          <caption className="text-gray-500 dark:text-gray-400 text-left pt-4">
                            *From The Date Of Departure
                          </caption>
                          {/* Table head */}
                          <thead className="bg-gray-800 text-white">
                            <tr>
                              <th
                                scope="col"
                                className="border-0 rounded-tl-md text-left py-2 px-8"
                              >
                                Time Frame
                              </th>
                              <th
                                scope="col"
                                className="border-0 border-s-2 border-gray-700 rounded-tr-md  text-left py-2 px-8"
                              >
                                Air Free + MMT Free
                              </th>
                            </tr>
                          </thead>
                          {/* Table body */}
                          <tbody className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                            <tr className="border border-gray-300 dark:border-gray-700 p-2 m-2">
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                0 hours to 24 hours
                              </td>
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                Non Refundable
                              </td>
                            </tr>
                            <tr className="border border-gray-300 dark:border-gray-700">
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                24 hours to 365 days
                              </td>
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                $16,325 + $250
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Table END */}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab content */}
              {activeTab === "date-change-charge" && (
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg pt-6 w-full max-w-5xl mx-auto my-2 transition-transform transform duration-300 ease-in-out py-6 px-4"
                  id="date-change-charge-tab"
                  role="tabpanel"
                  aria-labelledby="date-change-charge"
                >
                  <div className="card dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4">
                    {/* Card header */}
                    {ticket.segments.map((segment: any, index: number) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-wrap justify-between items-center mb-4">
                          <div className="grid grid-cols-1 gap-1">
                            <CardHeader segment={segment} />
                            {/* TRAVEL CLASS */}
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white pl-0 md:pl-10">
                              <span className="text-gray-500/80 dark:text-gray-400">
                                Travel Class:
                              </span>{" "}
                              <span className="capitalize">
                                {flightClass.type}
                              </span>
                            </h2>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}

                    {/* Card body */}
                    <div className="flex-1 p-5">
                      {/* Table START */}
                      <div className="overflow-x-auto overflow-y-hidden -webkit-overflow-scrolling-touch">
                        <table className="table caption-bottom mb-0 w-full">
                          {/* Caption */}
                          <caption className="text-gray-500 dark:text-gray-400 text-left pt-4">
                            *From The Date Of Departure
                          </caption>
                          {/* Table head */}
                          <thead className="bg-gray-800 text-white">
                            <tr>
                              <th
                                scope="col"
                                className="border-0 rounded-tl-md text-left py-2 px-8"
                              >
                                Time Frame
                              </th>
                              <th
                                scope="col"
                                className="border-0 border-s-2 border-gray-700 rounded-tr-md  text-left py-2 px-8"
                              >
                                Air Free + MMT Free + Fare Difference
                              </th>
                            </tr>
                          </thead>
                          {/* Table body */}
                          <tbody className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                            <tr className="border border-gray-300 dark:border-gray-700 p-2 m-2">
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                0 hours to 24 hours
                              </td>
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                Non Refundable
                              </td>
                            </tr>
                            <tr className="border border-gray-300 dark:border-gray-700">
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                24 hours to 365 days
                              </td>
                              <td className="py-2 px-8 border border-gray-300 dark:border-gray-700">
                                $16,325 + $250 + Fare Difference
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Table END */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModalBasic>
          {/* End */}
        </div>
      </div>
    </div>
  );
}
