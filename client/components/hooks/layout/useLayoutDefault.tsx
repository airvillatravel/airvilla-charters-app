"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { loginUser, logoutUser, selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import { fetchUserProfile } from "@/lib/data/userProfileData";
import { useSocket } from "@/context/SocketContext";
import { selectActionMsg, setMsg } from "@/redux/features/ActionMsgSlice";
import { fetchLogout } from "@/lib/data/authData";
export default function useLayoutDefault() {
  // redux
  const user = useAppSelector(selectUser);
  const actionMsg = useAppSelector(selectActionMsg);

  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { socket } = useSocket();

  // states
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true); // To track user info loading
  const [isSessionExpiredPopupOpen, setIsSessionExpiredPopupOpen] =
    useState(false);

  // functions
  const handleLogout = async () => {
    setLoading(true);
    // clean all cookies
    const logout = await fetchLogout();

    // send a success msg
    if (logout?.success) {
      setIsSessionExpiredPopupOpen(true);
    }
    // dispatch(setMsg({ success: logout.success, message: logout.message }));
    setLoading(false);
  };

  // timer
  const resetTimer = useCallback(() => {
    // Clear the previous timeout
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

    // Set a new 5-minute timer (300,000 milliseconds)
    timeoutIdRef.current = setTimeout(() => {
      handleLogout();
    }, 1000 * 60 * 15); // 5 minutes
  }, []);

  // useEffects
  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      setLoading(true);

      // Fetch user info from the server
      const userInfo = await fetchUserProfile();

      // If the fetch was successful and the user info is present, update the state
      if (userInfo?.success && userInfo.results) {
        dispatch(loginUser(userInfo.results));
      }

      setUserLoading(false);
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  // update the user state when update it from master
  useEffect(() => {
    if (socket) {
      socket.on("updateUserProfile", () => {
        alert("Your account info has been updated by master user");
        // fetchUserInfo();
      });

      socket.on("sessionExpiration", () => {
        setIsSessionExpiredPopupOpen(true);
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("updateUserProfile");
        socket.off("sessionExpiration");
      }
    };
  }, [socket]);

  // if user is unauthorized
  useEffect(() => {
    if (actionMsg.message === "Unauthorized") {
      setIsSessionExpiredPopupOpen(true);
      // dispatch(logoutUser());
    }
  }, [actionMsg]);

  // Redirect to signin page if already not loggedin
  useEffect(() => {
    if (userLoading) return;

    if (!user.isLogin) {
      router.push("/signin");
      return;
    }

    if (!(user as StoredUser).verified) {
      router.push("/signup-process/not-verified");
      return;
    }

    // redirect the user to not approved page if not approved yet
    if ((user as StoredUser).accountStatus !== "accepted") {
      router.push("/signup-process/not-accepted");
      return;
    }

    setLoading(false);
  }, [user, router, userLoading]);

  useEffect(() => {
    // Events to detect user activity
    const events = ["keydown", "click"];

    // Add event listeners to reset the timer on user activity
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the inactivity timer when the component mounts
    resetTimer();

    // Cleanup: remove event listeners and clear timeout on unmount
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [resetTimer]);

  return { loading, isSessionExpiredPopupOpen };
}
