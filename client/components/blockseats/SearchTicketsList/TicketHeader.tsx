import { useSearchTickets } from "@/components/hooks/useSearchTicket";
import moment from "moment";

export const TicketHeader = ({
  from,
  to,
  type,
}: {
  from: string;
  to: string;
  type?: "departure" | "return";
}) => {
  const {
    state: { flightDate, returnDate },
  } = useSearchTickets();

  return (
    <>
      {type === "return" ? (
        <div className="flex-grow border-t border-gray-500 mt-8"></div>
      ) : (
        ""
      )}
      <section
        className={`w-full transition-colors duration-300 flex flex-wrap items-center ${
          type === "return" ? "mt-4" : ""
        }`}
      >
        <div className="md:text-xl font-bold text-blue-500 w-full">
          <span className="text-base md:text-3xl font-bold flex flex-wrap items-center space-x-2 mx-auto w-full">
            <span>
              {type === "departure" ? "Outbound Flights:" : "Return Flights:"}
            </span>
            <span>{from}</span>
            <span>to</span>
            <span>{to}</span>
          </span>
        </div>
        <div className="text-base md:text-xl font-bold text-gray-900 dark:text-gray-500 flex flex-wrap items-center mt-4 w-full mx-auto">
          {moment(type === "departure" ? flightDate : returnDate).format(
            "MMMM DD, YYYY"
          )}
        </div>
      </section>
    </>
  );
};
