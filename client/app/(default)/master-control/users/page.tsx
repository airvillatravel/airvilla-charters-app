import MasterUsers from "@/components/master-control/users/MasterUsers";

export const metadata = {
  title: "Users",
  description: "Master users control",
};

export default async function MasterUsersPage() {
  return <MasterUsers />;
}
