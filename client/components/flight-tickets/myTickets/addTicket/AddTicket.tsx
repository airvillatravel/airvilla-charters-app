"use client";
import useAgencyUserAuth from "@/components/hooks/useAgencyUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const AddTicketForm = dynamic(() => import("./AddTicketForm"), {
  loading: () => <ProgressLoading />,
});
export default function AddTicket() {
  const loading = useAgencyUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <Suspense fallback={<ProgressLoading />}>
      <AddTicketForm />
    </Suspense>
  );
}
