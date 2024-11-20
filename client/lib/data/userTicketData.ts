import axios, { AxiosResponse } from "axios";
import ticketUrl from "../endpoints/ticketEndpoints";
import { AuthResTypes } from "@/utils/definitions/authDefinitions";
import userUrl from "../endpoints/userEndpoints";
import {
  CreateTicketFormTypes,
  CreateUpdateTicketRes,
  FilterFormDataType,
  UserSingleTicketRes,
  UserTicketResultType,
  UserTicketsRes,
} from "@/utils/definitions/myTicketsDefinitions";

// CREATE TICKET
export const fetchCreateTicket = async (body: CreateTicketFormTypes) => {
  try {
    const response = await axios.post(ticketUrl.addTicket, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: CreateUpdateTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Create Tickets error:", error);
      return {
        success: false,
        message: "Failed to create a flight ticket. Please try again later.",
      };
    }
  }
};

// DELETE TICKET
export const fetchDeleteTicketById = async (id: string) => {
  try {
    const response = await axios.delete(userUrl.singleTicket(id), {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserSingleTicketRes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Delete ticket error:", error.message);
      return {
        success: false,
        message: "Failed to delete the ticket. Please try again later.",
      };
    }
  }
};

// UPDATE TICKET
export const fetchUpdateTicketById = async (
  id: string,
  body: UserTicketResultType
) => {
  try {
    const response = await axios.put(ticketUrl.singleTicket(id), body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserSingleTicketRes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      console.error(error.response.data);
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Update Ticket error:", error.message);
      return {
        success: false,
        message: "Failed to update a flight ticket. Please try again later.",
      };
    }
  }
};

// UPDATE VALID TICKET REQUEST
export const fetchUpdateValidTicketById = async (
  refId: string,
  body: UserTicketResultType
) => {
  try {
    const response = await axios.put(
      userUrl.updateValidTicket(refId),
      { updatedTicketReq: body },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: UserSingleTicketRes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      console.error(error.response.data);
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Update Ticket error:", error.message);
      return {
        success: false,
        message: "Failed to update a flight ticket. Please try again later.",
      };
    }
  }
};

// GET SINGLE TICKET
export const fetchSingleTicketById = async (id: string) => {
  try {
    const response = await axios.get(userUrl.singleTicket(id), {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserSingleTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Get Single Ticket error:", error.message);
      return {
        success: false,
        message: "Failed to diplay a flight ticket. Please try again later.",
      };
    }
  }
};

// FETCH ALL USERS TICKETS
export const fetchSearchAllUsersTickets = async (
  body: FilterFormDataType,
  status: string,
  updated?: boolean | null,
  cursor?: string,
  pageSize: number = 20
) => {
  try {
    const response = await axios.post(userUrl.getAllUserTickets, body, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        ticketStatus: status.toLowerCase().trim(),
        updated: updated,
        cursor: cursor,
        pageSize,
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserTicketsRes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Fetch all users tickets error:", error.message);
      return {
        success: false,
        message: "Failed to diplay all tickets. Please try again later.",
      };
    }
  }
};

export const updateUserTicketStatus = async (refId: string, status: string) => {
  try {
    const response = await axios.put(
      userUrl.updateSingleTicket(refId),
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      }
    );
    const data: UserSingleTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Update User Ticket Status error:", error.message);
      return {
        success: false,
        message: "Failed to update a flight ticket. Please try again later.",
      };
    }
  }
};

export const withdrawUpdateValidTicket = async (refId: string) => {
  try {
    const response = await axios.get(userUrl.withdrawUpdateValidTicket(refId), {
      withCredentials: true, // Ensure credentials are included
    });
    const data: UserSingleTicketRes = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Update User Ticket Status error:", error.message);
      return {
        success: false,
        message: "Failed to update a flight ticket. Please try again later.",
      };
    }
  }
};
