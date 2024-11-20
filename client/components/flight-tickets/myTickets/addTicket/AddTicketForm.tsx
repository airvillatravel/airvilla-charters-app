"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FaMinus } from "react-icons/fa";

// Redux actions and selectors
import {
  addFlightClassSection,
  addSegmentSection,
  removeFlightClassSection,
  removeSegmentSection,
  selectTicketForm,
  updateTicketForm,
} from "@/redux/features/TicketFormSlice";
import { setLoading } from "@/redux/features/LoadingSlice";
import { setMsg } from "@/redux/features/ActionMsgSlice";

// Utility functions and data
import { fetchCreateTicket } from "@/lib/data/userTicketData";

// Components
import SegmentSection from "./SegmentSection";
import FlightClassesSection from "./FlightClassesSection";
import FlightDateField from "./FlightDateField";
import {
  CreateFlightClassesFormTypes,
  CreateSegmentFormTypes,
} from "@/utils/definitions/myTicketsDefinitions";
import { ticketFormData } from "@/utils/ticketFormData";
import { Card, InputField } from "./AddTicketComponents";
import { FileText, Plane, Plus, RockingChair, Users } from "lucide-react";

const AddTicketForm: React.FC = () => {
  // Hooks
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux selectors
  const formData = useAppSelector(selectTicketForm);

  // Local state
  const [validationError, setValidationError] = useState<Record<
    string,
    string
  > | null>(null);

  // Handle form input changes
  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      dispatch(updateTicketForm({ ...formData, [id]: value }));
    },
    [dispatch, formData]
  );

  // Handle form submission
  const handleSubmitTicket = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(setLoading(true));

      const result = await fetchCreateTicket(formData);

      dispatch(setLoading(false));
      dispatch(
        setMsg({
          success: result.success,
          message: result.message,
        })
      );

      if (result.success) {
        dispatch(updateTicketForm(ticketFormData));
        router.push("/flight-tickets/myTickets");
      } else if (result.validationErrors) {
        setValidationError(result.validationErrors);
      }
    },
    [dispatch, formData, router]
  );

  return (
    <div className="mb-6 lg:mb-0 w-full max-w-7xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-5 md:p-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-8 text-left text-slate-800 dark:text-white capitalize">
          add new Flight Ticket
        </h1>
      </header>
      <form>
        <div className="space-y-4">
          {/* Seats and Flight Dates */}
          <Card icon={<Users color="#EE4544" />} title="Basic Information">
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* Seats */}
              <InputField
                id="seats"
                label="Seats"
                type="number"
                min={0}
                max={100}
                placeholder="Select amount of seats"
                tooltip="Enter the total number of seats you want to sell for this flight."
                value={formData.seats ?? ""}
                onChange={handleFormChange}
                validationError={validationError && validationError["seats"]}
              />

              {/* Flight Dates */}
              <InputField
                input={<FlightDateField />}
                label={"Flight Dates"}
                tooltip="Choose the departure and return dates for your flight. For one-way flights, leave the return date empty."
                validationError={
                  validationError && validationError[`segments.flightDate`]
                }
              />
            </div>
            {/* </div> */}
          </Card>

          {/* Segments */}
          <Card icon={<Plane color="#EE4544" />} title="Segments">
            <p className="text-red-500 font-bold">
              Add segments in the order of travel
            </p>
            {formData.segments.map(
              (seg: CreateSegmentFormTypes, segIdx: number) => (
                <>
                  <SegmentSection
                    segmentIndex={segIdx}
                    key={segIdx}
                    validationError={validationError}
                  />
                  {/* Conditionally render <hr> if it's not the last segment */}
                  {segIdx < formData.segments.length - 1 && (
                    <hr className="border-t border-gray-300 dark:border-gray-500 my-1"></hr>
                  )}
                </>
              )
            )}
            <div className="w-full text-right">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => dispatch(addSegmentSection())}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
                >
                  <Plus size={20} className="mr-2" />
                  Add Segment
                </button>
                {formData.segments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => dispatch(removeSegmentSection())}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1  md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Flight Classes */}
          {formData.flightClasses.map(
            (flightClass: CreateFlightClassesFormTypes, classIdx: number) => (
              <Card
                icon={<RockingChair color="#EE4544" />}
                title={`Flight Class ${classIdx + 1}`}
                newClass="bg-white dark:bg-gray-700/50"
              >
                <FlightClassesSection
                  classIdx={classIdx}
                  key={classIdx}
                  validationError={validationError}
                />
              </Card>
            )
          )}
          <div className="w-full text-right pb-5">
            {/* <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => dispatch(addFlightClassSection())}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
              >
                <Plus size={20} className="mr-2" />
                Add Flight Class
              </button>
              {formData.flightClasses.length > 1 && (
                <button
                  type="button"
                  onClick={() => dispatch(removeFlightClassSection())}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1  md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
                >
                  <FaMinus />
                </button>
              )}
            </div> */}
          </div>

          {/* Description */}
          <Card icon={<FileText color="#EE4544" />} title="Description">
            <textarea
              id="description"
              className="w-full dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 h-24 shadow dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 border-0"
              placeholder="Flight Ticket Description..."
              value={formData.description}
              onChange={handleFormChange}
            />
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={handleSubmitTicket}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300  text-lg font-semibold"
            >
              Add Ticket
            </button>
          </div>
        </div>
      </form>
      {/* Divider */}
      <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />
    </div>
  );
};

export default AddTicketForm;
