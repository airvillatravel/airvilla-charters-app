import { Response } from "express";
import { AuthRequest } from "../utils/definitions";
import prisma from "../prisma";
import { searchMasterTicketInputValidation } from "../utils/validators/masterValidation";
import getMasterAccess from "../utils/access-check/getMasterAccess";
import { getCreatedTimeRange } from "../utils/functions";
import moment from "moment";
import { stringify } from "querystring";
import { FlightTicket } from "@prisma/client";

// Selectors for flight ticket data
const ticketSelectors: any = {
  departure: true,
  arrival: true,
  owner: {
    select: {
      id: true,
      agencyName: true,
      firstName: true,
      lastName: true,
      logo: true,
    },
  },
  ticketHistoryLogs: {
    select: {
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
  agencyAgent: { select: { firstName: true, lastName: true } },
  flightClasses: {
    include: {
      extraOffers: true,
      price: true,
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
 * Get all flight tickets for a master user.
 *
 * @param {AuthRequest} req - The request object containing the user's authorization token.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved flight tickets. The response object will have the following
 * structure:
 * {
 *   success: boolean,
 *   results: {
 *     tickets: FlightTicket[],
 *     totalTickets: number,
 *     nextCursor: string | null,
 *   }
 * }
 * where `FlightTicket` is the shape of a flight ticket object returned by Prisma.
 */
export const getAllMasterTickets = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  // Get pagination parameters
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;

  // Get ticket filter parameters from request body
  const {
    agencyName,
    airportCode,
    startDate,
    endDate,
    flightClassType,
    createdTimeFilter,
  } = req.body as {
    updated: boolean;
    ticketStatus: string;
    agencyName: string;
    airportCode: string;
    startDate: string;
    endDate: string;
    flightClassType: string;
    createdTimeFilter: string;
  };

  const { ticketStatus, updated } = req.query;

  try {
    // Authorize the user and check their role
    const user = await getMasterAccess(req, res);

    // Validate the ticketStatus query parameter
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

    // Apply filters to the query
    // Convert ticketStatus to the appropriate type
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

    // Create an array of filter options based on the provided parameters
    const filterOptions: any = [
      { updated: updated ? true : undefined },
      ticketStatusFiltered && ticketStatusFiltered !== "all"
        ? { ticketStatus: ticketStatusFiltered }
        : {},
      agencyName && agencyName !== "all"
        ? {
            owner: {
              agencyName: agencyName,
            },
          }
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
        : { createdAt: {} },
    ];

    // Get the flight tickets and total count based on filters
    const [tickets, totalTickets] = await Promise.all([
      prisma.flightTicket.findMany({
        where: {
          AND: filterOptions,
        },
        include: ticketSelectors,
        orderBy: {
          flightDate: "asc",
        },
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      }),
      prisma.flightTicket.count({
        where: {
          AND: filterOptions,
        },
      }),
    ]);

    // Calculate the next cursor
    const nextCursor =
      tickets.length === pageSize ? tickets[tickets.length - 1].id : null;

    // Return the flight tickets and total count
    return res
      .status(200)
      .json({ success: true, results: { tickets, totalTickets, nextCursor } });
  } catch (error) {
    // Log the error and return a 500 error response
    const err = error as Error;
    console.error("Fetch All Master User Tickets error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flight tickets. Please try again later.",
    });
  }
};

/**
 * Retrieves a single master flight ticket by its refId.
 *
 * @param req - The request object containing the ticket refId.
 * @param res - The response object to send the result.
 * @returns The response with the retrieved ticket or an error message. The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: flightTicketRes,
 * }
 */
export const getSingleMasterTicket = async (
  req: AuthRequest,
  res: Response
) => {
  const { refId } = req.params;

  try {
    // Authorize the user and check their role
    const user = await getMasterAccess(req, res);

    // Query the database for the ticket with all related data
    const ticket = await prisma.flightTicket.findFirst({
      where: {
        refId: refId,
        // OR: [{ ticketStatus: "pending" }, { ticketStatus: "updated" }],
      },
      include: ticketSelectors,
    });

    // Handle case where ticket is not found
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Successfully return the found ticket
    return res.status(200).json({ success: true, results: ticket });
  } catch (error) {
    // Log the error and return a 500 error response
    const err = error as Error;
    console.error("Fetch Single Master User Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch master single flight ticket. Please try again later.",
    });
  }
};

/**
 * Updates a single master flight ticket's status.
 *
 * @param {AuthRequest} req - The request object containing the user's authorization token and the ticket's refId and new status.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and the
 * updated ticket. The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: FlightTicket,
 *   message: string,
 * }
 * where `FlightTicket` is the shape of a flight ticket object returned by Prisma.
 */
export const updateTicketStatus = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  // Extract the ticket's refId and new status from the request
  const { refId } = req.params;
  const { ticketStatus, comment } = req.body;

  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Validate the ticketStatus query param
    const ticketStatusValues = [
      "pending",
      "available",
      "unavailable",
      "rejected",
      "updated",
      "blocked",
      "hold",
    ];

    // If the ticketStatus is invalid, return a 400 error
    if (!ticketStatus || !ticketStatusValues.includes(ticketStatus as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ticket Status",
      });
    }

    // Find the flight ticket along with its relations
    const flightTicket = await prisma.flightTicket.findUnique({
      where: {
        refId: refId,
      },
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
    if (flightTicket.flightDate < currentDate) {
      return res
        .status(400)
        .json({ success: false, message: "Flight date has passed" });
    }

    // Check if the ticket's previous status was "pending"
    const wasPending = flightTicket.ticketStatus === "pending";

    // Determine the status to be shown in the response
    const getResponseStatus = (): string => {
      if (ticketStatus === "available" && wasPending) {
        return "accepted";
      }
      return ticketStatus;
    };

    // Update the ticket's status
    const updatedTicket = await prisma.flightTicket.update({
      where: {
        refId: refId,
      },
      data: {
        ticketStatus: ticketStatus,
        // Add a new ticket history log depending on the ticket's new status
        ticketHistoryLogs: {
          create: {
            changeType: getResponseStatus(),
            changeDetails: JSON.stringify({ comment: comment }),
          },
        },
      },
      include: ticketSelectors,
    });

    // Return the updated ticket
    return res.status(200).json({
      success: true,
      results: updatedTicket,
      message: "Ticket updated successfully",
    });
  } catch (error) {
    // Log the error and return a 500 error response
    const err = error as Error;
    console.error("Update Single Master User Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message:
        "Failed to update master single flight ticket. Please try again later.",
    });
  }
};
/**
 * Updates a single master flight ticket with the given input.
 *
 * req.body = {
 *   refId: string,
 *   updateRespond: boolean,
 *   comment: string
 * }
 * @param {AuthRequest} req - The request object containing the user's authorization token and the ticket's refId and new status.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved flight tickets. The response object will have the following
 * structure:
 * {
 *   success: boolean,
 *   results: FlightTicketRes,
 *   message: string,
 * }
 * where `FlightTicketRes` is the shape of a flight ticket object returned by Prisma.
 */
export const updateValidTicket = async (req: AuthRequest, res: Response) => {
  // Extract the ticket's refId and new status from the request
  const { refId } = req.params;
  const { updateRespond, comment } = req.body;

  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Find the flight ticket along with its relations
    const flightTicket = await prisma.flightTicket.findUnique({
      where: {
        refId: refId,
      },
      include: ticketSelectors,
    });

    // if ticket not found
    if (!flightTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Validate the ticketStatus query param
    const ticketStatusValues = ["available", "unavailable"];

    // If the ticketStatus is invalid, return a 400 error
    if (!ticketStatusValues.includes(flightTicket.ticketStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ticket Status",
      });
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

    // Check if the ticket has been updated
    if (flightTicket.updated === false) {
      return res.status(400).json({
        success: false,
        message: "Ticket cannot be updated",
      });
    }

    // Check if the respond is valid
    if (updateRespond !== "accepted" && updateRespond !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Invalid update respond",
      });
    }

    // ###### REJECTED ##########
    // If the user wants to reject the ticket
    if (updateRespond === "rejected") {
      const updatedTicket = await prisma.$transaction(async (transaction) => {
        // Update the ticket details
        const flightTicket = await transaction.flightTicket.update({
          where: { refId: refId },
          data: {
            updated: false,
          },
        });

        // Log detailed changes to the ticket
        await transaction.ticketHistoryLog.create({
          data: {
            ticketId: flightTicket.id,
            changeType: "rejected",
            changeDetails: JSON.stringify({ comment: comment }),
            agencyId: (user as { id: string }).id,
          },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Ticket rejected successfully",
      });
    }

    // ########## ACCEPTED ##########
    // Get the last ticket history log
    if (updateRespond === "accepted") {
      const lastLog =
        flightTicket.ticketHistoryLogs[
          flightTicket.ticketHistoryLogs.length - 1
        ];

      // Parse the last ticket history log's new value
      let newValue = {};
      if (lastLog && "newValue" in lastLog && lastLog.newValue !== null) {
        newValue = JSON.parse((lastLog as any).newValue);
      }

      // If the last ticket history log is not found, return a 400 error
      if (!newValue) {
        return res
          .status(400)
          .json({ success: false, message: "New changes not found" });
      }

      const ticketChanges: FlightTicket | any = newValue;

      const updatedTicket = await prisma.$transaction(async (transaction) => {
        // Update the ticket details
        const flightTicket = await transaction.flightTicket.update({
          where: { refId: refId },
          data: {
            seats: parseInt(ticketChanges.seats) ?? undefined,
            updated: false,
          },
        });

        // delete all flight classes
        await transaction.flightClass.deleteMany({
          where: { flightTicketId: flightTicket.id },
        });

        // Update flight classes
        for (const flightClass of ticketChanges.flightClasses) {
          // Create new flight class
          await transaction.flightClass.create({
            data: {
              flightTicket: { connect: { id: flightTicket.id } },
              type: flightClass.type.trim().toLowerCase(),
              carryOnAllowed: parseInt(flightClass.carryOnAllowed),
              carryOnWeight: parseFloat(flightClass.carryOnWeight),
              checkedAllowed: parseInt(flightClass.checkedAllowed),
              checkedWeight: parseFloat(flightClass.checkedWeight),
              checkedFee: parseFloat(flightClass.checkedFee),
              additionalFee: parseFloat(flightClass.additionalFee),
              price: {
                create: {
                  adult: parseFloat(flightClass.price.adult),
                  child: parseFloat(flightClass.price.child),
                  infant: parseFloat(flightClass.price.infant),
                  tax: parseFloat(flightClass.price.tax),
                },
              },
              extraOffers: {
                create: flightClass.extraOffers.map(
                  (offer: { name: string; available: string }) => ({
                    name: offer.name.trim().toLowerCase(),
                    available: offer.available.trim().toLowerCase(),
                  })
                ),
              },
            },
          });
        }

        // Log detailed changes to the ticket
        await transaction.ticketHistoryLog.create({
          data: {
            ticketId: flightTicket.id,
            changeType: "accepted",
            changeDetails: JSON.stringify({ comment: "Accept changes" }),
            agencyId: (user as { id: string }).id,
          },
        });
      });

      // Return the updated ticket
      return res.status(200).json({
        success: true,
        message: "Ticket updated successfully",
      });
    }
  } catch (error) {
    // Log the error and return a 500 error response
    const err = error as Error;
    console.error("Update Single Master User Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message:
        "Failed to update master single flight ticket. Please try again later.",
    });
  }
};

/**
 * Deletes a single master flight ticket.
 *
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response with the deleted ticket or an error message.
 */
export const deleteSingleMasterTicket = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  // Parse the refId from the request parameters
  const { refId } = req.params;

  try {
    // Authorize the user
    const user = await getMasterAccess(req, res);

    // Delete the ticket
    const deletedTicket = await prisma.flightTicket.delete({
      where: {
        refId: refId,
      },
      include: ticketSelectors,
    });

    // If the ticket is not found, return a 404 error
    if (!deletedTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Return the deleted ticket
    return res.status(200).json({
      success: true,
      results: deletedTicket,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    // Log the error and return a 500 error response
    const err = error as Error;
    console.error("Delete Single Master User Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message:
        "Failed to delete master single flight ticket. Please try again later.",
    });
  }
};
