import SingleTicket from "@/components/flight-tickets/myTickets/ticketId/SingleTicket";
import React from "react";

export async function generateStaticParams() {
  return [{ ticketId: "123" }];
}

const SingleTicketPage = ({ params }: { params: { ticketId: string } }) => {
  const { ticketId } = params;
  return (
    <div className="lg:relative lg:flex">
      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:grow lg:pr-8 xl:pr-16 2xl:ml-[80px]">
        <div className="lg:max-w-[900px] lg:mx-auto">
          {/* Form */}
          <SingleTicket ticketId={ticketId} />
        </div>
      </div>
    </div>
  );
};

export default SingleTicketPage;
