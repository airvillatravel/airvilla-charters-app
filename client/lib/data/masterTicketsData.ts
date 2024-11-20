import axios from "axios";
import masterUrl from "../endpoints/masterEndpoints";
import {
  MasterAgencyNamesRes,
  MasterSingleTicketRes,
  MasterTicketsRes,
  TicketRequestDataType,
} from "@/utils/definitions/masterDefinitions";

export const fetchAllTicketsForMaster = async (
  body: TicketRequestDataType,
  ticketStatus?: string,
  updated?: boolean | null,
  cursor?: string,
  pageSize: number = 20
) => {
  try {
    // Make a GET request to the master endpoint with the provided parameters
    const response = await axios.post(masterUrl.getAllTicketsForMaster, body, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        ticketStatus, // Pass the ticketStatus parameter
        updated, // Pass the updated parameter
        cursor, // Pass the cursor parameter
        pageSize, // Pass the pageSize parameter
      },
      withCredentials: true, // Ensure credentials are included
    });

    // Extract the data from the response and return it
    const data: MasterTicketsRes = response.data;
    return data;
  } catch (error: any) {
    // If the request fails, check if it's an Axios error and return the server error message if it is
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      console.error("Fetch Master ticket error:", error.message);
      return {
        success: false,
        message: "Failed to display all tickets. Please try again later.",
      };
    }
  }
};

// fetch agency names
export const fetchAllAgencyNamesForMaster = async () => {
  try {
    const response = await axios.get(masterUrl.getAgencyNamesForMaster, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: MasterAgencyNamesRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to display all Agency Names. Please try again later.",
      };
    }
  }
};

// Fetch single ticket
export const fetchSingleTicketForMaster = async (refId: string) => {
  try {
    const response = await axios.get(
      masterUrl.getSingleTicketForMaster(refId),
      {
        headers: {
          "Content-Type": "application/json",
        },

        withCredentials: true, // Ensure credentials are included
      }
    );
    const data: MasterSingleTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to display ticket. Please try again later.",
      };
    }
  }
};

// update single master ticket
export const updateSingleMasterTicket = async (
  refId: string,
  body: { ticketStatus: string; comment: string }
) => {
  try {
    const response = await axios.put(
      masterUrl.updateTicketStatusForMaster(refId),
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      }
    );
    const data: MasterSingleTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to update ticket. Please try again later.",
      };
    }
  }
};

// update valid single master ticket
export const updateValidMasterTicket = async (
  refId: string,
  body: { updateRespond: string; comment?: string }
) => {
  try {
    const response = await axios.put(
      masterUrl.getUpdateValidTicketForMaster(refId),
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      }
    );
    const data: MasterSingleTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to update ticket. Please try again later.",
      };
    }
  }
};
