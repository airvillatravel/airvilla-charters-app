import axios, { AxiosResponse } from "axios";
import authUrl from "../endpoints/authEndpoints";
import {
  AuthResTypes,
  LoginBody,
  SignupFormDataTypes,
} from "@/utils/definitions/authDefinitions";

// FETCH LOGIN
export const fetchLogin = async (
  body: LoginBody
): Promise<AuthResTypes | null> => {
  try {
    const response = await axios.post(authUrl.login, body, {
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
      return {
        success: false,
        message: "Failed to login. Please try again later.",
      };
    }
  }
};

// FETCH SIGNUP
export const fetchSignup = async (
  body: SignupFormDataTypes
): Promise<AuthResTypes | null> => {
  try {
    const response = await axios.post(authUrl.signup, body, {
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
      return {
        success: false,
        message: "Failed to signup. Please try again later.",
      };
    }
  }
};

// FETCH LOGOUT
export const fetchLogout = async (): Promise<AuthResTypes> => {
  try {
    const res: AxiosResponse<AuthResTypes> = await axios.get(authUrl.logout, {
      withCredentials: true, // Ensure credentials are included
    });

    // return res
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return {
        success: false,
        message: "Failed to logout. Please try again later.",
      };
    }
  }
};

// FETCH send email verification
export const fetchSendEmailVerification =
  async (): Promise<AuthResTypes | null> => {
    try {
      const res: AxiosResponse<AuthResTypes> = await axios.get(
        authUrl.sendEmailVerification,
        {
          withCredentials: true, // Ensure credentials are included
        }
      );

      // return res
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Return server error message
        return error.response.data;
      } else {
        // Log the error if it's not an Axios error
        console.error("Login error:", error.message);
        return {
          success: false,
          message: "Failed to send email verification. Please try again later.",
        };
      }
    }
  };

// FETCH email verification
export const fetchEmailVerification = async (
  token: string
): Promise<AuthResTypes | null> => {
  try {
    const res: AxiosResponse<AuthResTypes> = await axios.get(
      authUrl.emailVerification(token),
      {
        withCredentials: true, // Ensure credentials are included
      }
    );

    // return res
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return {
        success: false,
        message: "Failed to verify email. Please try again later.",
      };
    }
  }
};

// SEND RESET PASSWORD
export const fetchSendResetPassword = async (body: {
  email: string;
}): Promise<AuthResTypes | null> => {
  try {
    const res: AxiosResponse<AuthResTypes> = await axios.post(
      authUrl.sendResetPassword,
      body,
      {
        withCredentials: true, // Ensure credentials are included
      }
    );

    // return res
    const data: AuthResTypes = res.data;
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
        message: "Failed to send reset password. Please try again later.",
      };
    }
  }
};

// RESET PASSWORD
export const fetchResetPassword = async (
  body: {
    password: string;
    confirmPassword: string;
  },
  token: string
): Promise<AuthResTypes | null> => {
  try {
    const res: AxiosResponse<AuthResTypes> = await axios.put(
      authUrl.resetPassword(token),
      body,
      {
        withCredentials: true, // Ensure credentials are included
      }
    );

    // return res
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      return error.response.data;
    } else {
      // Log the error if it's not an Axios error
      console.error("Login error:", error.message);
      return {
        success: false,
        message: "Failed to reset password. Please try again later.",
      };
    }
  }
};
