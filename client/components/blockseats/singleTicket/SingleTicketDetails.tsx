"use client";
import React, { useEffect, useState } from "react";
import TicketDetailsCard from "./TicketDetailsCard";
import InfoCard from "./InfoCard";
import TravelerDetailsForm from "./TravelerDetailsForm";
import FareSummary from "./FareSummary";
import CancelCard from "./CancelCard";
import { fetchTicketById } from "@/lib/data/ticketData";
import ListLoading from "@/components/flight-tickets/myTickets/ListLoading";
import { FlightTicketRes } from "@/utils/definitions/blockseatsDefinitions";
import { selectUser } from "@/redux/features/AuthSlice";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";

export default function SingleTicketDetails({
  departureId,
  returnId,
}: {
  departureId: string;
  returnId?: string;
}) {
  const [departureTicket, setDepartureTicket] = useState<FlightTicketRes>();
  const [returnTicket, setReturnTicket] = useState<FlightTicketRes>();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useAppSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const departureResponse = await fetchTicketById(departureId);
        if (!departureResponse) {
          throw new Error("Failed to fetch departure ticket data");
        }
        const departureData = await departureResponse.results;
        setDepartureTicket(departureData);

        if (returnId) {
          const returnResponse = await fetchTicketById(returnId);
          if (!returnResponse) {
            throw new Error("Failed to fetch return ticket data");
          }
          const returnData = await returnResponse.results;
          setReturnTicket(returnData);
        }
      } catch (error) {
        // Handle error state or display error message
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [departureId, returnId]);

  // ######## useEffect ###########
  useEffect(() => {
    // Redirect to login page if not logged in
    if (!user.isLogin) {
      router.push("/signin");
      return;
    } else if (!(user as StoredUser).verified) {
      router.push("/not-verified");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return <ListLoading />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-grow">
          {departureTicket && (
            <TicketDetailsCard ticket={departureTicket} itinerary="one way" />
          )}
          {departureTicket && departureTicket.description && (
            <InfoCard ticket={departureTicket} />
          )}

          {returnTicket && (
            <TicketDetailsCard ticket={returnTicket} itinerary="round trip" />
          )}
          {returnTicket && returnTicket.description && (
            <InfoCard ticket={returnTicket} />
          )}
          {departureTicket && <TravelerDetailsForm ticket={departureTicket} />}
          {/* Mobile screens */}
          <div className="xl:hidden mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {departureTicket && (
              <FareSummary
                departureTicket={departureTicket}
                returnTicket={returnTicket}
              />
            )}
            {departureTicket && <CancelCard ticket={departureTicket} />}
          </div>
        </div>
        {/* Right side for large screens */}
        <div className="hidden xl:block xl:sticky xl:top-4 self-start w-full md:w-1/4 mt-[140px]">
          {departureTicket && (
            <FareSummary
              departureTicket={departureTicket}
              returnTicket={returnTicket}
            />
          )}
          {departureTicket && <CancelCard ticket={departureTicket} />}
        </div>
      </div>
    </div>
  );
}
