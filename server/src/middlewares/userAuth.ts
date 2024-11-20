import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../utils/definitions";
import prisma from "../prisma";

const userAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // decode the access token
    const secretKey = process.env.SECRET_KEY;
    // let decoded;
    // if (secretKey) {
    //   decoded = jwt.verify(token, secretKey);
    // }
    if (!secretKey) {
      throw new Error("Secret key not configured");
    }

    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      type: "user" | "teamMember";
    };

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // if (typeof decoded === "object" && decoded.id) {
    //   // Fetch the complete user object
    //   const user = await prisma.user.findUnique({
    //     where: { id: decoded.id },
    //   });

    //   const teamMember = await prisma.teamMember.findUnique({
    //     where: { id: decoded.id },
    //   });

    //   const account = user || teamMember;
    //   if (!account) {
    //     return res.status(401).json({ message: "User not found" });
    //   }

    //   // Attach both userId and user object to request
    //   req.userId = decoded.id;
    //   // Only assign the user if it exists
    //   if (user) {
    //     req.user = user;
    //   }
    // }
    // Set the user ID and account type in the request
    req.userId = decoded.id;
    req.accountType = decoded.type;

    // Verify the account exists
    const account =
      decoded.type === "teamMember"
        ? await prisma.teamMember.findUnique({ where: { id: decoded.id } })
        : await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!account) {
      return res.status(401).json({ message: "Account not found" });
    }

    if (decoded.type === "user") {
      req.user = account;
    }

    return next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default userAuth;
