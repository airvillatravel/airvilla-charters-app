import axios from "axios";
import masterUrl from "../endpoints/masterEndpoints";
import {
  MasterSingleUserResType,
  MasterUserDataType,
  MasterUserResultType,
  MasterUsersResType,
} from "@/utils/definitions/masterDefinitions";
import { UserProfileResultType } from "@/utils/definitions/userProfileDefinitions";

// fetch all users
export const fetchAllUsersForMaster = async (
  cursor?: string,
  pageSize: number = 12
) => {
  try {
    const response = await axios.get(masterUrl.getAllUsersForMaster, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        cursor, // Pass the cursor parameter
        pageSize, // Pass the pageSize parameter
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: MasterUsersResType = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return {
        success: false,
        message: "Failed to fetch users. Please try again later.",
      };
    }
  }
};

// fetch all users by searching
export const fetchAllSearchUsersForMaster = async (
  input: string,
  accountStatus?: string,
  cursor?: string,
  pageSize: number = 5,
  signal?: AbortSignal
) => {
  try {
    const response = await axios.get(masterUrl.getAllSearchUsersForMaster, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        input,
        accountStatus,
        cursor, // Pass the cursor parameter
        pageSize, // Pass the pageSize parameter
      },
      signal, // Pass the signal to Axios config
      withCredentials: true, // Ensure credentials are included
    });

    const data: MasterUsersResType = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return {
        success: false,
        message: "Failed to fetch users. Please try again later.",
      };
    }
  }
};

// fetch update user info
export const fetchUserRequestForMaster = async (
  userId: string,
  input: { accountStatus?: string; role?: string }
) => {
  try {
    const response = await axios.put(
      masterUrl.getSingleUserRequestForMaster(userId),
      input,
      {
        headers: {
          "Content-Type": "application/json",
        },

        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: MasterSingleUserResType = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to update a user. Please try again later.",
      };
    }
  }
};

// fetch delete user
export const fetchDeleteUsersForMaster = async (userId: string) => {
  try {
    const response = await axios.delete(
      masterUrl.getSingleUserForMaster(userId),
      {
        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: MasterSingleUserResType = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to delete a user. Please try again later.",
      };
    }
  }
};

// fetch single user
export const fetchSingleUserForMaster = async (userId: string) => {
  try {
    const response = await axios.get(masterUrl.getSingleUserForMaster(userId), {
      withCredentials: true, // Ensure credentials are included
    });

    const data: MasterSingleUserResType = response.data;

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("fetch Update Users Form Master error:", error.message);
      return {
        success: false,
        message: "Failed to display a user. Please try again later.",
      };
    }
  }
};

// update user profile
export const fetchUpdateUserProfileForMaster = async (
  userId: string,
  body: MasterUserResultType
) => {
  try {
    const response = await axios.put(
      masterUrl.getSingleUserForMaster(userId),
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: MasterUserResultType = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Update User Profile error:", error.message);
      return {
        success: false,
        message: "Failed to update user profile. Please try again later.",
      };
    }
  }
};

// update user password
export const fetchUpdateUserPasswordForMaster = async (
  userId: string,
  body: {
    password: string;
    confirmPassword: string;
  }
) => {
  try {
    const response = await axios.put(
      masterUrl.getSingleUserPasswordForMaster(userId),
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included
      }
    );

    const data: MasterUsersResType = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Update User Profile error:", error.message);
      return {
        success: false,
        message: "Failed to update user profile. Please try again later.",
      };
    }
  }
};
