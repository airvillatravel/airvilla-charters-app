import cron from "node-cron";
import prisma from "../../prisma";
import logger from "../logger";
import moment from "moment-timezone";

const updateTicketStatuses = async () => {
  try {
    // Current date and time
    const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSS"); // format date as 'YYYY-MM-DDTHH:mm:ss.SSS'

    await prisma.$transaction(async (transaction) => {
      await prisma.flightTicket.updateMany({
        where: {
          AND: [
            {
              departureTime: {
                lt: currentDate,
              },
            },

            {
              ticketStatus: {
                in: ["available", "unavailable", "hold"],
              },
            },
          ],
        },
        data: {
          ticketStatus: "expired",
          updated: false,
        },
      });

      await prisma.flightTicket.updateMany({
        where: {
          AND: [
            {
              flightDate: {
                lt: currentDate,
              },
            },

            {
              ticketStatus: {
                in: ["pending", "rejected"],
              },
            },
          ],
        },
        data: {
          ticketStatus: "blocked",
        },
      });
    });

    logger.info("Ticket statuses updated successfully");
  } catch (error) {
    logger.error("Failed to update ticket statuses", { error });
  }
};

// Schedule the job to run every hour
cron.schedule("* * * * *", updateTicketStatuses);

// Alternative: Schedule the job to run every minute for more frequent updates
// cron.schedule('* * * * *', updateTicketStatuses);

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
