"use client";
import React, { useState } from "react";

import { fetchDeleteTicketById } from "@/lib/data/userTicketData";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSelectedTicket } from "@/redux/features/SelectedTicketSlice";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import ModalBlank from "@/components/modal-blank";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteSingleTicketAlart({
  dangerModalOpen,
  setDangerModalOpen,
  ticketId,
}: {
  dangerModalOpen: boolean;
  setDangerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ticketId: string;
}) {
  // ############# STATES #############
  const dispatch = useAppDispatch();
  const router = useRouter();

  /// ######## HANDLERS #############
  // handle Delete Ticket by id
  const handleDeleteTicket = async () => {
    // send req to delete the ticket
    const deleteTicket = await fetchDeleteTicketById(ticketId);

    // update the ticket state
    if (deleteTicket.success) {
      dispatch(setSelectedTicket({ ticketId, status: "delete" }));
      // redirect user to myTicket page
      router.push("/flight-tickets/myTickets");
    }

    // show the message
    dispatch(
      setMsg({
        success: deleteTicket.success,
        message: deleteTicket.message,
      })
    );

    // close the alart window
    setDangerModalOpen(false);
  };

  return (
    <ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        {/* Modal content container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-lg">
          <div className="p-6">
            {/* Warning icon */}
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            {/* Modal title */}
            <h3 className="text-2xl font-bold text-center dark:text-white mb-4">
              Delete Ticket
            </h3>
            {/* Confirmation message */}
            <p className="dark:text-gray-300 text-center mb-6">
              Are you sure you want to delete ticket
              <span className="font-bold text-red-500"> {ticketId}</span>?<br />{" "}
              This action cannot be undone.
            </p>
            {/* Action buttons container */}
            <div className="flex flex-wrap flex-col-reverse md:flex-row items-stretch md:items-center justify-center md:space-x-4 space-y-1 md:space-y-0">
              {/* Cancel button */}
              <button
                className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center mt-2 md:mt-0"
                onClick={() => {
                  setDangerModalOpen(false);
                }}
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
              {/* Delete button */}
              <button
                className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                onClick={handleDeleteTicket}
              >
                <Trash2 size={18} className="mr-2" />
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
}
