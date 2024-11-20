"use client";
import useMasterUserAuth from "@/components/hooks/useMasterUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import dynamic from "next/dynamic";
import React from "react";

const MasterUsersAccountPanel = dynamic(
  () => import("./MasterUsersAccountPanel"),
  {
    loading: () => <ProgressLoading />,
  }
);

export default function MasterUsersAccount({ userId }: { userId: string }) {
  const loading = useMasterUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <>
      <MasterUsersAccountPanel userId={userId} />
    </>
  );
}
