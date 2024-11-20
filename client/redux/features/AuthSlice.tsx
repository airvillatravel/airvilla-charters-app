import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { StoredUser, UserInfo } from "@/utils/definitions/authDefinitions";
import Cookies from "js-cookie";

// Define a type for the slice state
interface AuthState {
  value: StoredUser;
}

// get user from local storage
let storedUser: StoredUser | null = null;

// const cookieUser = Cookies.get("user");

// Check if the cookie is not "undefined" and parse it
// if (cookieUser && cookieUser !== "undefined") {
//   try {
//     storedUser = JSON.parse(cookieUser);
//   } catch (error) {
//     console.error("Failed to parse user cookie:", error);
//   }
// }

// Initial state
const initialState: AuthState | { value: StoredUser | { isLogin: boolean } } = {
  value: {
    // ...storedUser,
    isLogin: false,
    // isLogin: storedUser ? true : false,
    // createdAt: storedUser?.createdAt || "",
    // updatedAt: storedUser?.updatedAt || "",
  },
};

export const counterSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserInfo>) => {
      const data = action.payload;
      state.value = {
        ...state.value,
        isLogin: true,
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        agencyName: data.agencyName,
        email: data.email,
        username: data.username,
        role: data.role,
        avatar: data.avatar,
        accountStatus: data.accountStatus,
        verified: data.verified,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      // updateCookieContent("user", JSON.stringify(state.value));
    },
    // update the cookie with new user info

    logoutUser: (state) => {
      state.value = {
        isLogin: false,
      } as StoredUser;
      // remove the user cookie
      // Cookies.remove("user");
    },
  },
});

export const { loginUser, logoutUser } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoggedIn = (state: RootState) => state.auth.value.isLogin;
export const selectUser = (state: RootState) => state.auth.value;

export default counterSlice.reducer;

// Helper function to set cookie expiration in minutes
function setCookieWithExpiryInMinutes(
  name: string,
  value: string,
  minutes: number
) {
  const now = new Date();
  now.setTime(now.getTime() + minutes * 60 * 1000);
  const cookieValue = JSON.stringify({
    ...JSON.parse(value),
    expires: now.toUTCString(), // Ensure expires is a string
  });
  Cookies.set(name, cookieValue, {
    expires: now,
    secure: true,
    sameSite: "strict",
  });
}

// Helper function to update cookie content
// function updateCookieContent(name: string, value: string) {
//   const cookie = Cookies.get(name);
//   if (cookie) {
//     const parsedCookie = JSON.parse(cookie);

//     const expires = parsedCookie.expires
//       ? new Date(parsedCookie.expires)
//       : undefined;
//     const updatedValue = JSON.stringify({
//       ...JSON.parse(value),
//       expires: parsedCookie.expires, // Preserve the original expires value
//     });
//     Cookies.set(name, updatedValue, {
//       expires,
//       secure: true,
//       sameSite: "strict",
//     });
//   } else {
//     setCookieWithExpiryInMinutes(name, value, 60);
//   }
// }
