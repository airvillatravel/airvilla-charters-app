import { Response } from "express";
import { AuthRequest } from "../definitions";
import prisma from "../../prisma";
import { User, TeamMember } from "@prisma/client";

/////////////
// this function checks and authorizes if the account exists
////////////

// Function overloads to provide type safety
async function checkUserAuth(
  req: AuthRequest,
  res: Response,
  type: "user"
): Promise<User | null>;
async function checkUserAuth(
  req: AuthRequest,
  res: Response,
  type: "teamMember"
): Promise<TeamMember | null>;
async function checkUserAuth(
  req: AuthRequest,
  res: Response
): Promise<User | null>;

// Implementation
async function checkUserAuth(
  req: AuthRequest,
  res: Response,
  type?: "user" | "teamMember"
): Promise<User | TeamMember | null> {
  if (!req.userId || !req.accountType) {
    res.status(401).json({ message: "Please login" });
    return null;
  }

  // If type is specified, ensure it matches the account type
  if (type && type !== req.accountType) {
    res.status(401).json({ message: "Unauthorized access" });
    return null;
  }

  const account =
    req.accountType === "teamMember"
      ? await prisma.teamMember.findUnique({ where: { id: req.userId } })
      : await prisma.user.findUnique({ where: { id: req.userId } });

  if (!account) {
    res.status(401).json({ message: "Account not found" });
    return null;
  }

  return account;
}

export default checkUserAuth;
