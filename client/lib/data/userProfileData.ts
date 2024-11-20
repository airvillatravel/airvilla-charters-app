import {
  UserProfileResType,
  UserProfileResultType,
} from "@/utils/definitions/userProfileDefinitions";
import axios from "axios";
import userUrl from "../endpoints/userEndpoints";

/**
 * Fetches the user profile data.
 * @returns Promise<UserProfileType | null>
 */
export const fetchUserProfile = async (): Promise<UserProfileResType> => {
  try {
    const response = await axios.get(userUrl.getUserProfile, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserProfileResType = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Fetch User Profile error:", error.message);
      return {
        success: false,
        message: "Failed to display user profile. Please try again later.",
      };
    }
  }
};

// update user profile
export const fetchUpdateUserProfile = async (body: UserProfileResultType) => {
  try {
    const response = await axios.put(userUrl.getUserProfile, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserProfileResType = response.data;
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

export const fetchUpdateUserEmail = async (body: { newEmail: string }) => {
  try {
    const response = await axios.post(userUrl.updateUserEmail, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserProfileResType = response.data;
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
        message: "Failed to send update email request. Please try again later.",
      };
    }
  }
};

// verfy update email
export const fetchUpdateUserEmailVerify = async (token: string) => {
  try {
    const response = await axios.get(userUrl.updateUserEmailVerify(token), {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserProfileResType = response.data;
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
        message: "Failed to verfy update email. Please try again later.",
      };
    }
  }
};

// update user password
export const fetchUpdateUserPassword = async (body: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  try {
    const response = await axios.put(userUrl.updateUserPassword, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserProfileResType = response.data;
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
        message: "Failed to update user password. Please try again later.",
      };
    }
  }
};

// delete user profile
export const fetchDeleteUserProfile = async (body: { password: string }) => {
  try {
    const response = await axios.post(userUrl.deleteUserProfile, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials are included
    });

    const data: UserProfileResType = response.data;
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
        message: "Failed to delete user profile. Please try again later.",
      };
    }
  }
};
