"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon, Moon, Sun } from "lucide-react";
import BaggageModal from "./BaggageModal";
import { FaPlane } from "react-icons/fa";
import {
  FlightSegmentRes,
  FlightTicketRes,
} from "@/utils/definitions/blockseatsDefinitions";
import { CardHeader } from "../SearchTicketsList/SearchTicketModal/CardHeader";
import { FlightDuration } from "../SearchTicketsList/SearchTicketModal/FlightDuration";
import img from "@/public/images/user-avatar-32.png";
import {
  calculateTimeDifference,
  formatTicketTime,
  getFormatDate,
} from "@/utils/functions/functions";

export default function TicketDetailsCard({
  ticket,
  itinerary,
}: {
  ticket: FlightTicketRes;
  itinerary: string;
}) {
  return <FlightDetails ticket={ticket} itinerary={itinerary} img={img.src} />;
}

export type FlightSegmentProps = {
  airline: string;
  flightNumber: string;
  departure: {
    departureTime: Date;
    id: string;
    airportCode: string;
    country: string;
    city: string;
    airport: string;
  };
  arrival: {
    arrivalTime: Date;
    id: string;
    airportCode: string;
    country: string;
    city: string;
    airport: string;
  };
  duration: string;
};

// Header Component
const Header = ({
  ticket,
  itinerary,
}: {
  ticket: FlightTicketRes;
  itinerary: string;
}) => (
  <div className="flex items-center my-9">
    <div className="flex-shrink-0">
      <h2 className="text-3xl md:text-5xl text-gray-800 dark:text-gray-100">
        <FaPlane className="w-10 md:w-20 h-8 md:h-16 transform" />
      </h2>
    </div>
    <div className="ml-4 flex flex-wrap flex-col w-full md:w-auto">
      <ul className="flex flex-row flex-wrap items-start md:space-x-2 font-poppins font-bold text-xl md:text-4xl leading-10">
        <li className="inline-block">
          {" "}
          <span className="text-red-500">
            {itinerary === "one way" ? "Outbound Flights:" : "Return Flights:"}
          </span>
        </li>
        <li className="inline-block">
          <h3 className="text-gray-800 dark:text-gray-100">
            {ticket?.departure?.city || "Unknown"}
          </h3>
        </li>
        <li className="text-red-500">to</li>
        <li className="inline-block">
          <h3 className="text-gray-800 dark:text-gray-100">
            {ticket?.arrival?.city || "Unknown"}
          </h3>
        </li>
      </ul>
      <ul className="flex flex-wrap gap-x-2 gap-y-1 text-base leading-5 font-medium text-gray-400 dark:text-gray-300">
        <li className="inline-block align-middle">
          {ticket?.flightDate
            ? getFormatDate(ticket.flightDate)
            : "Unknown Date"}
        </li>
        <li className="inline-block align-middle">•</li>
        <li className="inline-block align-middle  text-blue-500">
          {ticket?.stops > 0
            ? `${ticket?.stops} Stop${ticket?.stops > 1 ? "s" : ""}`
            : "Non Stop"}
        </li>
        <li className="inline-block align-middle">•</li>
        <li className="inline-block align-middle">
          {ticket?.duration
            ? ticket.duration.replace(/(\d+h)(\d+m)/, "$1 $2")
            : "Unknown Duration"}
        </li>
      </ul>
    </div>
  </div>
);

// FlightInfo Component
export const FlightInfo = ({
  airportInfo,
  time,
  date,
  airport,
  className,
  justify,
}: {
  airportInfo: {
    airportCode: string;
    city: string;
    country: string;
  };
  time: string;
  date: string;
  airport: string;
  className: string;
  justify?: string;
}) => (
  <div className={className}>
    <p className="font-inter font-bold text-xl md:text-3xl text-gray-800 dark:text-white leading-8 pb-1 md:pb-4">
      {airportInfo?.airportCode}
    </p>
    <p
      className={`font-inter font-bold text-base leading-5 text-gray-800 dark:text-white pb-2 flex flex-row flex-wrap items-center space-x-2 ${justify}`}
    >
      <span>{time.includes("AM") ? <Moon /> : <Sun />}</span>
      <span>{time}</span>
    </p>
    <p className="font-inter font-normal text-base leading-6 text-gray-600 dark:text-gray-400">
      {airportInfo?.city || "XXX"}, {airportInfo?.country || "XXX"}
    </p>
    <p className="font-inter font-normal text-base leading-6 text-gray-600 dark:text-gray-400">
      {airport || "Unknown Airport"}
    </p>
  </div>
);

// FlightSegment Component
export const FlightSegment = ({
  segment,
  flightDate,
  stops,
  img,
  segmentClass,
}: {
  segment: FlightSegmentRes;
  flightDate: string;
  stops: number;
  img: string;
  segmentClass: string;
}) => {
  return (
    <div className="flex items-start space-x-4 mb-4 p-4 flex-grow">
      <div className="flex-grow">
        <div className="flex justify-between items-start flex-col md:flex-row text-sm">
          <FlightInfo
            airportInfo={segment?.departure || "Unknown"}
            time={formatTicketTime(segment?.departureTime) || "Unknown"}
            date={getFormatDate(segment?.departureTime)}
            airport={segment?.departure?.airport || "Unknown"}
            className="md:pr-2 md:w-40"
            justify="md:justify-start"
          />
          <FlightDuration duration={segment?.duration} stops={stops} />
          <FlightInfo
            airportInfo={segment?.arrival || "Unknown"}
            time={formatTicketTime(segment?.arrivalTime) || "Unknown"}
            date={getFormatDate(segment?.arrivalTime) || "Unknown"}
            airport={segment?.arrival?.airport || "Unknown"}
            className="md:pl-2 md:w-40 md:text-end md:justify-end"
            justify="md:justify-end"
          />
        </div>
      </div>
    </div>
  );
};

// Main FlightDetails Component
export const FlightDetails = ({
  ticket,
  img,
  itinerary,
}: {
  ticket: any;
  img: string;
  itinerary: string;
}) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
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

  return (
    <div className="mb-6">
      <Header ticket={ticket} itinerary={itinerary} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-full w-full max-w-5xl mx-auto my-2 transition-transform transform duration-300 ease-in-out border border-gray-300 dark:border-gray-700">
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
                  <span className="capitalize">{flightClass.type}</span>
                </h2>
              </div>
              {/* BAGGAGE & FARE RULES */}
              <div className="mt-2 flex items-start text-white dark:text-slate-800">
                <EyeIcon
                  style={{
                    fill: "rgb(239, 68, 68)",
                  }}
                />
                <button
                  className="text-red-500 underline offset-1"
                  aria-controls="feedback-modal"
                  onClick={() => setFeedbackModalOpen(true)}
                >
                  <span className="underline-offset-1 ml-1">
                    Baggage & Fare Rules
                  </span>
                </button>
              </div>
            </div>
            <FlightSegment
              key={index}
              stops={ticket.stops}
              segment={segment}
              flightDate={ticket.flightDate}
              img={img}
              segmentClass={ticket.flightClasses[0].type}
            />
            {index < ticket.segments.length - 1 && (
              <div className="pb-6">
                <div className="flex justify-center items-center text-sm text-blue-500 list-inline bg-slate-100 dark:bg-gray-900 rounded-lg d-sm-flex text-center justify-content-sm-between mb-0 px-4 py-2">
                  <div>
                    Layover:{" "}
                    {calculateTimeDifference(
                      segment.arrivalTime,
                      ticket.segments[index + 1].departureTime
                    )}{" "}
                    in {ticket.segments[index + 1].departure.airport}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <BaggageModal
        feedbackModalOpen={feedbackModalOpen}
        setFeedbackModalOpen={setFeedbackModalOpen}
        ticket={ticket}
      />
    </div>
  );
};
