import axios, { AxiosResponse } from "axios";
import ticketUrl from "../endpoints/ticketEndpoints";
import { AuthResTypes } from "@/utils/definitions/authDefinitions";
import userUrl from "../endpoints/userEndpoints";

// FETCH ALL TICKETS
export const fetchAllTickets = async (limit: number, offset: number) => {
  try {
    const response = await axios.get(
      // `${ticketUrl.getAllTickets}limit=${limit}&offset=${offset}`,
      ticketUrl.getAllTickets,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          limit,
          offset,
        },
        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: AuthResTypes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return null;
    }
  }
};

// FETCH SEARCH TICKET
export const fetchSearchTickets = async (
  formData: any,
  status: string,
  cursor?: string,
  pageSize: number = 10
) => {
  try {
    const { itinerary, flightDate, returnDate } = formData;

    // Function to format date
    const formatDate = (date: Date | null): string | null => {
      if (!date) return null;
      const d = new Date(date);
      d.setDate(d.getDate()); // Add one day
      // return d.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      // Format as YYYY-MM-DDT00:00:00.000
      const formattedDate = `${year}-${month}-${day}T00:00:00.000`;
      return formattedDate;
    };

    // Format dates
    const formattedDepartureDate = flightDate
      ? formatDate(new Date(flightDate.toString()))
      : null; //
    const formattedReturnDate =
      itinerary.toLowerCase() === "round trip"
        ? formatDate(new Date(returnDate!.toString()))
        : null;

    // Prepare formData with formatted dates
    const formattedFormData = {
      ...formData,
      flightDate: formattedDepartureDate,
      returnDate: formattedReturnDate,
    };

    const response = await axios.post(
      `${ticketUrl.searchTickets}`,
      formattedFormData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ticketStatus: status.toLowerCase().trim(),
          cursor: cursor,
          pageSize,
        },
        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: AuthResTypes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return null;
    }
  }
};

// FETCH TICKET BY ID
export const fetchTicketById = async (ticketId: string) => {
  try {
    const response = await axios.get(ticketUrl.singleTicket(ticketId), {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: AuthResTypes = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return null;
    }
  }
};
