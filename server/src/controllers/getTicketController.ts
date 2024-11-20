import { Request, Response } from "express";
import { AuthRequest } from "../utils/definitions";
import { searchTicketInputValidation } from "../utils/validators/getTicketValidation";
import prisma from "../prisma";
import getAffiliateAccess from "../utils/access-check/getAffiliateAccess";

// ticket selector
const ticketSelector: any = {
  departure: true,
  arrival: true,
  owner: {
    select: {
      agencyName: true,
      logo: true,
    },
  },
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
};

/**
 * Retrieves all available flight tickets.
 *
 * @param req - The request object containing pagination parameters:
 *   - `pageSize`: Optional number of tickets to return per page.
 *   - `cursor`: Optional ID of the last ticket on the previous page.
 * @param res - The response object to send the result.
 * @returns {Promise<Response>} A JSON response with the success status and
 * the retrieved flight tickets. The response object will have the following
 * structure:
 * {
 *   success: boolean,
 *   results: {
 *     tickets: FlightTicketRes[],
 *     totalTickets: number,
 *     nextCursor: string | null,
 *   }
 * }
 * where `FlightTicketRes` is defined in `@/utils/definitions/.ts`.
 */
export const getAllTickets = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string, 10)
    : undefined;
  const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;

  try {
    // Authorize the user
    await getAffiliateAccess(req, res);

    // Search for departure tickets and count the total number of tickets
    const [tickets, totalTickets] = await Promise.all([
      prisma.flightTicket.findMany({
        // Search criteria
        where: {
          // Show only available tickets with seats available
          ticketStatus: "available",
          seats: { gt: 0 },
        },
        // Include all ticket fields
        include: ticketSelector,
        // Pagination parameters
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        // Sort by flight date
        orderBy: {
          flightDate: "asc",
        },
      }),
      // Count the total number of tickets
      prisma.flightTicket.count({
        // Same search criteria as above
        where: {
          ticketStatus: "available",
          seats: { gt: 0 },
        },
      }),
    ]);

    // Calculate the next cursor
    const nextCursor =
      tickets.length === pageSize ? tickets[tickets.length - 1].id : null;

    // Return the response
    return res.status(200).json({
      success: true,
      results: {
        tickets,
        totalTickets,
        nextCursor,
      },
    });
  } catch (error) {
    // Log errors
    const err = error as Error;
    console.error("Fetch All Tickets error", {
      message: err.message,
      stack: err.stack,
    });
    // Return a 500 error response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flight tickets. Please try again later.",
    });
  }
};

/**
 * Retrieves a single approved flight ticket by its ID.
 *
 * @param req - The request object containing the ticket ID.
 * @param res - The response object to send the result.
 * @returns The response with the retrieved ticket or an error message. The response object will have the following structure:
 * {
 *   success: boolean,
 *   results: flightTicketRes,
 * }
 */
export const getSingleTicket = async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;
  try {
    // get single approved ticket include all fields
    const ticket = await prisma.flightTicket.findFirst({
      where: { id: ticketId, ticketStatus: "available", seats: { gt: 0 } },
      include: ticketSelector,
    });

    // if ticket not found
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // if there is a ticket but not approved
    if (ticket?.ticketStatus === "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Ticket is not approved yet" });
    }

    // return approved ticket
    return res.status(200).json({ success: true, results: ticket });
  } catch (error) {
    const err = error as Error;
    console.error("Fetch Single Ticket error", {
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
 * Searches for flight tickets based on the provided search parameters.
 *
 * @param req - The request object containing the search parameters in the request body.
 * @param res - The response object to send the search results.
 * @returns The response with the search results or an error message.
 *
 * @response {
 *   "success": boolean,
 *   "message": string,
 *   "results": {
 *     "departure": {
 *       "tickets": FlightTicketRes[],
 *       "totalTickets": number,
 *       "nextCursor": string | null
 *     },
 *     "return": {
 *       "tickets": FlightTicketRes[],
 *       "totalTickets": number,
 *       "nextCursor": string | null
 *     }
 *   } | null
 * }
 */
export const searchTickets = async (req: Request, res: Response) => {
  // Destructure the search parameters from the request body
  const {
    itinerary,
    from,
    to,
    flightDate,
    returnDate,
    flightClass,
    price,
    airlines,
    layoverAirports,
    stops,
  } = req.body;
  const pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string, 10)
    : undefined;
  const cursor = req.query.cursor ? (req.query.cursor as string) : undefined;

  try {
    // Check if the user has access
    await getAffiliateAccess(req, res);

    // Validate the input
    const { error } = searchTicketInputValidation.validate(req.body, {
      abortEarly: false,
    });

    // Return list of errors if validation fails
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ success: false, validationError: errorMessages });
    }

    const stopsOption = [];
    if (stops && stops.length > 0) {
      for (let stop of stops) {
        switch (stop) {
          case "0":
            stopsOption.push({
              stops: 0,
            });
            break;
          case "1":
            stopsOption.push({
              stops: 1,
            });
            break;
          case "2+":
            stopsOption.push({
              stops: {
                gt: 1,
              },
            });
        }
      }
    }

    // ############## DEparture Trip ##############
    // Define the options for searching for departure tickets
    const departureTripOptions: any = [
      {
        ticketStatus: "available",
        seats: { gt: 0 },
        flightDate,
        departure: {
          airportCode: from,
        },
        arrival: {
          airportCode: to,
        },
        flightClasses: {
          some: {
            type: flightClass,
          },
        },
      },
      stopsOption.length > 0 ? { OR: stopsOption } : {},
      price && price.gr && price.ls
        ? {
            flightClasses: {
              some: {
                price: {
                  adult: {
                    gte: price.ls,
                    lte: price.gr,
                  },
                },
              },
            },
          }
        : {},

      airlines && airlines.length > 0
        ? {
            segments: {
              some: {
                carrier: {
                  in: airlines,
                  mode: "insensitive",
                },
              },
            },
          }
        : {},

      layoverAirports && layoverAirports.length > 0
        ? {
            stops: {
              gt: 0,
            },
            segments: {
              some: {
                arrival: {
                  airportCode: {
                    in: layoverAirports,
                    mode: "insensitive",
                  },
                },
              },
            },
          }
        : {},
    ];

    // Search for departure tickets and count the total number of tickets
    const [departureTickets, totalDepartureTickets] = await Promise.all([
      prisma.flightTicket.findMany({
        where: {
          AND: departureTripOptions,
        },
        include: ticketSelector,
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          flightDate: "asc",
        },
      }),
      prisma.flightTicket.count({
        where: { AND: departureTripOptions },
      }),
    ]);

    const DepartureNextCursor =
      departureTickets.length === pageSize
        ? departureTickets[departureTickets.length - 1].id
        : null;

    // ############## Return Trip ##############
    // Define the options for searching for return tickets
    const returnTripOptions: any = [
      {
        ticketStatus: "available",
        seats: { gt: 0 },
        flightDate: returnDate,
        departure: {
          airportCode: to,
        },
        arrival: {
          airportCode: from,
        },
        flightClasses: {
          some: {
            type: flightClass,
          },
        },
      },
      price && price.gr && price.ls
        ? {
            flightClasses: {
              some: {
                price: {
                  adult: {
                    gte: price.gr,
                    lte: price.ls,
                  },
                },
              },
            },
          }
        : {},

      airlines && airlines.length > 0
        ? {
            segments: {
              some: {
                carrier: {
                  in: airlines,
                  mode: "insensitive",
                },
              },
            },
          }
        : {},

      layoverAirports && layoverAirports.length > 0
        ? {
            stops: {
              gt: 0,
            },
            segments: {
              some: {
                arrival: {
                  airportCode: {
                    in: layoverAirports,
                    mode: "insensitive",
                  },
                },
              },
            },
          }
        : {},
      stopsOption.length > 0 ? { OR: stopsOption } : {},
    ];

    // Search for return tickets and count the total number of tickets
    const [returnTickets, totalReturnTickets] = returnDate
      ? await Promise.all([
          prisma.flightTicket.findMany({
            where: returnTripOptions,
            include: ticketSelector,
            take: pageSize,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
              flightDate: "asc",
            },
          }),
          prisma.flightTicket.count({
            where: returnTripOptions,
          }),
        ])
      : [];

    const returnNextCursor =
      returnTickets && returnTickets.length === pageSize
        ? returnTickets[returnTickets.length - 1].id
        : null;

    // Send the search results based on the itinerary type
    if (itinerary === "one way") {
      return res.status(200).json({
        success: true,
        results: {
          departure: {
            tickets: departureTickets,
            totalTickets: totalDepartureTickets,
            nextCursor: DepartureNextCursor,
          },
        },
      });
    } else if (itinerary === "round trip") {
      return res.status(200).json({
        success: true,
        results: {
          departure: {
            tickets: departureTickets,
            totalTickets: totalDepartureTickets,
            nextCursor: DepartureNextCursor,
          },
          return: {
            tickets: returnTickets,
            totalTickets: totalReturnTickets,
            nextCursor: returnNextCursor,
          },
        },
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error("search tickets error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to search tickets. Please try again later.",
    });
  }
};
