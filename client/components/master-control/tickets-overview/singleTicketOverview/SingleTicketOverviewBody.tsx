"use client";
import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const SingleTicketOverviewForm = dynamic(() => import("./SingleTicketForm"), {
  loading: () => <ProgressLoading />,
});

export default function SingleTicketOverviewBody({
  ticketId,
}: {
  ticketId: string;
}) {
  const loading = useAgencyUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <div className="mb-6 lg:mb-0 w-full max-w-7xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-5 md:p-8">
      <Suspense fallback={<ProgressLoading />}>
        <SingleTicketOverviewForm ticketId={ticketId} />
      </Suspense>
    </div>
  );
}
