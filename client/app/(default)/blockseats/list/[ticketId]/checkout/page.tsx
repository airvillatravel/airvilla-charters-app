import React from "react";
import PaymentDetails from "@/components/blockseats/singleTicket/payment/PaymentDetails";

export async function generateStaticParams() {
  return [{ ticketId: "123" }];
}

export default function PaymentBlockSeats({
  params,
}: {
  params: { ticketId: string };
}) {
  return (
    <div>
      <PaymentDetails />
    </div>
  );
}
