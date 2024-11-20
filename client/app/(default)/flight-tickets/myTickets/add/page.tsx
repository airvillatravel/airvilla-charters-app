export const metadata = {
  title: "Add Ticket",
  description: "Add Ticket form",
};

import AddTicketForm from "@/components/flight-tickets/myTickets/addTicket/AddTicketForm";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { Suspense } from "react";

export default function AddTicketPage() {
  return (
    <div className="lg:relative lg:flex">
      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:grow lg:pr-8 xl:pr-16 2xl:ml-[80px]">
        <div className="lg:max-w-[900px] lg:mx-auto">
          <Suspense fallback={<ProgressLoading />}>
            <AddTicketForm />
          </Suspense>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
