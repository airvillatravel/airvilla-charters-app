import Verification from "@/components/progress-pages/Verification";

export async function generateStaticParams() {
  // return posts.map((post) => ({
  //   slug: post.slug,
  // }));

  return [{ userToken: "123" }];
}

export default function EmailVerification({
  params,
}: {
  params: { userToken: string };
}) {
  const { userToken } = params;

  return <Verification userToken={userToken} />;
}
