import VerifyAccountToken from "@/components/account-hub/VerifyAccountToken";
import React from "react";

export async function generateStaticParams() {
  return [{ token: "123" }];
}

export default function VerifyAccountTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  return <VerifyAccountToken token={token} />;
}
