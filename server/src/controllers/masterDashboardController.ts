import { Response } from "express";
import prisma from "../prisma";
import getMasterAccess from "../utils/access-check/getMasterAccess";
import { AuthRequest } from "../utils/definitions";

/**
 * Get agency names from the database.
 *
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved agency names. The response object will have the following
 * structure:
 * {
 *   success: boolean,
 *   results: string[],
 * }
 */
export const getAgencyNames = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Get all agency names
    const agencyNames = await prisma.user.findMany({
      select: {
        agencyName: true, // Select only the agencyName field
      },
      where: {
        accountStatus: "accepted",
        agencyName: {
          not: null, // Exclude null values
          mode: "insensitive", // Perform case-insensitive search
        },
      },
    });

    // Get an array of agency names without duplicates
    const uniqueAgencyNames = agencyNames
      .map((agency) => agency.agencyName) // Map to an array of agency names
      .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

    // Return all agency names
    return res.status(200).json({
      success: true,
      results: uniqueAgencyNames,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Fetch agency names error:", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch agency names. Please try again later.",
    });
  }
};

/**
 * Retrieves the total number of flight tickets based on the provided ticket status query parameter.
 *
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 *   It should have the following query parameters:
 *     - `ticketStatus`: Optional. The status of the flight tickets to count.
 *       Valid values are:
 *         - "all"
 *         - "available"
 *         - "pending"
 *         - "unavailable"
 *         - "booked"
 *         - "rejected"
 *         - "updated"
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and the total number of flight tickets.
 * If the ticket status query parameter is invalid, a 400 error is returned.
 * If there is an error in fetching the total tickets, a 500 error is returned.
 */
export const getTotalTickets = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  // Extract the ticket status query parameter from the request
  const { ticketStatus } = req.query;

  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Define the valid ticket status values
    const ticketStatusValues = [
      "all",
      "available",
      "pending",
      "unavailable",
      "booked",
      "rejected",
      "updated",
    ];

    // Check if the ticket status query parameter is valid
    if (ticketStatus && !ticketStatusValues.includes(ticketStatus as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticketStatus query parameter",
      });
    }

    // Convert the ticket status query parameter to the appropriate type
    const ticketStatusFilter = ticketStatus as "all" &
      "available" &
      "pending" &
      "unavailable" &
      "booked" &
      "rejected" &
      "updated";

    // Retrieve the total number of flight tickets based on the ticket status filter
    const totalTickets = await prisma.flightTicket.count({
      where: {
        ticketStatus:
          ticketStatusFilter && ticketStatusFilter !== "all"
            ? ticketStatusFilter
            : undefined,
      },
    });

    // Return the total number of flight tickets
    return res.status(200).json({ success: true, results: totalTickets });
  } catch (error) {
    const err = error as Error;
    console.error("Fetch total tickets error:", {
      message: err.message,
      stack: err.stack,
    });
    // Return a 500 error if there is an error in fetching the total tickets
    return res.status(500).json({
      success: false,
      message: "Failed to fetch total tickets. Please try again later.",
    });
  }
};

/**
 * Retrieves the total number of users based on the provided role and status query parameters.
 *
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 *   It should have the following query parameters:
 *     - `role`: Optional. The role of the users to count.
 *       Valid values are: "all", "master", "agency", "affiliate".
 *     - `status`: Optional. The status of the users to count.
 *       Valid values are: "all", "accepted", "pending", "rejected".
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and the total number of users.
 * If the role or status query parameter is invalid, a 400 error is returned.
 * If there is an error in fetching the total users, a 500 error is returned.
 */
export const getTotalUsers = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  // Extract the role and status query parameters from the request
  const { role, status } = req.query;

  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Validate the role query parameter
    if (
      role &&
      !["all", "master", "agency", "affiliate"].includes(role as string)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role query parameter",
      });
    }

    // Validate the status query parameter
    if (
      status &&
      !["all", "accepted", "pending", "rejected"].includes(status as string)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status query parameter",
      });
    }

    // Convert the role and status query parameters to the appropriate types
    const roleType = role as "all" | "master" | "agency" | "affiliate";
    const statusType = status as "all" | "accepted" | "pending" | "rejected";

    // Retrieve the total number of users based on the role and status filters
    const totalUsers = await prisma.user.count({
      where: {
        verified: true,
        role: roleType && roleType !== "all" ? roleType : undefined,
        accountStatus:
          statusType && statusType !== "all" ? statusType : undefined,
      },
    });

    // Return the total number of users
    return res.status(200).json({ success: true, results: totalUsers });
  } catch (error) {
    const err = error as Error;
    console.error("Fetch total users error:", {
      message: err.message,
      stack: err.stack,
    });
    // Return a 500 error if there is an error in fetching the total users
    return res.status(500).json({
      success: false,
      message: "Failed to fetch total users. Please try again later.",
    });
  }
};
