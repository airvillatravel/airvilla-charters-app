import axios from "axios";
import masterUrl from "../endpoints/masterEndpoints";

/**
 * Fetches the total number of tickets for the master dashboard.
 *
 * @param {string} ticketStatus - The status of the tickets to filter by. Defaults to "all".
 * @return {Promise<{ success: boolean; results: string }>} - A promise that resolves to an object
 * containing the success status and the total number of tickets.
 * @throws {Error} - If there is an error fetching the data from the server.
 */
export const fetchTotalTicketsForMaster = async (
  ticketStatus: string = "all"
): Promise<any> => {
  try {
    const response = await axios.get(masterUrl.getTotalTicketsForMaster, {
      params: { ticketStatus },
      withCredentials: true,
    });
    const { success, results } = response.data;
    return { success, results };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      console.error("Error fetching total tickets:", error.message);
      return {
        success: false,
        message: "Failed to display total tickets. Please try again later.",
      };
    }
  }
};

/**
 * Fetches the total number of users for the master dashboard.
 *
 * @param {string} [role="all"] - The role of the users to filter by.
 * @param {string} [status="all"] - The status of the users to filter by.
 * @returns {Promise<{ success: boolean; results?: string; message?: string }>} - A promise that resolves to an object
 * containing the success status and the total number of users.
 * @throws {Error} - If there is an error fetching the data from the server.
 */
export const fetchTotalUsersForMaster = async (
  role: string = "all",
  status: string = "all"
): Promise<{ success: boolean; results?: string; message?: string }> => {
  try {
    const response = await axios.get(masterUrl.getTotalUsersForMaster, {
      params: { role, accountStatus: status },
      withCredentials: true,
    });

    const { success, results } = response.data;

    return { success, results };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching total users:", error);
    return {
      success: false,
      message: "Failed to display total users. Please try again later.",
    };
  }
};
