import {
  Card,
  EmptyState,
  Tooltip,
} from "@/components/flight-tickets/myTickets/addTicket/AddTicketComponents";
import {
  CreateFlightClassesFormTypes,
  UserSegmentResultType,
  UserTicketResultType,
} from "@/utils/definitions/myTicketsDefinitions";
import {
  Coins,
  FileText,
  Gift,
  Plane,
  Plus,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ProgressLoading from "@/components/utils/ProgressLoading";
import {
  fetchSingleTicketById,
  fetchUpdateValidTicketById,
} from "@/lib/data/userTicketData";
import {
  addExtraOffersToUpdateTicket,
  addFlightClassSectionToUpdateTicket,
  addSegmentToUpdateTicket,
  removeExtraOffersToUpdateTicket,
  removeFlightClassSectionToUpdateTicket,
  removeSegmentSectionToUpdateTicket,
  selectSingleTicket,
  setTicketUpdateData,
} from "@/redux/features/SingleTicketSlice";
import {
  selectSelectedTicket,
  setSelectedTicket,
} from "@/redux/features/SelectedTicketSlice";
import { selectIsLoggedIn } from "@/redux/features/AuthSlice";
import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFormatDate, getFormatTime } from "@/utils/functions/functions";
import { useRouter } from "next/navigation";
import MyTicketHistoryLogs from "@/components/flight-tickets/myTickets/ticketId/MyTicketHistoryLogs";
import FlightDateUpdateField from "./FlightDateUpdateField";
import { FaMinus } from "react-icons/fa";
import ReusableDropdown from "./ReusableDropdownUpdate";
import {
  flightClassOptions,
  carryOnAllowedOptions,
  carryOnWeightOptions,
  checkedAllowedOptions,
  checkedWeightOptions,
  extraOffersNameOptions,
  extraOffersAvailableOptions,
  statusOptions,
} from "@/components/flight-tickets/myTickets/addTicket/AddTicketData";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import ReusableSearchUpdate from "./ReusableSearchUpdate";
import { updateTicket } from "@/redux/features/TicketSlice";

export default function UpdateSingleTicket({
  ticket,
  updatedTicket,
  editMode,
  updateReqMode,
  handleFormChange,
  validationError,
  handleCancelUpdateTicket,
  handleSubmitTicket,
  handleUpdateRequest,
  handleWithdrawUpdateRequest,
}: {
  ticket: UserTicketResultType;
  updatedTicket: UserTicketResultType;
  editMode: boolean;
  updateReqMode: boolean;
  handleFormChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    segIdx?: number,
    classIdx?: number
  ) => void;
  validationError: any;
  handleCancelUpdateTicket: () => void;
  handleSubmitTicket: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  handleUpdateRequest: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  handleWithdrawUpdateRequest: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
}) {
  // ########### STATES ##############
  const dispatch = useAppDispatch();
  const initFlightTicket: UserTicketResultType | {} =
    useAppSelector(selectSingleTicket);
  const flightTicket = initFlightTicket as UserTicketResultType;
  const formData = useAppSelector(selectSingleTicket);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // error res banner
  const selectedTicket = useAppSelector(selectSelectedTicket);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const router = useRouter();
  // ############ useEffect #############

  const fetchTicket = async () => {
    setIsLoading(true);

    const ticketData = await fetchSingleTicketById(ticket.id);
    // const ticketData = await fetchUpdateValidTicketById(ticket.refId, ticket);
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
    if (ticket.id) {
      fetchTicket();
    }

    // if the selected user is in update state, just activate edit mode
    if (selectedTicket && selectedTicket.status === "update") {
      //   setEditMode(true);
      dispatch(setSelectedTicket({ ticketId: "", status: "" }));
    }
  }, [dispatch, ticket.id, isLoggedIn, router]);

  const loadingAccess = useAgencyUserAuth();

  if (isLoading || loadingAccess) {
    return <ProgressLoading />;
  }

  // If ticket is not found, show 'No ticket found' message
  if (!ticket?.id) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-red-700 text-xl font-bold">Ticket not found</h1>
      </div>
    );
  }

  // get flight location value
  const getFlightLocation = (act: string) => {
    if (act === "departure" || act === "arrival") {
      const { airportCode, country, city, airport } = ticket[act];
      return `${city}, ${country} - ${airportCode}`;
    } else {
      return "";
    }
  };

  // Sort the ticketHistoryLogs array by changedAt in descending order
  const sortedLogs = ticket.ticketHistoryLogs
    ? [...ticket.ticketHistoryLogs].sort(
        (a, b) =>
          new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
      )
    : [];

  const getFlightLocationForSegment = (
    segment: {
      flightNumber: string;
      carrier: string;
      departure: {
        airportCode: string;
        country: string;
        city: string;
        airport: string;
      };
      arrival: {
        airportCode: string;
        country: string;
        city: string;
        airport: string;
      };
      departureTime: string;
      arrivalTime: string;
      duration: string;
    },

    act: "departure" | "arrival"
  ) => {
    if (segment[act]) {
      const { airportCode, country, city, airport } = segment[act];
      return `${city}, ${country} - ${airportCode} (${airport})`;
    }
    return "";
  };

  // update price change
  const handlePriceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    classIdx: number
  ) => {
    const { id, value } = e.target;
    const [field, _] = id.split("-");

    // Update the form data with the modified segment
    const updatedFormData = {
      ...ticket,
      flightClasses: ticket.flightClasses.map(
        (classes: CreateFlightClassesFormTypes, i: number) =>
          i === classIdx
            ? {
                ...classes,
                price: {
                  ...classes.price,
                  [field]: value,
                },
              }
            : classes
      ),
    };

    // Dispatch the updated form state
    dispatch(setTicketUpdateData(updatedFormData));
  };

  interface DropdownOption {
    id: number;
    value: string;
  }

  // Helper function to find initial selected ID
  const findInitialSelectedId = (
    options: DropdownOption[],
    currentValue: string | number | undefined
  ): number => {
    const foundOption = options.find(
      (option) => option.value === currentValue?.toString()
    );
    return foundOption ? foundOption.id : -1;
  };

  const isStatusEditable =
    (ticket.ticketStatus === "unavailable" ||
      ticket.ticketStatus === "available") &&
    editMode;
  return (
    <div className="mb-4 sm:mb-0 w-full">
      <form>
        <div className="space-y-4">
          {/* Main */}
          <Card icon={<Ticket color="#EE4544" />} title="Main">
            {/* ROW 1 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* Ticket Status */}
              {["unavailable", "available"].includes(ticket.ticketStatus) ? (
                <InputField
                  id="ticketStatus"
                  label="Ticket Status"
                  type="text"
                  placeholder="Ticket status"
                  tooltip="This field displays the current status of the ticket."
                  value={ticket?.ticketStatus ?? ""}
                  disabled={isStatusEditable}
                  input={
                    <ReusableDropdown
                      options={statusOptions}
                      initialSelectedId={findInitialSelectedId(
                        statusOptions,
                        ticket.ticketStatus as string
                      )}
                      placeholder="Select flight class"
                      refId={ticket.refId}
                      isTicketStatus={true}
                    />
                  }
                />
              ) : (
                <InputField
                  id="ticketStatus"
                  label="Ticket Status"
                  type="text"
                  placeholder="Ticket status"
                  tooltip="This field displays the current status of the ticket."
                  value={ticket?.ticketStatus ?? ""}
                  disabled={editMode ? !isStatusEditable : true}
                />
              )}
              {/* Seats */}
              {ticket.updated && updatedTicket ? (
                <UpdatedInputField
                  id="seats"
                  label="Seats"
                  tooltip="This field displays the number of seats available for the ticket."
                  value={ticket?.seats ?? ""}
                  newValue={updatedTicket?.seats ?? ""}
                />
              ) : (
                <InputField
                  id="seats"
                  label="Seats"
                  type="number"
                  placeholder="Number of seats"
                  tooltip="This field displays the number of seats available for the ticket."
                  value={ticket?.seats ?? ""}
                  disabled={!editMode && !updateReqMode}
                  onChange={(e) => handleFormChange(e)}
                  validationError={validationError?.seats}
                />
              )}
            </div>
            {/* ROW 2 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* Departure */}
              <InputField
                id="departure"
                label="Departure"
                type="text"
                placeholder="Departure"
                tooltip="This field displays the date when the ticket will depart."
                value={ticket.segments && getFlightLocation("departure")}
                disabled={true}
              />
              {/* Arrival */}
              <InputField
                id="arrival"
                label="Arrival"
                type="text"
                placeholder="Arrival"
                tooltip="This field displays the date when the ticket will arrival."
                value={ticket.segments && getFlightLocation("arrival")}
                disabled={true}
              />
            </div>

            {/* ROW 3 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* departureTime */}
              <InputField
                id="departureTime"
                label="Departure Time"
                type="text"
                placeholder="departure time"
                tooltip="This field displays the time when the ticket will departure."
                value={getFormatTime(ticket.departureTime) ?? ""}
                disabled={true}
              />
              {/* arrivalTime */}
              <InputField
                id="arrivalTime"
                label="Arrival Time"
                type="text"
                placeholder="arrival time"
                tooltip="This field displays the time when the ticket will arrival."
                value={getFormatTime(ticket.arrivalTime) ?? ""}
                disabled={true}
              />
            </div>
            {/* ROW 4 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* flightDate */}
              {editMode ? (
                <InputField
                  id="flightDate"
                  label="Flight Date"
                  type="text"
                  placeholder="Flight Date"
                  tooltip="This field displays the date when the Flight will departure."
                  value={getFormatDate(ticket.flightDate) ?? ""}
                  disabled={!editMode}
                  validationError={validationError?.flightDate}
                  input={<FlightDateUpdateField />}
                />
              ) : (
                <InputField
                  id="flightDate"
                  label="Flight Date"
                  type="text"
                  placeholder="Flight Date"
                  tooltip="This field displays the date when the Flight will departure."
                  value={getFormatDate(ticket.flightDate) ?? ""}
                  disabled={!editMode}
                />
              )}
              {/* duration */}
              <InputField
                id="duration"
                label="duration"
                type="text"
                placeholder="duration"
                tooltip="This field displays the duration when the flight will take."
                value={ticket.duration}
                disabled={true}
              />
            </div>
            {/* ROW 5 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* Description */}
              <InputField
                id="description"
                label="description"
                type="textarea"
                rows={4}
                placeholder="Flight Ticket Description..."
                tooltip="This field displays the description of the Flight."
                value={ticket?.description ?? ""}
                disabled={!editMode}
                required={false}
                onChange={(e) => handleFormChange(e)}
                validationError={validationError?.description}
              />
            </div>
          </Card>

          {/* Segments */}
          <div style={{ margin: "1.5rem 0" }}>
            <Card icon={<Plane color="#EE4544" />} title="Segments">
              {ticket?.segments?.map((segment, segIdx) => (
                <div key={segIdx} className="space-y-4 mt-4">
                  {/* Segment Title */}
                  <div className="text-slate-800 dark:text-slate-100 font-semibold">
                    {`Segment ${segIdx !== 0 ? segIdx + 1 : ""}`}
                  </div>

                  {/* ROW 1 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* Flight Number */}
                    {editMode ? (
                      <InputField
                        id={`flightNumber-${segIdx}`}
                        label={`Flight NO ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the flight number."
                        value={segment?.flightNumber ?? ""}
                        placeholder="Enter flight number"
                        disabled={!editMode}
                        onChange={(e) => handleFormChange(e, segIdx)}
                        validationError={
                          validationError &&
                          validationError[`segments.${segIdx}.flightNumber`]
                        }
                      />
                    ) : (
                      <InputField
                        id={`flightNumber-${segIdx}`}
                        label={`Flight NO ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the flight number."
                        value={segment.flightNumber ?? ""}
                        disabled={!editMode}
                      />
                    )}

                    {/* Carrier */}
                    {editMode ? (
                      <InputField
                        id={`carrier-${segIdx}`}
                        label={`Carrier ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the carrier name."
                        value={segment?.carrier ?? ""}
                        disabled={!editMode}
                        input={
                          <ReusableSearchUpdate
                            segmentIndex={segIdx}
                            fieldType="carrier"
                          />
                        }
                        validationError={
                          validationError &&
                          validationError[`segments.${segIdx}.carrier`]
                        }
                      />
                    ) : (
                      <InputField
                        id={`carrier-${segIdx}`}
                        label={`Carrier ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the carrier name."
                        value={segment.carrier ?? ""}
                        disabled={!editMode}
                      />
                    )}
                  </div>

                  {/* ROW 2 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* Departure Location */}
                    {editMode ? (
                      <InputField
                        id={`departure-${segIdx}`}
                        label={`Departure ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the departure location."
                        value={getFlightLocationForSegment(
                          segment,
                          "departure"
                        )}
                        disabled={!editMode}
                        input={
                          <ReusableSearchUpdate
                            segmentIndex={segIdx}
                            fieldType="departure"
                          />
                        }
                        validationError={
                          validationError &&
                          validationError[
                            `segments.${segIdx}.departure.airportCode`
                          ]
                        }
                      />
                    ) : (
                      <InputField
                        id={`departure-${segIdx}`}
                        label={`Departure ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the departure location."
                        value={getFlightLocationForSegment(
                          segment,
                          "departure"
                        )}
                        disabled={!editMode}
                      />
                    )}

                    {/* Arrival Location */}
                    {editMode ? (
                      <InputField
                        id={`arrival-${segIdx}`}
                        label={`Arrival ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the arrival location."
                        value={getFlightLocationForSegment(segment, "arrival")}
                        disabled={!editMode}
                        input={
                          <ReusableSearchUpdate
                            segmentIndex={segIdx}
                            fieldType="arrival"
                          />
                        }
                        validationError={
                          validationError &&
                          validationError[
                            `segments.${segIdx}.arrival.airportCode`
                          ]
                        }
                      />
                    ) : (
                      <InputField
                        id={`arrival-${segIdx}`}
                        label={`Arrival ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the arrival location."
                        value={getFlightLocationForSegment(segment, "arrival")}
                        disabled={!editMode}
                      />
                    )}
                  </div>

                  {/* ROW 3 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* Departure Time */}
                    {editMode ? (
                      <InputField
                        id={`departureTime-${segIdx}`}
                        label={`Departure Time ${
                          segIdx !== 0 ? segIdx + 1 : ""
                        }`}
                        type="text"
                        tooltip="This field displays the departure time."
                        value={getFormatTime(segment.departureTime) ?? ""}
                        disabled={!editMode}
                        input={
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                              id={`departureTime-${segIdx}`}
                              className="custom-time-field w-full"
                              format="HH:mm"
                              disabled={!editMode}
                              value={dayjs(segment.departureTime)}
                              onChange={(newTime: any) => {
                                if (newTime) {
                                  // update the departure time on form data
                                  const updatedFormData = {
                                    ...ticket,
                                    segments: ticket.segments.map(
                                      (seg: UserSegmentResultType, i: number) =>
                                        i === segIdx
                                          ? {
                                              ...seg,
                                              departureTime: dayjs(
                                                newTime
                                              ).format(
                                                "YYYY-MM-DDTHH:mm:ss.SSS"
                                              ),
                                            }
                                          : seg
                                    ),
                                  };

                                  // Dispatch the updated form state
                                  dispatch(
                                    setTicketUpdateData(updatedFormData)
                                  );
                                }
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  border: "none", // Remove border
                                  outline: "none", // Remove outline
                                  boxShadow: "none", // Remove box-shadow (focus ring)
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove notched outline
                                },
                                "& .MuiOutlinedInput-root.Mui-focused": {
                                  border: "2px solid #ef4444", // Apply red border (border-red-500 in Tailwind)
                                  outline: "none", // Remove focus outline
                                  boxShadow: "none", // Remove focus shadow
                                },
                              }}
                            />
                          </LocalizationProvider>
                        }
                        validationError={
                          validationError &&
                          validationError[`segments.${segIdx}.departureTime`]
                        }
                      />
                    ) : (
                      <InputField
                        id={`departureTime-${segIdx}`}
                        label={`Departure Time ${
                          segIdx !== 0 ? segIdx + 1 : ""
                        }`}
                        type="text"
                        tooltip="This field displays the departure time."
                        value={getFormatTime(segment.departureTime) ?? ""}
                        disabled={!editMode}
                      />
                    )}

                    {/* Arrival Time */}
                    {editMode ? (
                      <InputField
                        id={`arrivalTime-${segIdx}`}
                        label={`Arrival Time ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the arrival time."
                        value={getFormatTime(segment.arrivalTime) ?? ""}
                        disabled={!editMode}
                        input={
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                              id={`arrivalTime-${segIdx}`}
                              className="custom-time-field w-full"
                              format="HH:mm"
                              disabled={!editMode}
                              value={dayjs(segment.arrivalTime)}
                              onChange={(newTime: any) => {
                                if (newTime) {
                                  // update the departure time on form data
                                  const updatedFormData = {
                                    ...ticket,
                                    segments: ticket.segments.map(
                                      (seg: UserSegmentResultType, i: number) =>
                                        i === segIdx
                                          ? {
                                              ...seg,
                                              arrivalTime: dayjs(
                                                newTime
                                              ).format(
                                                "YYYY-MM-DDTHH:mm:ss.SSS"
                                              ),
                                            }
                                          : seg
                                    ),
                                  };

                                  // Dispatch the updated form state
                                  dispatch(
                                    setTicketUpdateData(updatedFormData)
                                  );
                                }
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  border: "none", // Remove border
                                  outline: "none", // Remove outline
                                  boxShadow: "none", // Remove box-shadow (focus ring)
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none", // Remove notched outline
                                  outline: "none", // Remove outline
                                  boxShadow: "none", // Remove box-shadow (focus ring)
                                },
                                "& .MuiOutlinedInput-root.Mui-focused": {
                                  border: "2px solid #ef4444", // Apply red border (border-red-500 in Tailwind)
                                  outline: "none",
                                  boxShadow: "none",
                                },
                              }}
                            />
                          </LocalizationProvider>
                        }
                        validationError={
                          validationError?.[`segments?.${segIdx}?.arrivalTime`]
                        }
                      />
                    ) : (
                      <InputField
                        id={`arrivalTime-${segIdx}`}
                        label={`Arrival Time ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the arrival time."
                        value={getFormatTime(segment.arrivalTime) ?? ""}
                        disabled={!editMode}
                      />
                    )}

                    {/* Duration */}
                    {!editMode && (
                      <InputField
                        id={`duration-${segIdx}`}
                        label={`Duration ${segIdx !== 0 ? segIdx + 1 : ""}`}
                        type="text"
                        tooltip="This field displays the flight duration."
                        value={segment.duration}
                        disabled={true}
                        placeholder="hh:mm"
                      />
                    )}
                  </div>
                  {/* Conditionally render <hr> if it's not the last segment */}
                  {segIdx < ticket.segments.length - 1 && (
                    <hr className="border-t border-gray-300 dark:border-gray-500 my-1"></hr>
                  )}
                </div>
              ))}

              {/* BUTTONS */}
              {editMode && (
                <div className="w-full text-right mt-4">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => dispatch(addSegmentToUpdateTicket())}
                      className="bg-blue-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
                    >
                      <Plus size={20} className="mr-2" />
                      Add Segment
                    </button>
                    {ticket?.segments.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeSegmentSectionToUpdateTicket())
                        }
                        className="bg-red-500 text-white px-2 py-1  md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-red-600"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* FLIGHT CLASSES  */}
          {ticket.flightClasses.map((flightClass, classIdx) => (
            <div
              key={classIdx}
              id={`Flight Classes ${classIdx !== 0 ? classIdx + 1 : ""}`}
            >
              {/* flightClass */}
              <Card
                icon={<Users color="#EE4544" />}
                title={`Flight Classes ${classIdx !== 0 ? classIdx + 1 : ""}`}
              >
                <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                  {/* FLIGHT CLASSES */}
                  {editMode ? (
                    <InputField
                      id={`flightClass-${classIdx}`}
                      label={`Flight Class ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the Flight Class of the Flight."
                      value={flightClass?.type ?? ""}
                      disabled={editMode}
                      validationError={
                        validationError &&
                        validationError[`flightClasses.${classIdx}.type`]
                      }
                      input={
                        <ReusableDropdown
                          options={flightClassOptions}
                          initialSelectedId={findInitialSelectedId(
                            flightClassOptions,
                            flightClass.type as string
                          )}
                          placeholder="Select flight class"
                          classIdx={classIdx}
                          isTicketStatus={false}
                        />
                      }
                    />
                  ) : (
                    <InputField
                      id={`flightClass-${classIdx}`}
                      label={`Flight Class ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the Flight Class of the Flight."
                      value={flightClass?.type ?? ""}
                      disabled={!editMode}
                    />
                  )}
                </div>
              </Card>

              {/* Baggage */}
              <Card
                icon={<Users color="#EE4544" />}
                title={`Baggage ${classIdx !== 0 ? classIdx + 1 : ""}`}
              >
                {/* ROW 1 */}
                <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                  {/* carryOnAllowed */}
                  {editMode ? (
                    <InputField
                      id={`carryOnAllowed-${classIdx}`}
                      label={`Carry On Allowed ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the maximum number of carry-on bags allowed."
                      value={flightClass?.carryOnAllowed ?? ""}
                      disabled={!editMode}
                      input={
                        <ReusableDropdown
                          options={carryOnAllowedOptions}
                          initialSelectedId={findInitialSelectedId(
                            carryOnAllowedOptions,
                            flightClass.carryOnAllowed as number
                          )}
                          placeholder="Select carry-on allowed"
                          classIdx={classIdx}
                          isBaggageDropdown={true}
                          baggage="carryOnAllowed"
                        />
                      }
                      validationError={
                        validationError &&
                        validationError[
                          `flightClasses.${classIdx}.carryOnAllowed`
                        ]
                      }
                    />
                  ) : (
                    <InputField
                      id={`carryOnAllowed-${classIdx}`}
                      label={`Carry On Allowed ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the maximum number of carry-on bags allowed."
                      value={flightClass?.carryOnAllowed ?? ""}
                      disabled={!editMode}
                    />
                  )}

                  {/* carryOnWeight */}
                  {editMode ? (
                    <InputField
                      id={`carryOnWeight-${classIdx}`}
                      label={`Carry On Weight ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the Maximum weight allowed for each carry-on bag."
                      value={flightClass?.carryOnWeight ?? ""}
                      disabled={!editMode}
                      input={
                        <ReusableDropdown
                          options={carryOnWeightOptions}
                          initialSelectedId={findInitialSelectedId(
                            carryOnWeightOptions,
                            flightClass.carryOnWeight as number
                          )}
                          placeholder="Max Weight Per Bag"
                          classIdx={classIdx}
                          isBaggageDropdown={true}
                          baggage="carryOnWeight"
                        />
                      }
                      validationError={
                        validationError &&
                        validationError[
                          `flightClasses.${classIdx}.carryOnWeight`
                        ]
                      }
                    />
                  ) : (
                    <InputField
                      id={`carryOnWeigh-${classIdx}`}
                      label={`Carry On Weight ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the Maximum weight allowed for each carry-on bag."
                      value={flightClass?.carryOnWeight ?? ""}
                      disabled={!editMode}
                    />
                  )}
                </div>

                {/* ROW 2 */}
                <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                  {/* checkedAllowed */}
                  {editMode ? (
                    <InputField
                      id={`checkedAllowed-${classIdx}`}
                      label={`Checked Bags Allowed ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the maximum number of checked bags allowed."
                      value={flightClass?.checkedAllowed ?? ""}
                      disabled={!editMode}
                      input={
                        <ReusableDropdown
                          options={checkedAllowedOptions}
                          initialSelectedId={findInitialSelectedId(
                            checkedAllowedOptions,
                            flightClass.checkedAllowed as number
                          )}
                          placeholder="Select checked allowed"
                          classIdx={classIdx}
                          isBaggageDropdown={true}
                          baggage="checkedAllowed"
                        />
                      }
                      validationError={
                        validationError &&
                        validationError[
                          `flightClasses.${classIdx}.carryOnWeight`
                        ]
                      }
                    />
                  ) : (
                    <InputField
                      id={`checkedAllowed-${classIdx}`}
                      label={`Checked Bags Allowed ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the maximum number of checked bags allowed."
                      value={flightClass?.checkedAllowed ?? ""}
                      disabled={!editMode}
                    />
                  )}

                  {/* checkedWeight */}
                  {editMode ? (
                    <InputField
                      id={`checkedWeight-${classIdx}`}
                      label={`Checked Bags Weight ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the Maximum weight allowed for each Checked bag."
                      value={flightClass?.checkedWeight ?? ""}
                      disabled={!editMode}
                      input={
                        <ReusableDropdown
                          options={checkedWeightOptions}
                          initialSelectedId={findInitialSelectedId(
                            checkedWeightOptions,
                            flightClass.checkedWeight as number
                          )}
                          placeholder="Max Weight Per Bag"
                          classIdx={classIdx}
                          isBaggageDropdown={true}
                          baggage="checkedWeight"
                        />
                      }
                      validationError={
                        validationError &&
                        validationError[
                          `flightClasses.${classIdx}.checkedWeight`
                        ]
                      }
                    />
                  ) : (
                    <InputField
                      id={`checkedWeight-${classIdx}`}
                      label={`Checked Bags Weight ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="text"
                      tooltip="This field displays the Maximum weight allowed for each Checked bag."
                      value={flightClass?.checkedWeight ?? ""}
                      disabled={!editMode}
                    />
                  )}
                </div>

                {/* ROW 3 */}
                <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                  {/* checkedFee */}
                  <InputField
                    id={`checkedFee-${classIdx}`}
                    label={`Checked Bag Fee ${
                      classIdx !== 0 ? classIdx + 1 : ""
                    }`}
                    type="text"
                    tooltip="This field displays the fee for each checked bag."
                    placeholder="Fee for first checked bag"
                    value={flightClass?.checkedFee ?? ""}
                    min={0}
                    disabled={!editMode}
                    onChange={(e) => handleFormChange(e, undefined, classIdx)}
                    validationError={
                      validationError &&
                      validationError[`flightClasses.${classIdx}.checkedFee`]
                    }
                  />

                  {/* additionalFee */}
                  <InputField
                    id={`additionalFee-${classIdx}`}
                    label={`Additional Bag Fee ${
                      classIdx !== 0 ? classIdx + 1 : ""
                    }`}
                    type="text"
                    tooltip="This field displays the fee for any additional bags beyond the allowed limit."
                    placeholder="Fee for additional bags"
                    value={flightClass?.additionalFee ?? ""}
                    min={0}
                    disabled={!editMode}
                    onChange={(e) => handleFormChange(e, undefined, classIdx)}
                    validationError={
                      validationError &&
                      validationError[`flightClasses.${classIdx}.additionalFee`]
                    }
                  />
                </div>
              </Card>

              {/* Price */}
              <Card
                icon={<Coins color="#EE4544" />}
                title={`Price ${classIdx !== 0 ? classIdx + 1 : ""}`}
              >
                <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                  {/* adult */}
                  {ticket.updated && updatedTicket ? (
                    <UpdatedInputField
                      id={`adult-${classIdx}`}
                      label={`Adult (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      tooltip="This field displays the price for an adult ticket in Jordanian Dinars."
                      value={flightClass?.price?.adult ?? ""}
                      newValue={
                        updatedTicket?.flightClasses[classIdx]?.price.adult ??
                        ""
                      }
                    />
                  ) : (
                    <InputField
                      id={`adult-${classIdx}`}
                      label={`Adult (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="number"
                      min={0}
                      tooltip="This field displays the price for an adult ticket in Jordanian Dinars."
                      placeholder="Adult price"
                      value={flightClass?.price?.adult ?? ""}
                      disabled={!editMode && !updateReqMode}
                      onChange={(e) => handlePriceChange(e, classIdx)}
                      validationError={
                        validationError &&
                        validationError[`flightClasses.${classIdx}.price.adult`]
                      }
                    />
                  )}

                  {/* child */}
                  {ticket.updated && updatedTicket ? (
                    <UpdatedInputField
                      id={`child-${classIdx}`}
                      label={`Child (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      tooltip="This field displays the price for a child ticket."
                      value={flightClass?.price.child ?? ""}
                      newValue={
                        updatedTicket?.flightClasses[classIdx]?.price.child ??
                        ""
                      }
                    />
                  ) : (
                    <InputField
                      id={`child-${classIdx}`}
                      label={`Child (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="number"
                      min={0}
                      tooltip="This field displays the price for a child ticket."
                      placeholder="Child price"
                      value={flightClass?.price.child ?? ""}
                      disabled={!editMode && !updateReqMode}
                      onChange={(e) => handlePriceChange(e, classIdx)}
                      validationError={
                        validationError &&
                        validationError[`flightClasses.${classIdx}.price.child`]
                      }
                    />
                  )}
                </div>
                {/* row 2 */}
                <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                  {/* infant */}
                  {ticket.updated && updatedTicket ? (
                    <UpdatedInputField
                      id={`infant-${classIdx}`}
                      label={`Infant (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      tooltip="This field displays the price for an infant ticket."
                      value={flightClass?.price.infant ?? ""}
                      newValue={
                        updatedTicket?.flightClasses[classIdx]?.price.infant ??
                        ""
                      }
                    />
                  ) : (
                    <InputField
                      id={`infant-${classIdx}`}
                      label={`Infant (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="number"
                      min={0}
                      tooltip="This field displays the price for an infant ticket."
                      placeholder="Infant price"
                      value={flightClass?.price.infant ?? ""}
                      disabled={!editMode && !updateReqMode}
                      onChange={(e) => handlePriceChange(e, classIdx)}
                      validationError={
                        validationError &&
                        validationError[
                          `flightClasses.${classIdx}.price.infant`
                        ]
                      }
                    />
                  )}

                  {/* tax */}
                  {ticket.updated && updatedTicket ? (
                    <UpdatedInputField
                      id={`tax-${classIdx}`}
                      label={`Tax % (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      tooltip="This field displays the tax amount for the ticket in percentage."
                      value={flightClass.price.tax ?? ""}
                      newValue={
                        updatedTicket?.flightClasses[classIdx]?.price.tax ?? ""
                      }
                    />
                  ) : (
                    <InputField
                      id={`tax-${classIdx}`}
                      label={`Tax % (JOD) ${
                        classIdx !== 0 ? classIdx + 1 : ""
                      }`}
                      type="number"
                      min={0}
                      tooltip="This field displays the tax amount for the ticket in percentage."
                      placeholder="Tax price"
                      value={flightClass.price.tax ?? ""}
                      disabled={!editMode && !updateReqMode}
                      onChange={(e) => handlePriceChange(e, classIdx)}
                      validationError={
                        validationError &&
                        validationError[`flightClasses.${classIdx}.price.tax`]
                      }
                    />
                  )}
                </div>
              </Card>

              {/* extraOffers */}
              <Card
                icon={<Gift color="#EE4544" />}
                title={`Extra Offers ${classIdx !== 0 ? classIdx + 1 : ""}`}
              >
                {flightClass.extraOffers.length === 0 && editMode ? (
                  <EmptyState
                    icon={<Gift size={48} color="#EE4544" />}
                    title="No Extra Offers Yet"
                    description="Click the button below to add special offers or upgrades for this flight."
                  />
                ) : (
                  <>
                    {flightClass.extraOffers.map((offer, offerIdx) => (
                      <div
                        key={offerIdx + offer.name}
                        className="md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4"
                      >
                        {/* Offer Name */}
                        {editMode ? (
                          <InputField
                            id={`name-${classIdx}-${offerIdx}`}
                            label={`Name ${offerIdx !== 0 ? offerIdx + 1 : ""}`}
                            type="text"
                            tooltip="This field displays the name of the extra offer."
                            value={offer.name}
                            disabled={!editMode}
                            input={
                              <ReusableDropdown
                                options={extraOffersNameOptions}
                                initialSelectedId={
                                  findInitialSelectedId(
                                    extraOffersNameOptions,
                                    offer.name
                                  )!
                                }
                                placeholder="Select an extra offer"
                                classIdx={classIdx}
                                offerIdx={offerIdx}
                                value={offer.name}
                                field="name"
                              />
                            }
                            validationError={
                              validationError &&
                              validationError[
                                `flightClasses.${classIdx}.extraOffers.${offerIdx}.name`
                              ]
                            }
                          />
                        ) : (
                          <InputField
                            id={`name-${classIdx}-${offerIdx}`}
                            label={`Name ${offerIdx !== 0 ? offerIdx + 1 : ""}`}
                            type="text"
                            tooltip="This field displays the name of the extra offer."
                            value={offer.name}
                            disabled={!editMode}
                          />
                        )}

                        {/* Offer Availability */}
                        {editMode ? (
                          <InputField
                            id={`available-${classIdx}-${offerIdx}`}
                            label={`Available ${
                              offerIdx !== 0 ? offerIdx + 1 : ""
                            }`}
                            type="text"
                            tooltip="This field displays the availability of the extra offer."
                            value={offer.available}
                            disabled={!editMode}
                            input={
                              <ReusableDropdown
                                options={extraOffersAvailableOptions}
                                initialSelectedId={findInitialSelectedId(
                                  extraOffersAvailableOptions,
                                  offer.available
                                )}
                                placeholder="Select availability"
                                classIdx={classIdx}
                                offerIdx={offerIdx}
                                value={offer.available}
                                field="available"
                              />
                            }
                            validationError={
                              validationError &&
                              validationError[
                                `flightClasses.${classIdx}.extraOffers.${offerIdx}.available`
                              ]
                            }
                          />
                        ) : (
                          <InputField
                            id={`available-${classIdx}-${offerIdx}`}
                            label={`Available ${
                              offerIdx !== 0 ? offerIdx + 1 : ""
                            }`}
                            type="text"
                            tooltip="This field displays the availability of the extra offer."
                            value={offer.available}
                            disabled={!editMode}
                          />
                        )}

                        {editMode && (
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeExtraOffersToUpdateTicket({
                                  classIdx,
                                  offerIdx,
                                })
                              )
                            }
                            className="mt-6 p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                            title="Delete offer"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {editMode && (
                  <div className="w-full text-right pb-5">
                    <div className="flex justify-between items-center">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center mt-6 shadow-md hover:shadow-lg transition-all duration-300 "
                        type="button"
                        onClick={() =>
                          dispatch(addExtraOffersToUpdateTicket({ classIdx }))
                        }
                      >
                        <Plus size={20} className="mr-2" />
                        Add Extra Offer
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
          {/* {editMode && (
            <div className="w-full text-right pb-5">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(addFlightClassSectionToUpdateTicket());
                  }}
                  className="bg-blue-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
                >
                  <Plus size={20} className="mr-2" />
                  Add Flight Class
                </button>
                {flightTicket.flightClasses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(removeFlightClassSectionToUpdateTicket());
                    }}
                    className="bg-red-500 opacity-70 text-white px-2 py-1  md:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 "
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            </div>
          )} */}

          {/* withdraw update request button  */}
          {ticket.updated && (
            <div className="text-right space-x-5 border-t-2 py-5 border-slate-500 dark:border-slate-400">
              <button
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleWithdrawUpdateRequest(e)
                }
                className={`btn text-white capitalize px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base font-semibold ${"bg-red-500 hover:bg-red-600"}`}
              >
                Withdraw Update Request
                <Tooltip text={`${"Withdraw the update request."}`} />
              </button>
            </div>
          )}

          {/* Buttons */}
          {(editMode || updateReqMode) && (
            <div className="text-right space-x-0 md:space-x-5 border-t-2 py-5 border-slate-500 dark:border-slate-400 flex md:flex-row flex-col-reverse justify-end">
              {/* invalid ticket update btns */}
              {editMode &&
                ["cancel", "update"].map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      action === "update"
                        ? handleSubmitTicket(e)
                        : handleCancelUpdateTicket()
                    }
                    className={`btn text-white capitalize px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base font-semibold ${
                      action === "update"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600 mt-5 md:mt-0"
                    }`}
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                    <Tooltip
                      text={`${
                        action === "update"
                          ? "Submit changes to update the ticket details."
                          : "Discard changes and cancel the update process."
                      }`}
                    />
                  </button>
                ))}

              {/* valid update request btns  */}
              {updateReqMode &&
                ["cancel", "update"].map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      action === "update"
                        ? handleUpdateRequest(e)
                        : handleCancelUpdateTicket()
                    }
                    className={`btn text-white capitalize px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base font-semibold ${
                      action === "update"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                    <Tooltip
                      text={`${
                        action === "update"
                          ? "Send Update request, the changes apply upon admin user approval."
                          : "Discard changes and cancel the update process."
                      }`}
                    />
                  </button>
                ))}
            </div>
          )}
          {/* Ticket Logs */}
          {/* Content container */}
          <Card icon={<FileText color="#EE4544" />} title="Ticket Logs">
            {/* Logs section */}
            <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6 mb-6 shadow-md">
              {/* Section header with icon and tooltip */}
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <FileText className="mr-2 text-red-500" />
                Recent Activity
                <Tooltip
                  text="This section displays the most recent ticket-related
                              actions, sorted by date with the latest updates shown
                              first."
                />
              </h2>
              {/* Scrollable log entries container */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar-logs">
                {/* Map through log entries and render each one */}
                {sortedLogs &&
                  sortedLogs.length > 0 &&
                  sortedLogs.map((ticketLogs, idx) => (
                    <MyTicketHistoryLogs
                      key={idx}
                      ticketLogs={ticketLogs}
                      index={sortedLogs.length - idx}
                    />
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

export const InputField = ({
  id,
  label,
  placeholder,
  icon,
  tooltip,
  value,
  onChange,
  type,
  min,
  max,
  validationError,
  input,
  rows,
  disabled,
  required = true,
}: {
  id?: string;
  label: string;
  placeholder?: string;
  icon?: any;
  tooltip?: string;
  value?: string | number | undefined;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  min?: number;
  max?: number;
  validationError?: any;
  input?: any;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}) => (
  <div className="flex-1 min-h-[5.6rem]">
    <label
      className="text-sm text-gray-800 dark:text-white font-medium mb-2 flex items-center capitalize"
      htmlFor={id}
    >
      {label} {required && <span className="text-red-500">*</span>}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    {input ? (
      input
    ) : type === "textarea" ? (
      <textarea
        id={id}
        style={{ resize: "none" }}
        className="w-full border-0 text-opacity-70 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 disabled:bg-gray-400/50 disabled:dark:bg-gray-800/50 rounded-lg py-2 px-3 shadow focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed"
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    ) : (
      <div className="relative">
        <input
          placeholder={placeholder}
          className="w-full border-0 
              text-opacity-70 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 shadow dark:shadow-inner border-none outline-none ring-0 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows disabled:cursor-not-allowed disabled:bg-gray-400/50 disabled:dark:bg-gray-800/50"
          id={id}
          value={value ?? ""}
          min={min}
          max={max}
          type={type}
          onChange={onChange}
          inputMode={type === "number" ? "numeric" : "text"}
          pattern={type === "number" ? "[0-9]*" : undefined}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          disabled={disabled}
          readOnly={!onChange}
        />
        {icon && (
          <span className="absolute right-3 top-2.5 text-gray-400">{icon}</span>
        )}
      </div>
    )}
    <div className="text-[10px] mt-1 text-rose-500">{validationError}</div>
  </div>
);

export const UpdatedInputField = ({
  id,
  label,
  tooltip,
  icon,
  value,
  newValue,
}: {
  id?: string;
  label: string;
  tooltip?: string;
  icon?: any;
  value?: string | number | undefined;
  newValue?: string | number | undefined;
}) => (
  <div className="flex-1 min-h-[5.6rem]">
    <label
      className="text-sm text-gray-800 dark:text-white font-medium mb-2 flex items-center capitalize"
      htmlFor={id}
    >
      {label}
      {tooltip && <Tooltip text={tooltip} />}
    </label>

    <div className="relative">
      <div
        className={`w-full ${
          value === newValue ? "" : "border-2 border-green-500"
        }
              text-opacity-70 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70  dark:bg-gray-600 rounded-lg py-2 px-3 shadow  dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800/50`}
      >
        {value === newValue ? (
          value
        ) : (
          <>
            {" "}
            <span className="text-red-500 opacity-70">{value}</span>
            {" -> "}
            <span className="text-green-500">{newValue}</span>
          </>
        )}
      </div>
      {icon && (
        <span className="absolute right-3 top-2.5 text-gray-400">{icon}</span>
      )}
    </div>
  </div>
);
