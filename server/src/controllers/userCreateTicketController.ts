import { Response } from "express";
import { AuthRequest } from "../utils/definitions";
import checkUserAuth from "../utils/authorization/checkUserAuth";
import prisma from "../prisma";
import { capitalize, combineDateAndTime, timeDif } from "../utils/functions";
import {
  updateTicketValidation,
  createTicketValidation,
} from "../utils/validators/ticketValidation";
import generateTicketRefId from "../utils/generateTicketRefId";
import { get } from "http";
import getAgencyAccess from "../utils/access-check/getAgencyAccess";
import moment from "moment";

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
 * Creates a new flight ticket with multiple dates and segments.
 *
 * @param req - The request object containing the ticket details.
 * @param res - The response object to send the result.
 * @returns The response with the created ticket(s) or an error message. The response object will have the following structure:
 * {
 *   success: boolean,
 *   message: string,
 * }
 */
export const createTicket = async (req: AuthRequest, res: Response) => {
  const input = req.body;

  try {
    // Authorize the user
    const user = await getAgencyAccess(req, res);

    // Validate the inputs
    const { error } = createTicketValidation.validate(input, {
      abortEarly: false,
    });

    // Return a list of errors if validation fails
    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        acc[detail.path.join(".")] = detail.message;
        return acc;
      }, {} as Record<string, string>);

      return res
        .status(400)
        .json({ success: false, validationErrors: errorDetails });
    }

    // Create the ticket and related entities in a transaction
    await prisma.$transaction(async (transaction) => {
      // Loop through all ticket dates and create tickets according to the dates
      for (const flightDate of input.flightDates) {
        // Generate a reference ID for the ticket
        const refId = await generateTicketRefId();

        // Return an error if the reference ID is not available
        if (!refId) {
          return res.status(400).json({
            success: false,
            message: "Couldn't generate a reference ID",
          });
        }

        // Create the ticket
        const flightTicket = await transaction.flightTicket.create({
          data: {
            refId: refId,
            description: input.description?.trim() || null,
            seats: parseInt(input.seats),
            owner: { connect: { id: (user as { id: string }).id } },
            stops: input.segments.length - 1,
            flightDate: flightDate,
            ticketHistoryLogs: {
              create: {
                changeType: "created",
                changeDetails: JSON.stringify({ comment: "Ticket created" }),
                agencyId: (user as { id: string }).id,
              },
            },
            flightClasses: {
              create: input.flightClasses.map((flightClass: any) => ({
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
              })),
            },
          },
        });

        // Set the departure and arrival dates for the segments
        let depDate = flightDate;
        let arrDate = flightDate;

        // Create segments
        for (const segment of input.segments) {
          // Add a day to the arrival date if the departure time is after the arrival time
          if (
            moment(segment.arrivalTime).isBefore(moment(segment.departureTime))
          ) {
            const newFlightDate = moment(arrDate).add(1, "day");
            arrDate = newFlightDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
          }

          // Combine date and time
          const comDepTime = combineDateAndTime(depDate, segment.departureTime);
          const comArrTime = combineDateAndTime(arrDate, segment.arrivalTime);

          // Create the segment
          await transaction.flightSegment.create({
            data: {
              flightTicket: { connect: { id: flightTicket.id } },
              flightNumber: segment.flightNumber?.trim(),
              carrier: segment.carrier?.trim(),
              departure: {
                create: {
                  airportCode: segment.departure.airportCode
                    ?.trim()
                    .toUpperCase(),
                  country: segment.departure.country?.trim().toUpperCase(),
                  city: capitalize(segment.departure.city)?.trim(),
                  airport: capitalize(segment.departure.airport)?.trim(),
                },
              },
              arrival: {
                create: {
                  airportCode: segment.arrival.airportCode
                    ?.trim()
                    .toUpperCase(),
                  country: segment.arrival.country?.trim().toUpperCase(),
                  city: capitalize(segment.arrival.city)?.trim(),
                  airport: capitalize(segment.arrival.airport)?.trim(),
                },
              },
              departureTime: comDepTime,
              arrivalTime: comArrTime,
              duration: timeDif(comDepTime, comArrTime),
            },
          });

          // Add a day to the departure date if the arrival time is after the departure time
          if (
            moment(segment.arrivalTime).isBefore(moment(segment.departureTime))
          ) {
            const newFlightDate = moment(depDate).add(1, "day");
            depDate = newFlightDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
          }
        }

        // Find all segments
        const segments = await transaction.flightSegment.findMany({
          where: { flightTicketId: flightTicket.id },
          orderBy: {
            departureTime: "asc",
          },
        });

        // Update the flight ticket after creating segments
        const updateTicket = await transaction.flightTicket.update({
          where: { id: flightTicket.id },
          data: {
            departure: { connect: { id: segments[0].departureId } },
            arrival: {
              connect: { id: segments[segments.length - 1].arrivalId },
            },
            departureTime: segments[0].departureTime,
            arrivalTime: segments[segments.length - 1].arrivalTime,
            duration: timeDif(
              segments[0].departureTime,
              segments[segments.length - 1].arrivalTime
            ),
          },
          include: ticketSelectors,
        });
      }
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: `${input.flightDates.length} flight ticket${
        input.flightDates.length > 1 ? "s" : ""
      } created successfully`,
    });
  } catch (error: any) {
    const err = error as Error;
    console.error("Create Ticket error", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Failed to create a flight ticket. Please try again later.",
    });
  }
};

/**
 * Updates a flight ticket with the given input.
 * The user making the request must be the owner of the ticket.
 * The input must contain the refId, the new data for the ticket,
 * and the new segments data.
 * This function will first validate the input, then authorize the user,
 * and finally update the ticket and its segments.
 * @param {AuthRequest} req - The request object containing the refId and the new data.
 * @param {Response} res - The response object to send the result.
 */
export const updateTicket = async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;
  const input = req.body;
  try {
    // Authorize the user
    const user = await getAgencyAccess(req, res);

    // Validate the inputs
    const { error } = updateTicketValidation.validate(input, {
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

    // find the ticket
    const ticket = await prisma.flightTicket.findUnique({
      where: { refId: ticketId, ownerId: (user as { id: string }).id },
      include: ticketSelectors,
    });

    // if there is no ticket
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const date = new Date();
    const currentDate = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS");

    // Check if the flight date has passed
    if (ticket.flightDate < currentDate) {
      return res
        .status(400)
        .json({ success: false, message: "Flight date has passed" });
    }

    // if ticket status is available, unavailable, rejected
    const updateStatusOptions = ["rejected"];
    if (!updateStatusOptions.includes(input.ticketStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Ticket cannot be updated" });
    }

    const updatedTicket = await prisma.$transaction(async (transaction) => {
      // Update the ticket details
      const flightTicket = await transaction.flightTicket.update({
        where: { refId: ticketId },
        data: {
          refId: input.refId,
          flightDate: input.flightDate,
          description: input.description?.trim() || null,
          ticketStatus: "pending",
          seats: parseInt(input.seats),
          stops: input.segments.length - 1,
          owner: { connect: { id: (user as { id: string }).id } },
        },
      });

      // delete all flight classes
      await transaction.flightClass.deleteMany({
        where: { flightTicketId: flightTicket.id },
      });

      // Update flight classes
      for (const flightClass of input.flightClasses) {
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

      // Update segments
      // Delete existing segments
      await transaction.flightSegment.deleteMany({
        where: { flightTicketId: flightTicket.id },
      });
      // Set the departure and arrival dates for the segments
      let depDate = input.flightDate;
      let arrDate = input.flightDate;

      // input.segments.sort((a: any, b: any) => {
      //   return moment(a.departureTime).diff(moment(b.departureTime));
      // });

      // Create segments
      for (const segment of input.segments) {
        // Add a day to the arrival date if the departure time is after the arrival time
        if (
          moment(segment.arrivalTime).isBefore(moment(segment.departureTime))
        ) {
          const newFlightDate = moment(arrDate).add(1, "day");
          arrDate = newFlightDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
        }

        // Combine date and time
        const comDepTime = combineDateAndTime(depDate, segment.departureTime);
        const comArrTime = combineDateAndTime(arrDate, segment.arrivalTime);

        // Create the segment
        await transaction.flightSegment.create({
          data: {
            flightTicket: { connect: { id: flightTicket.id } },
            flightNumber: segment.flightNumber?.trim(),
            carrier: segment.carrier?.trim(),
            departure: {
              create: {
                airportCode: segment.departure.airportCode
                  ?.trim()
                  .toUpperCase(),
                country: segment.departure.country?.trim().toUpperCase(),
                city: capitalize(segment.departure.city)?.trim(),
                airport: capitalize(segment.departure.airport)?.trim(),
              },
            },
            arrival: {
              create: {
                airportCode: segment.arrival.airportCode?.trim().toUpperCase(),
                country: segment.arrival.country?.trim().toUpperCase(),
                city: capitalize(segment.arrival.city)?.trim(),
                airport: capitalize(segment.arrival.airport)?.trim(),
              },
            },
            departureTime: comDepTime,
            arrivalTime: comArrTime,
            duration: timeDif(comDepTime, comArrTime),
          },
        });

        // Add a day to the departure date if the arrival time is after the departure time
        if (
          moment(segment.arrivalTime).isBefore(moment(segment.departureTime))
        ) {
          const newFlightDate = moment(depDate).add(1, "day");
          depDate = newFlightDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
        }
      }

      // Find all segments
      const segments = await transaction.flightSegment.findMany({
        where: { flightTicketId: flightTicket.id },
        orderBy: {
          departureTime: "asc",
        },
      });

      // Update the flight ticket after creating segments
      const updatedTicket = await transaction.flightTicket.update({
        where: { id: flightTicket.id },
        data: {
          departureId: segments[0].departureId,
          arrivalId: segments[segments.length - 1].arrivalId,
          departureTime: segments[0].departureTime,
          arrivalTime: segments[segments.length - 1].arrivalTime,
          duration: timeDif(
            segments[0].departureTime,
            segments[segments.length - 1].arrivalTime
          ),
        },
        include: ticketSelectors,
      });

      // Log detailed changes to the ticket
      await transaction.ticketHistoryLog.create({
        data: {
          ticketId: flightTicket.id,
          changeType: "updated (pending)",
          changeDetails: JSON.stringify(getDifferences(ticket, updatedTicket)),
          // oldValue: JSON.stringify({
          //   ...ticket,
          //   createdAt: undefined,
          //   updatedAt: undefined,
          // }),
          // newValue: JSON.stringify({
          //   ...flightTicket,
          //   createdAt: undefined,
          //   updatedAt: undefined,
          // }),
          agencyId: (user as { id: string }).id,
        },
      });

      return updatedTicket;
    });

    // return success res
    return res.status(200).json({
      success: true,
      message: "Flight ticket updated successfully",
      results: updatedTicket,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update ticket Erorr", {
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
