import { Request } from "express";
import { User, TeamMember } from "@prisma/client";

// Define a new interface that extends Request to include both userId and user
export interface AuthRequest extends Request {
  userId?: string;
  user?: User | TeamMember;
  accountType?: "user" | "teamMember";
}
