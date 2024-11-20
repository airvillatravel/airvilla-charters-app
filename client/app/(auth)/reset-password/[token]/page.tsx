import ResetPasswordFormToken from "@/components/auth/reset-password/ResetPasswordFormToken";
import React from "react";

export async function generateStaticParams() {
  // return posts.map((post) => ({
  //   slug: post.slug,
  // }));

  return [{ token: "123" }];
}

export default function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  return <ResetPasswordFormToken token={token} />;
}
