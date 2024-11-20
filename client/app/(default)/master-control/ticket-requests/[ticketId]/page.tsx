import SingleTicketRequestBody from "@/components/master-control/ticket-requests/ticket-requests-single-page/SingleTicketRequestBody";
import React from "react";

export async function generateStaticParams() {
  // return posts.map((post) => ({
  //   slug: post.slug,
  // }));

  return [{ ticketId: "123" }];
}

export default function TicketRequestsSinglePage({
  params,
}: {
  params: { ticketId: string };
}) {
  const { ticketId } = params;

  return (
    <div className="lg:relative lg:flex">
      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:grow lg:pr-8 xl:pr-16 2xl:ml-[80px]">
        <div className="lg:max-w-[900px] lg:mx-auto">
          <SingleTicketRequestBody ticketId={ticketId} />
        </div>
      </div>
    </div>
  );
}
