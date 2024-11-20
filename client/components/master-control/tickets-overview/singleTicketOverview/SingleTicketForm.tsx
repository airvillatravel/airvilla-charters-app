import {
  Card,
  Tooltip,
} from "@/components/flight-tickets/myTickets/addTicket/AddTicketComponents";
import { MasterTicketResultType } from "@/utils/definitions/masterDefinitions";
import {
  Building,
  Coins,
  FileText,
  Gift,
  Plane,
  RockingChair,
  Ticket,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { fetchSingleTicketForMaster } from "@/lib/data/masterTicketsData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getFormatDate, getFormatTime } from "@/utils/functions/functions";
import { useRouter } from "next/navigation";
import MyTicketHistoryLogs from "@/components/flight-tickets/myTickets/ticketId/MyTicketHistoryLogs";
import ReusableDropdown from "@/components/flight-tickets/myTickets/ticketId/ReusableDropdownUpdate";

const statusOptions = [
  {
    id: 0,
    value: "available",
  },
  {
    id: 1,
    value: "unavailable",
  },

  {
    id: 2,
    value: "rejected",
  },

  {
    id: 3,
    value: "blocked",
  },
  {
    id: 4,
    value: "hold",
  },
];

export default function SingleTicketForm({ ticketId }: { ticketId: string }) {
  // Ticket State Variables
  const [singleTicket, setSingleTicket] = useState<MasterTicketResultType | {}>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get ticket as FlightTicketRes type
  const ticket = singleTicket as MasterTicketResultType;

  // HOOKS
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Function to fetch a single ticket for master
    const getTicket = async () => {
      // Set loading to true
      setIsLoading(true);

      // Fetch single ticket for master
      const singleTicket = await fetchSingleTicketForMaster(ticketId);

      // Check if the fetching was successful
      if (singleTicket.success) {
        setSingleTicket(singleTicket.results);
      }

      // Dispatch message based on the success of fetching
      dispatch(
        setMsg({
          success: singleTicket.success,
          message: singleTicket.message,
        })
      );

      // Set loading to false after fetching
      setIsLoading(false);
    };
    getTicket();
  }, [ticketId]);

  // handle back navigation
  useEffect(() => {
    const handleBackNavigation = (e: any) => {
      e.preventDefault();
      const ticketsPageUrl = "/master-control/tickets-overview";
      router.push(ticketsPageUrl + "#" + (ticket.ticketStatus || "available"));
    };

    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [router, ticket.ticketStatus]);

  // Show loading component if loading is true
  if (isLoading) {
    return <ProgressLoading />;
  }

  const ticketStatusOptions = [
    "available",
    "unavailable",
    "rejected",
    "blocked",
    "expired",
    "hold",
  ];
  // If ticket is not found, show 'No ticket found' message
  if (
    !ticketId ||
    !ticket?.id ||
    !ticketStatusOptions.includes(ticket.ticketStatus)
  ) {
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

  return (
    <div className="mb-4 sm:mb-0 w-full">
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-8 text-left text-slate-800 dark:text-white capitalize">
          Ticket <span className="text-slate-500 text-xl">#{ticketId}</span>
        </h1>
      </header>
      <form>
        <div className="space-y-4">
          {/* Agency */}
          <Card icon={<Building color="#EE4544" />} title="Agency">
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* Agency Name */}
              <InputField
                id="agencyName"
                label="agencyName"
                type="text"
                placeholder="Enter agency name"
                tooltip="This field displays the name of the agency associated with the ticket."
                value={ticket?.owner?.agencyName ?? ""}
                disabled={true}
              />
              {/* User Name */}
              <InputField
                id="userFullName"
                label="Agent"
                type="text"
                placeholder="Agent name"
                tooltip="This field displays the name of the agent associated with the ticket."
                value={
                  ticket?.agencyAgent
                    ? `${ticket?.agencyAgent?.firstName} ${ticket?.agencyAgent?.lastName}`
                    : "Agent"
                }
                disabled={true}
              />
            </div>
          </Card>

          {/* Main */}
          <Card icon={<Ticket color="#EE4544" />} title="Main">
            {/* ROW 1 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* Ticket Status */}
              <InputField
                id="ticketStatus"
                label="Ticket Status"
                type="text"
                placeholder="Ticket status"
                tooltip="This field displays the current status of the ticket."
                value={ticket?.ticketStatus ?? ""}
                disabled={true}
                input={
                  ticket.ticketStatus !== "expired" ? (
                    <ReusableDropdown
                      options={statusOptions}
                      value={ticket.ticketStatus}
                      initialSelectedId={findInitialSelectedId(
                        statusOptions,
                        ticket.ticketStatus as string
                      )}
                      placeholder="Select flight class"
                      refId={ticket.refId}
                      isTicketStatus={true}
                      isMasterAdmin={true}
                    />
                  ) : (
                    ""
                  )
                }
              />
              {/* Seats */}
              <InputField
                id="seats"
                label="Seats"
                type="number"
                placeholder="Number of seats"
                tooltip="This field displays the number of seats available for the ticket."
                value={ticket?.seats ?? ""}
                disabled={true}
              />
            </div>
            {/* ROW 2 */}
            <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* Departure Date */}
              <InputField
                id="departure"
                label="Departure"
                type="text"
                placeholder="Departure"
                tooltip="This field displays the date when the ticket will depart."
                value={ticket.segments && getFlightLocation("departure")}
                disabled={true}
              />
              {/* Departure Time */}
              <InputField
                id="arrival"
                label="arrival"
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
              <InputField
                id="flightDate"
                label="Flight Date"
                type="text"
                placeholder="Flight Date"
                tooltip="This field displays the date when the Flight will departure."
                value={getFormatDate(ticket.flightDate) ?? ""}
                disabled={true}
              />
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
                disabled={true}
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
                    <InputField
                      id={`flightNumber-${segIdx}`}
                      label={`Flight NO ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the flight number."
                      value={segment.flightNumber ?? ""}
                      disabled={true}
                    />

                    {/* Carrier */}
                    <InputField
                      id={`carrier-${segIdx}`}
                      label={`Carrier ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the carrier name."
                      value={segment.carrier ?? ""}
                      disabled={true}
                    />
                  </div>

                  {/* ROW 2 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* Departure Location */}
                    <InputField
                      id={`departure-${segIdx}`}
                      label={`Departure ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the departure location."
                      value={getFlightLocationForSegment(segment, "departure")}
                      disabled={true}
                    />

                    {/* Arrival Location */}
                    <InputField
                      id={`arrival-${segIdx}`}
                      label={`Arrival ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the arrival location."
                      value={getFlightLocationForSegment(segment, "arrival")}
                      disabled={true}
                    />
                  </div>

                  {/* ROW 3 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* Departure Time */}
                    <InputField
                      id={`departureTime-${segIdx}`}
                      label={`Departure Time ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the departure time."
                      value={getFormatTime(segment.departureTime) ?? ""}
                      disabled={true}
                    />

                    {/* Arrival Time */}
                    <InputField
                      id={`arrivalTime-${segIdx}`}
                      label={`Arrival Time ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the arrival time."
                      value={getFormatTime(segment.arrivalTime) ?? ""}
                      disabled={true}
                    />

                    {/* Duration */}
                    <InputField
                      id={`duration-${segIdx}`}
                      label={`Duration ${segIdx !== 0 ? segIdx + 1 : ""}`}
                      type="text"
                      tooltip="This field displays the flight duration."
                      value={segment.duration}
                      disabled={true}
                    />
                  </div>
                  {/* Conditionally render <hr> if it's not the last segment */}
                  {segIdx < ticket.segments.length - 1 && (
                    <hr className="border-t border-gray-300 dark:border-gray-500 my-1"></hr>
                  )}
                </div>
              ))}
            </Card>
          </div>

          {/* FLIGHT CLASSES  */}
          {ticket?.flightClasses?.map((flightClass, classIdx) => (
            <Card
              icon={<RockingChair color="#EE4544" />}
              title={`Flight Class ${classIdx + 1}`}
            >
              <div key={classIdx}>
                <Card icon={<Users color="#EE4544" />} title="Flight Classes">
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                    {/* FLIGHT CLASSES */}
                    <InputField
                      id="flightClass"
                      label="Flight Class"
                      type="text"
                      tooltip="This field displays the Flight Class of the Flight."
                      value={flightClass?.type ?? ""}
                      disabled={true}
                    />
                  </div>
                </Card>

                {/* Baggage */}
                <Card icon={<Users color="#EE4544" />} title="Baggage">
                  {/* ROW 1 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
                    {/* carryOnAllowed */}
                    <InputField
                      id="carryOnAllowed"
                      label="Carry On Allowed"
                      type="text"
                      tooltip="This field displays the maximum number of carry-on bags allowed."
                      value={flightClass?.carryOnAllowed ?? ""}
                      disabled={true}
                    />

                    {/* carryOnWeight */}
                    <InputField
                      id="carryOnWeight"
                      label="Carry On Weight"
                      type="text"
                      tooltip="This field displays the Maximum weight allowed for each carry-on bag."
                      value={flightClass?.carryOnWeight ?? ""}
                      disabled={true}
                    />
                  </div>

                  {/* ROW 2 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* checkedAllowed */}
                    <InputField
                      id="checkedAllowed"
                      label="Checked Bags Allowed"
                      type="text"
                      tooltip="This field displays the maximum number of checked bags allowed."
                      value={flightClass?.checkedAllowed ?? ""}
                      disabled={true}
                    />

                    {/* carryOnWeight */}
                    <InputField
                      id="checkedWeight"
                      label="Checked Bags Weight"
                      type="text"
                      tooltip="This field displays the Maximum weight allowed for each Checked bag."
                      value={flightClass?.checkedWeight ?? ""}
                      disabled={true}
                    />
                  </div>

                  {/* ROW 3 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* checkedFee */}
                    <InputField
                      id="checkedFee"
                      label="Checked Bag Fee"
                      type="text"
                      tooltip="This field displays the fee for each checked bag."
                      value={flightClass?.checkedFee ?? ""}
                      disabled={true}
                    />

                    {/* additionalFee */}
                    <InputField
                      id="additionalFee"
                      label="Additional Bag Fee"
                      type="text"
                      tooltip="This field displays the fee for any additional bags beyond the allowed limit."
                      value={flightClass?.additionalFee ?? ""}
                      disabled={true}
                    />
                  </div>
                </Card>

                {/* Price */}
                <Card icon={<Coins color="#EE4544" />} title="Price">
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* adult */}
                    <InputField
                      id="adult"
                      label="Adult (JOD)"
                      type="text"
                      tooltip="This field displays the price for an adult ticket."
                      value={flightClass?.price.adult ?? ""}
                      disabled={true}
                    />
                    {/* child */}
                    <InputField
                      id="child"
                      label="Child (JOD)"
                      type="text"
                      tooltip="This field displays the price for a child ticket."
                      value={flightClass?.price.child ?? ""}
                      disabled={true}
                    />
                  </div>
                  {/* ROW 2 */}
                  <div className="md:flex space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {/* infant */}
                    <InputField
                      id="infant"
                      label="Infant (JOD)"
                      type="text"
                      tooltip="This field displays the price for an infant ticket."
                      value={flightClass?.price.infant ?? ""}
                      disabled={true}
                    />
                    {/* tax */}
                    <InputField
                      id="tax"
                      label="Tax % (JOD)"
                      type="text"
                      tooltip="This field displays the tax amount for the ticket in percentage."
                      value={flightClass?.price.tax ?? ""}
                      disabled={true}
                    />
                  </div>
                </Card>

                {/* extraOffers */}
                {flightClass.extraOffers.length > 0 && (
                  <Card icon={<Gift color="#EE4544" />} title="Extra Offers">
                    <div key={classIdx}>
                      {flightClass.extraOffers.map((offers, offerIdx) => (
                        <div
                          key={offerIdx}
                          className="md:flex space-y-4 md:space-y-0 md:space-x-4"
                        >
                          {/* Offer Name */}
                          <InputField
                            id={`name-${classIdx}-${offerIdx}`}
                            label={`Name ${offerIdx !== 0 ? offerIdx + 1 : ""}`}
                            type="text"
                            tooltip="This field displays the name of the extra offer."
                            value={offers.name}
                            disabled={true}
                          />

                          {/* Offer Availability */}
                          <InputField
                            id={`available-${classIdx}-${offerIdx}`}
                            label={`Available ${
                              offerIdx !== 0 ? offerIdx + 1 : ""
                            }`}
                            type="text"
                            tooltip="This field displays the availability of the extra offer."
                            value={offers.available ?? ""}
                            disabled={true}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          ))}
          <div className="text-right space-x-5 border-t-2 py-5 border-slate-500 dark:border-slate-400"></div>
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
        className="w-full border-0 text-opacity-70 dark:text-gray-200 bg-gray-50 dark:bg-gray-600 disabled:bg-gray-100 disabled:dark:bg-gray-800/50 rounded-lg py-2 px-3 shadow focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed"
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
              text-opacity-70 dark:text-gray-200 dark:placeholder:text-gray-200 placeholder:text-opacity-70 bg-gray-50 dark:bg-gray-600 rounded-lg py-2 px-3 shadow dark:shadow-inner focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 no-arrows disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-gray-800/50"
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
        />
        {icon && (
          <span className="absolute right-3 top-2.5 text-gray-400">{icon}</span>
        )}
      </div>
    )}
    <div className="text-[10px] mt-1 text-rose-500">{validationError}</div>
  </div>
);
