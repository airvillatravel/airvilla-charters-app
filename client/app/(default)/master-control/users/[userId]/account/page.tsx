import MasterUsersAccount from "@/components/master-control/users/singleUser/account/MasterUsersAccount";
import React from "react";

export async function generateStaticParams() {
  return [{ userId: "123" }];
}

export default function MasterUserAccountPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  return <MasterUsersAccount userId={userId} />;
}
