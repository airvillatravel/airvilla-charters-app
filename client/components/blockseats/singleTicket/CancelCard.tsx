"use client";
import React, { useState } from "react";
import { EyeIcon } from "lucide-react";
import CancelModal from "./CancelModal";
import { FlightTicketRes } from "@/utils/definitions/blockseatsDefinitions";

export default function CancelCard({ ticket }: { ticket: FlightTicketRes }) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  return (
    <div className="text-base text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-300 dark:border-gray-700 ">
      <h3 className="text-2xl font-bold mb-4">
        Cancellation & Date Change Charges
      </h3>
      <p className="text-red-500 font-semibold mb-2">Non Refundable</p>
      <p className="text-sm  mb-2 text-gray-500 dark:text-gray-400">
        The Cancellation penalty on this booking will depend on how close to the
        departure date you cancel your ticket.
      </p>
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
          <span className="underline-offset-1 ml-1">View Detail</span>
        </button>
      </div>
      <CancelModal
        feedbackModalOpen={feedbackModalOpen}
        setFeedbackModalOpen={setFeedbackModalOpen}
        ticket={ticket as unknown as FlightTicketRes}
      />
    </div>
  );
}
