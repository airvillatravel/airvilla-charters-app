import React from "react";
import SingleTicketDetails from "@/components/blockseats/singleTicket/SingleTicketDetails";

export async function generateStaticParams() {
  // return posts.map((post) => ({
  //   slug: post.slug,
  // }));

  return [{ ticketId: "123" }];
}
const SingleBlockSeats = ({ params }: { params: { ticketId: string } }) => {
  // return <SingleTicketDetails departureId={params.ticketId} />;
  const [departureId, returnId] = params.ticketId.split("_");
  return <SingleTicketDetails departureId={departureId} returnId={returnId} />;
};

export default SingleBlockSeats;
