import TeamManagement from "@/components/master-control/team-management/TeamManagement";

export const metadata = {
  title: "Team Management",
  description: "Internal team management control",
};

export default async function TeamManagementPage() {
  return <TeamManagement />;
}
