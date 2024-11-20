import { Response } from "express";
import { AuthRequest } from "../utils/definitions";
import prisma from "../prisma";
import getAgencyAccess from "../utils/access-check/getAgencyAccess";
import { getCreatedTimeRange } from "../utils/functions";
import moment from "moment";
import { updateTicketValidation } from "../utils/validators/ticketValidation";
import { FlightTicket } from "@prisma/client";

// ticket selector
const ticketSelectors: any = {
  departure: true,
  arrival: true,
  owner: {
    select: {
      id: true,
      agencyName: true,
      logo: true,
    },
  },
  agencyAgent: true,
  bookedSeats: true,
  flightClasses: {
    include: {
      extraOffers: true,
      price: true,
    },
  },
  ticketHistoryLogs: {
    select: {
      // ticketId: true,
      oldValue: true,
      newValue: true,
      changeType: true,
      changeDetails: true,
      changedAt: true,
      agency: {
        select: {
          id: true,
          agencyName: true,
          firstName: true,
          lastName: true,
          logo: true,
        },
      },
      agencyAgent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      changedAt: "asc",
    },
  },
  segments: {
    include: {
      departure: true,
      arrival: true,
    },
    orderBy: {
      departureTime: "asc",
    },
  },
  purchasedSeats: true,
};

/**
 * Searches all flight tickets based on the provided search criteria
 * and returns the results in a paginated format.
 * @param req - The request object containing the search criteria
 * @param res - The response object
 * @returns A JSON response with the success status and
 * the retrieved flight tickets. The response object will have the following
 * structure:
 * {
 *   success: boolean,
 *   results: {
 *     tickets: FlightTicketRes[],
 *     totalTickets: number,
 *     nextCursor: string | null
 *   }
 * }
 * where `FlightTicketRes` is defined in `@/utils/definitions/ticketDefinitions.ts`.
 */
export const getAllUsersTickets = async (req: AuthRequest, res: Response) => {
  // Extract request body parameters
  const {
    airportCode,
    startDate,
    endDate,
    flightClassType,
    createdTimeFilter,
  } = req.body;

  // Extract query parameters
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;
  const { ticketStatus, updated } = req.query;

  try {
    // Authorize the user
    const user = await getAgencyAccess(req, res);

    // Validate ticketStatus query param
    const ticketStatusValues = [
      "all",
      "pending",
      "available",
      "unavailable",
      "rejected",
      "blocked",
      "expired",
      "hold",
    ];
    if (ticketStatus && !ticketStatusValues.includes(ticketStatus as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticketStatus query parameter",
      });
    }

    // Filter ticketStatus
    const ticketStatusFiltered = ticketStatus as "all" &
      "pending" &
      "available" &
      "unavailable" &
      "rejected" &
      "blocked" &
      "expired" &
      "hold";

    // Get created time range based on filter
    const createdTimeRange = createdTimeFilter
      ? getCreatedTimeRange(createdTimeFilter)
      : {};

    const [tickets, totalTickets] = await prisma.$transaction(
      async (transaction) => {
        // Define search options
        const searchOptions: any = [
          { updated: updated ? true : undefined },
          ticketStatusFiltered && ticketStatusFiltered !== "all"
            ? { ticketStatus: ticketStatusFiltered }
            : {},

          // Filter by departure city if provided
          airportCode
            ? {
                departure: {
                  airportCode: {
                    contains: airportCode,
                    mode: "insensitive",
                  },
                },
              }
            : {},

          // Filter by flight date range if provided
          startDate && endDate
            ? {
                flightDate: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : {},

          // Filter by flight class type if provided
          flightClassType
            ? {
                flightClasses: {
                  some: {
                    type: flightClassType,
                  },
                },
              }
            : {},

          // Apply created time range filter
          createdTimeRange
            ? {
                createdAt: createdTimeRange,
              }
            : { createdAt: {} }, // Assume an empty object as a placeholder if createdTimeRange is not provided
        ];

        // Find flight tickets based on search criteria
        const tickets = await transaction.flightTicket.findMany({
          where: {
            ownerId: (user as { id: string }).id,
            AND: searchOptions,
          },
          include: ticketSelectors,
          orderBy: {
            flightDate: "asc",
          },
          take: pageSize,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
        });

        // Count total flight tickets based on search criteria
        const totalTickets = await transaction.flightTicket.count({
          where: {
            ownerId: (user as { id: string }).id,
            AND: searchOptions,
          },
        });

        return [tickets, totalTickets];
      }
    );

    // Determine next cursor if available
    const nextCursor =
      tickets.length === pageSize ? tickets[tickets.length - 1].id : null;

    // Return search results
    return res
      .status(200)
      .json({ success: true, results: { tickets, totalTickets, nextCursor } });
  } catch (error) {
    // Handle search error
    const err = error as Error;
    console.error("Search User Tickets error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to search for flight tickets. Please try again later.",
    });
  }
};

/**
 * Retrieves a single flight ticket for a user by its refId.
 *
 * @param req - The request object containing the ticket refId.
 * @param res - The response object to send the result.
 * @returns The response with the retrieved ticket or an error message. The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: flightTicketRes,
 * }
 */
export const getSingleUsersTicket = async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;
  try {
    // Authorize the user and check their role
    const user = await getAgencyAccess(req, res);

    // Get single users ticket include all fields
    const ticket = await prisma.flightTicket.findFirst({
      where: { refId: ticketId, ownerId: (user as { id: string }).id },
      include: ticketSelectors,
    });

    // if ticket not found
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Return a single tickets
    return res.status(200).json({ success: true, results: ticket });
  } catch (error) {
    const err = error as Error;
    console.error("Fetch Single User Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flight ticket. Please try again later.",
    });
  }
};

/**
 * Delete a user's ticket by its reference ID.
 *
 * @param req - The authenticated request object.
 * @param res - The response object.
 * @returns The response with the deleted ticket or an error message.
 * @returns The response with the deleted ticket or an error message. The response object will have the following structure:
 * {
 *   success: boolean,
 *   message: string,
 *   results: FlightTicketRes,
 * }
 * where `FlightTicketRes` is defined in `@/utils/definitions/ticketDefinitions.ts`.
 */
export const deleteUsersTicket = async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;

  try {
    // Authorize the user
    const user = await getAgencyAccess(req, res);

    // Find the flight ticket along with its relations
    const flightTicket = await prisma.flightTicket.findUnique({
      where: {
        refId: ticketId,
        ownerId: (user as { id: string }).id,
      },
      include: ticketSelectors,
    });

    // If the ticket is not found
    if (!flightTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const validTicketStatus = ["pending", "rejected", "blocked"];

    if (!validTicketStatus.includes(flightTicket.ticketStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete valid ticket" });
    }

    // Delete the ticket and its related locations
    const deleteTicket = await prisma.$transaction(async (transaction) => {
      await transaction.flightTicket.delete({
        where: { id: flightTicket.id },
      });

      // Delete departure and arrival locations
      for (const segment of flightTicket.segments as any) {
        await transaction.flightLocation.delete({
          where: { id: segment.departureId },
        });

        await transaction.flightLocation.delete({
          where: { id: segment.arrivalId },
        });
      }

      return flightTicket;
    });

    // Return the deleted ticket
    return res.status(200).json({
      success: true,
      message: "The ticket was deleted successfully",
      results: deleteTicket,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Delete Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to delete flight ticket. Please try again later.",
    });
  }
};

/**
 * Updates a single flight ticket's status. The user making the request must be
 * the owner of the ticket.
 *
 * @param {AuthRequest} req - The request object from Express
 * @param {Response} res - The response object from Express
 * @returns {Promise<Response>} A JSON response with the success status and the
 * updated ticket. The response object will have the following structure:
 * {
 *   success: boolean,
 *   message: string,
 *   results: FlightTicketRes,
 * }
 * where `FlightTicketRes` is defined in `@/utils/definitions/ticketDefinitions.ts`.
 */
export const updateTicketStatus = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { refId } = req.params;
  const { status } = req.body;
  try {
    // authorize the user
    const user = await getAgencyAccess(req, res);

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const ticketStatusOptions = ["available", "unavailable"];
    if (!ticketStatusOptions.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    // Find the flight ticket along with its relations
    const flightTicket = await prisma.flightTicket.findUnique({
      where: {
        refId: refId,
        ownerId: (user as { id: string }).id,
      },
      include: ticketSelectors,
    });

    // if ticket not found
    if (!flightTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const date = new Date();
    const currentDate = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS");

    // Check if the flight date has passed
    if (
      flightTicket.departureTime &&
      flightTicket.departureTime < currentDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Flight date has passed" });
    }

    // Check if the ticket's previous status was "pending"
    const wasPending = flightTicket.ticketStatus === "pending";

    // Determine the new ticket status
    const getTicketStatus = (): string => {
      if (status === "available" && wasPending) {
        return "accepted";
      }
      return status;
    };

    const updateTicket = await prisma.$transaction(async (transaction) => {
      // update the ticket
      await transaction.flightTicket.update({
        where: { id: flightTicket.id },
        data: {
          ticketStatus: status,
          // Add a new ticket history log depending on the ticket's new status
          ticketHistoryLogs: {
            create: {
              changeType: getTicketStatus(),
            },
          },
        },
      });
      return flightTicket;
    });

    // return a single tickets
    return res.status(200).json({
      success: true,
      message: "The ticket was updated successfully",
      results: updateTicket,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update flight ticket. Please try again later.",
    });
  }
};

/**
 * Updates a single flight ticket with the given input.
 * The user making the request must be the owner of the ticket.
 * The input must contain the refId, the new data for the ticket,
 * and the new segments data.
 * This function will first validate the input, then authorize the user,
 * and finally update the ticket and its segments.
 * @param {AuthRequest} req - The request object containing the refId and the new data.
 * @param {Response} res - The response object to send the result.
 * @returns The response with the updated ticket or an error message.
 * The response object will have the following structure:
 * {
 *   success: boolean,
 *   message: string,
 *   results: FlightTicketRes,
 * }
 * where `FlightTicketRes` is the shape of a flight ticket object returned by Prisma.
 */
export const updateValidTicket = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { refId } = req.params;
  const { updatedTicketReq } = req.body;
  try {
    // authorize the user
    const user = await getAgencyAccess(req, res);

    // Find the flight ticket along with its relations
    const flightTicket = await prisma.flightTicket.findUnique({
      where: {
        refId: refId,
        ownerId: (user as { id: string }).id,
      },
      include: ticketSelectors,
    });

    // if ticket not found
    if (!flightTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const date = new Date();
    const currentDate = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS");

    // Check if the flight date has passed
    if (
      flightTicket.departureTime &&
      flightTicket.departureTime < currentDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Flight date has passed" });
    }

    // check if the ticket is valid
    const ticketStatusOptions = ["available", "unavailable"];
    if (!ticketStatusOptions.includes(flightTicket.ticketStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Ticket" });
    }

    // Validate the inputs
    const { error } = updateTicketValidation.validate(updatedTicketReq, {
      abortEarly: false,
    });

    // Return a list of errors
    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        acc[detail.path.join(".")] = detail.message;
        return acc;
      }, {} as Record<string, string>);

      return res
        .status(400)
        .json({ success: false, validationErrors: errorDetails });
    }

    const updatedTicket = await prisma.$transaction(async (transaction) => {
      // update the ticket
      await transaction.flightTicket.update({
        where: { id: flightTicket.id },
        data: {
          updated: true,
        },
      });

      // Log detailed changes to the ticket
      await transaction.ticketHistoryLog.create({
        data: {
          ticketId: flightTicket.id,
          changeType: "update request",
          changeDetails: JSON.stringify(
            getDifferences(
              { ...flightTicket, ticketHistoryLogs: null },
              { ...updatedTicketReq, ticketHistoryLogs: null }
            )
          ),
          oldValue: JSON.stringify(flightTicket),
          newValue: JSON.stringify(updatedTicketReq),
          agencyId: (user as { id: string }).id,
        },
      });
    });

    // return a single tickets
    return res.status(200).json({
      success: true,
      message: "The ticket was updated successfully",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update flight ticket. Please try again later.",
    });
  }
};

export const withdrawUpdateReqValidTicket = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const { refId } = req.params;
  try {
    // authorize the user
    const user = await getAgencyAccess(req, res);

    // Find the flight ticket along with its relations
    const flightTicket = await prisma.flightTicket.findUnique({
      where: {
        refId: refId,
        ownerId: (user as { id: string }).id,
      },
      include: ticketSelectors,
    });

    // if ticket not found
    if (!flightTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const date = new Date();
    const currentDate = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS");

    // Check if the flight date has passed
    if (
      flightTicket.departureTime &&
      flightTicket.departureTime < currentDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Flight date has passed" });
    }

    // check if the ticket is valid
    const ticketStatusOptions = ["available", "unavailable"];
    if (!ticketStatusOptions.includes(flightTicket.ticketStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Ticket" });
    }

    const updatedTicket = await prisma.$transaction(async (transaction) => {
      // update the ticket
      await transaction.flightTicket.update({
        where: { id: flightTicket.id },
        data: {
          updated: false,
        },
      });

      // Log detailed changes to the ticket
      await transaction.ticketHistoryLog.create({
        data: {
          ticketId: flightTicket.id,
          changeType: "withdraw request",
          changeDetails: JSON.stringify({ comment: "Withdraw update request" }),
          agencyId: (user as { id: string }).id,
        },
      });
    });

    // return a single tickets
    return res.status(200).json({
      success: true,
      message: "The ticket was withdrawn successfully",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to update flight ticket. Please try again later.",
    });
  }
};

/**
 * Deeply compares two objects and returns an object showing the differences.
 * @param {Object} oldObj - The original object.
 * @param {Object} newObj - The updated object.
 * @returns {Object} - An object showing the differences.
 */
function getDifferences(oldObj: any, newObj: any): any {
  const changes: any = {};

  function compareObjects(oldVal: any, newVal: any, path: string[] = []) {
    if (
      typeof oldVal !== "object" ||
      oldVal === null ||
      typeof newVal !== "object" ||
      newVal === null
    ) {
      if (oldVal !== newVal) {
        changes[path.join(".")] = { oldValue: oldVal, newValue: newVal };
      }
      return;
    }

    // Compare arrays
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      if (oldVal.length !== newVal.length) {
        changes[path.join(".")] = { oldValue: oldVal, newValue: newVal };
      } else {
        for (let i = 0; i < oldVal.length; i++) {
          compareObjects(oldVal[i], newVal[i], [...path, `[${i}]`]);
        }
      }
      return;
    }

    // Compare objects
    for (const key of new Set([
      ...Object.keys(oldVal),
      ...Object.keys(newVal),
    ])) {
      compareObjects(oldVal[key], newVal[key], [...path, key]);
    }
  }

  compareObjects(oldObj, newObj);
  return changes;
}
