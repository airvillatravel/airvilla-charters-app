import { User } from "@prisma/client";
import { Response } from "express";
import checkUserAuth from "../authorization/checkUserAuth";
import { AuthRequest } from "../definitions";

// Function to check the status of a user
const checkUserStatus = (user: User) => {
  // Check if the user object is null or undefined
  if (!user) {
    return { success: false, message: "User not found", status: 404 };
  }

  // Check if the user is verified
  if (!user.verified) {
    return { success: false, message: "User not verified", status: 401 };
  }

  // Check if the user's account status is accepted
  if (user.accountStatus !== "accepted") {
    return { success: false, message: "User not approved", status: 403 };
  }

  // If all checks pass, return success
  return { success: true };
};

// Function to handle affiliate access based on user status
const getAffiliateAccess = async (req: AuthRequest, res: Response) => {
  try {
    // Check if the user is authenticated
    const user = await checkUserAuth(req, res);

    // Check the user's status
    let statusCheck;
    if (user) {
      statusCheck = checkUserStatus(user);
    }

    // If the status check fails, return the appropriate error response
    if (!statusCheck?.success) {
      return res.status(statusCheck?.status || 500).json({
        success: false,
        message: statusCheck?.message,
      });
    }

    return user;
  } catch (error) {
    // Log the error and return a 500 internal server error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAffiliateAccess;
