import moment from "moment";
import crypto from "crypto";
// import { customAlphabet } from "nanoid";

// capitalize word
export const capitalize = (word: string) => {
  const words = word.split(" ");

  const wordsArr = words.map((word: string) => {
    return word.trim().charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return wordsArr.join(" ");
};

// remove spaces form phone number
export const trimPhoneNumber = (value: string) => {
  const num = value.trim().split(" ");
  return num.join("");
};

export const convertTimeToISOString = (time: any) => {
  const [hours, minutes] = time.split(":");
  const date = moment().set({
    hour: hours,
    minute: minutes,
    second: 0,
    millisecond: 0,
  });

  // Format to ISO string without timezone conversion
  return date.format("YYYY-MM-DDTHH:mm:ss.SSS");
};

// time fiffrence calculation
export const timeDif = (departureTime: string, arrivalTime: string) => {
  // Convert times to moment objects
  const departure = moment(departureTime);
  let arrival = moment(arrivalTime);

  // Check if arrival time is earlier than departure time and adjust for next day
  // if (arrival.isBefore(departure)) {
  //   arrival.add(1, "day");
  // }

  // Calculate the difference between departure and arrival times
  const diff = moment.duration(arrival.diff(departure));
  const hours = Math.floor(diff.asHours());
  const minutes = diff.minutes();

  return `${hours}h ${minutes}m`;
};

// Helper function to calculate date ranges for created time filter
export const getCreatedTimeRange = (filter: string) => {
  /**
   * Calculates the date range for the created time filter
   * based on the provided filter string.
   * @param filter - The filter string
   * @returns An object with the date range for the created time filter
   */
  const now = new Date();
  switch (filter) {
    case "today":
      return { gte: new Date(now.setHours(0, 0, 0, 0)) };
    case "last 7 days":
      return { gte: new Date(now.setDate(now.getDate() - 7)) };
    case "last month":
      return { gte: new Date(now.setMonth(now.getMonth() - 1)) };
    case "last 12 months":
      return { gte: new Date(now.setMonth(now.getMonth() - 12)) };
    case "all time":
      return {}; // No date filter applied
    default:
      return {}; // Default to no filter
  }
};

/**
 * Combines a date string with a time string.
 * @param {string} dateStr - The date string in 'YYYY-MM-DDTHH:mm:ss.SSS' format.
 * @param {string} timeStr - The time string in 'YYYY-MM-DDTHH:mm:ss.SSS' format.
 * @returns {string} - The combined date-time string in ISO 8601 format.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): string {
  // Parse the date part from dateStr
  const date = moment(dateStr, "YYYY-MM-DDTHH:mm:ss.SSS");

  // Extract the time part from timeStr
  const time = moment(timeStr.toString(), "YYYY-MM-DDTHH:mm:ss.SSS");

  // Set the time components in the date
  date.set({
    hour: time.hour(),
    minute: time.minute(),
    second: time.second(),
    millisecond: time.millisecond(),
  });

  // Format the combined result
  const combinedDateTime = date.format("YYYY-MM-DDTHH:mm:ss.SSS");

  return combinedDateTime;
}

// /**
//  * Generates a secure token by combining random bytes, team ID, member ID, and a timestamp.
//  * The token includes a readable part and a hash of the combined data.
//  *
//  * @param {string} teamId - The unique identifier for the team.
//  * @param {string} memberId - The unique identifier for the member.
//  * @returns {Promise<string>} - A promise that resolves to a secure token string.
//  * @throws {Error} - Throws an error if token generation fails.
//  */
// export const generateSecureToken = async (
//   teamId: string,
//   memberId: string
// ): Promise<string> => {
//   try {
//     // Generate random bytes
//     const randomBytes = crypto.randomBytes(32);

//     // Create a timestamp
//     const timestamp = Date.now();

//     // Combine data into a buffer
//     const dataBuffer = Buffer.concat([
//       randomBytes,
//       Buffer.from(teamId),
//       Buffer.from(memberId),
//       Buffer.from(timestamp.toString()),
//     ]);

//     // Create a hash of the combined data
//     const hash = crypto.createHash("sha256").update(dataBuffer).digest("hex");

//     // Dynamically import nanoid and create a readable token part
//     const { customAlphabet } = await import("nanoid");
//     // Create a more readable token with nanoid
//     const nanoid = customAlphabet(
//       "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz",
//       12
//     );
//     const readablePart = nanoid();

//     // Combine hash and readable part
//     return `${readablePart}_${hash.slice(0, 32)}`;
//   } catch (error) {
//     console.error("Error generating secure token:", error);
//     throw new Error("Failed to generate secure token");
//   }
// };

export async function generateInvitationToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString("hex"));
      }
    });
  });
}
