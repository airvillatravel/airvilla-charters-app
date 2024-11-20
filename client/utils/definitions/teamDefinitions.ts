export type Role = "master" | "moderator" | "accountant";

export type Department =
  | "Customer Support"
  | "Management"
  | "Finance"
  | "Human Resources"
  | "Marketing"
  | "Sales"
  | "IT"
  | "Operations"
  | "Research & Development";

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: Department;
  status: "pending" | "active";
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: Role;
  department: Department;
  expiresAt: Date;
  status: "pending" | "accepted" | "expired";
}
