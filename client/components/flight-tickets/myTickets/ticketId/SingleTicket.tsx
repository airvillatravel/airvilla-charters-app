"use client";
import {
  fetchSingleTicketById,
  fetchUpdateTicketById,
  fetchUpdateValidTicketById,
  withdrawUpdateValidTicket,
} from "@/lib/data/userTicketData";
import {
  selectSingleTicket,
  setTicketUpdateData,
} from "@/redux/features/SingleTicketSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { setLoading } from "@/redux/features/LoadingSlice";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import ProgressLoading from "@/components/utils/ProgressLoading";

import {
  selectSelectedTicket,
  setSelectedTicket,
} from "@/redux/features/SelectedTicketSlice";
import DeleteSingleTicketAlart from "./DeleteSingleTicketAlart";
import { selectIsLoggedIn } from "@/redux/features/AuthSlice";
import { useRouter } from "next/navigation";

import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import {
  UserFlightClassResultType,
  UserSegmentResultType,
  UserTicketResultType,
} from "@/utils/definitions/myTicketsDefinitions";
import { Edit, RefreshCw, Trash2 } from "lucide-react";

const UpdateSingleTicket = lazy(() => import("./UpdateSingleTicket"));

export default function SingleTicket({ ticketId }: { ticketId: string }) {
  // ########### STATES ##############
  const dispatch = useAppDispatch();
  const flightTicket: UserTicketResultType | {} =
    useAppSelector(selectSingleTicket);
  const ticket = flightTicket as UserTicketResultType;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updateReqMode, setUpdateReqMode] = useState<boolean>(false);
  const [updatedTicketData, setUpdatedTicketData] = useState<
    UserTicketResultType | {}
  >({});
  const updatedTicket = updatedTicketData as UserTicketResultType;

  // error res banner
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);
  const selectedTicket = useAppSelector(selectSelectedTicket);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const router = useRouter();
  const [validationError, setValidationError] = useState<any>(null);

  // ############ useEffect #############
  const fetchTicket = async () => {
    setIsLoading(true);

    const ticketData = await fetchSingleTicketById(ticketId);

    if (ticketData.results?.ticketHistoryLogs) {
      const lastIndex = ticketData.results?.ticketHistoryLogs.length - 1;
      const data = JSON.parse(
        ticketData.results.ticketHistoryLogs[lastIndex].newValue
      );
      setUpdatedTicketData(data);
    }

    if (ticketData.success) {
      dispatch(setTicketUpdateData(ticketData.results));
    }

    setMsg({
      success: ticketData.success,
      message: ticketData.message,
    });

    setIsLoading(false);
  };

  // fetch tickets
  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }

    // if the selected user is in update state, juste activate edit mode
    if (selectedTicket && selectedTicket.status === "update") {
      setEditMode(true);
      dispatch(setSelectedTicket({ ticketId: "", status: "" }));
    }
  }, [dispatch, ticketId, isLoggedIn, router]);

  // handle back navigation
  useEffect(() => {
    const handleBackNavigation = (e: any) => {
      e.preventDefault();
      const ticketsPageUrl = "/flight-tickets/myTickets";
      if (ticket.updated) {
        router.push(ticketsPageUrl + "#updated");
      } else {
        router.push(ticketsPageUrl + "#" + (ticket.ticketStatus || "all"));
      }
    };

    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [router, ticket.ticketStatus]);

  const loadingAccess = useAgencyUserAuth();

  if (isLoading || loadingAccess) {
    return <ProgressLoading />;
  }

  // ########### FUNCTIONS ############

  // format changes
  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    segIdx?: number,
    classIdx?: number
  ) => {
    const { id, value } = e.target;
    const [field] = id.split("-");

    // Determine whether to update segments, flightClasses, or the entire ticket
    let updatedFormData;

    if (segIdx !== undefined) {
      // Update a specific segment
      updatedFormData = {
        ...ticket,
        segments: ticket.segments.map((seg: UserSegmentResultType, i: number) =>
          i === segIdx
            ? {
                ...seg,
                [field]: value,
              }
            : seg
        ),
      };
    } else if (classIdx !== undefined) {
      // Update a specific flight class
      updatedFormData = {
        ...ticket,
        flightClasses: ticket.flightClasses.map(
          (classes: UserFlightClassResultType, i: number) =>
            i === classIdx
              ? {
                  ...classes,
                  [field]: value,
                }
              : classes
        ),
      };
    } else {
      // Update the entire form
      updatedFormData = {
        ...ticket,
        [id]: value,
      };
    }

    // Dispatch the updated form data
    dispatch(setTicketUpdateData(updatedFormData));
  };

  // handle submit form
  const handleSubmitTicket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // set Loading to true
    dispatch(setLoading(true));

    // empty the validation error object
    setValidationError({});
    // send create form request
    const updateTicket = await fetchUpdateTicketById(ticketId, ticket);

    if (updateTicket.success) {
      // redirect the user to the list after create a ticket
      // router.push("/flight-tickets/myTickets");
      setEditMode(false);
      // display success msg
      dispatch(setTicketUpdateData(updateTicket.results));
      fetchTicket();
    }
    dispatch(
      setMsg({
        success: updateTicket.success,
        message: updateTicket.message,
      })
    );
    // update validationError state
    setValidationError(updateTicket.validationErrors);
    dispatch(setLoading(false));
  };

  // update request
  const handleUpdateRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // set Loading to true
    dispatch(setLoading(true));

    // empty the validation error object
    setValidationError({});
    // send create form request
    const updateTicket = await fetchUpdateValidTicketById(ticketId, ticket);

    if (updateTicket.success) {
      setUpdateReqMode(false);
      // display success msg
      dispatch(setTicketUpdateData(updateTicket.results));
      fetchTicket();
    }
    dispatch(
      setMsg({
        success: updateTicket.success,
        message: updateTicket.message,
      })
    );
    // update validationError state
    setValidationError(updateTicket.validationErrors);
    dispatch(setLoading(false));
  };

  // handle withdraw update request
  const handleWithdrawUpdateRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // set Loading to true
    dispatch(setLoading(true));

    // send create form request
    const withdrawTicket = await withdrawUpdateValidTicket(ticketId);

    if (withdrawTicket.success) {
      setUpdateReqMode(false);
      // display success msg
      dispatch(setTicketUpdateData(withdrawTicket.results));
      fetchTicket();
    }
    dispatch(
      setMsg({
        success: withdrawTicket.success,
        message: withdrawTicket.message,
      })
    );

    dispatch(setLoading(false));
  };

  // handle cancel update ticket by refetch the data
  const handleCancelUpdateTicket = () => {
    fetchTicket();
    setEditMode(false);
    setUpdateReqMode(false);
    // empty the validation error object
    setValidationError({});
  };

  if (!ticketId || !ticket?.id) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-red-700 text-xl font-bold">Ticket not found</h1>
      </div>
    );
  }
  return (
    <div className="mb-6 lg:mb-0 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-5 md:p-8">
      <DeleteSingleTicketAlart
        dangerModalOpen={dangerModalOpen}
        setDangerModalOpen={setDangerModalOpen}
        ticketId={ticket.refId}
      />
      <div className="sm:flex sm:justify-between sm:items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            {`${editMode ? "Update " : ""}Ticket`}{" "}
            <span className="text-slate-500 text-xl">#{ticketId}</span>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* EDIT BTN */}
          {!editMode && ticket.ticketStatus === "rejected" && (
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <Edit size={20} className="mr-2" />
              <span className="ml-2">Edit</span>
            </button>
          )}
          {/* UPDATE REQUEST BTN */}
          {!updateReqMode &&
            ["available", "unavailable"].includes(ticket.ticketStatus) &&
            ticket.updated === false && (
              <button
                onClick={() => setUpdateReqMode((prev) => !prev)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <RefreshCw size={20} className="mr-2" />
                <span className="ml-2">Update Request</span>
              </button>
            )}

          {/* DELETE BTN */}
          {["pending", "rejected", "blocked"].includes(ticket.ticketStatus) && (
            <button
              type="button"
              onClick={() => {
                setDangerModalOpen((prev) => !prev);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <Trash2 size={20} className="mr-2" />
              <span className="ml-2">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* FORM */}
      <Suspense fallback={<ProgressLoading />}>
        <UpdateSingleTicket
          ticket={ticket}
          updatedTicket={updatedTicket}
          editMode={editMode}
          updateReqMode={updateReqMode}
          handleFormChange={handleFormChange}
          validationError={validationError}
          handleCancelUpdateTicket={handleCancelUpdateTicket}
          handleSubmitTicket={handleSubmitTicket}
          handleUpdateRequest={handleUpdateRequest}
          handleWithdrawUpdateRequest={handleWithdrawUpdateRequest}
        />
      </Suspense>
    </div>
  );
}
