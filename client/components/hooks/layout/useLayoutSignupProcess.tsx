import { fetchLogout } from "@/lib/data/authData";
import { fetchUserProfile } from "@/lib/data/userProfileData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import { loginUser, logoutUser, selectUser } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useLayoutSignupProcess() {
  // redux
  const user = useAppSelector(selectUser);
  // hooks
  const router = useRouter();
  const dispatch = useAppDispatch();

  // states
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true); // To track user info loading

  // functions

  // handle logout function
  const handleLogout = async () => {
    setLoading(true);
    // clean all cookies
    const logout = await fetchLogout();

    // remove all cookies & set isLogin to false
    if (logout?.success) dispatch(logoutUser());

    // send a success msg
    if (logout?.success) {
      // redirect to login page
      router.push("/signin");
    }

    dispatch(setMsg({ success: logout.success, message: logout.message }));

    setLoading(false);
  };

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      // if (user.isLogin) {
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
    // };

    fetchUserInfo();
  }, []);

  // Redirect to signin page if already not logged in
  useEffect(() => {
    if (userLoading) return;

    if (
      user.isLogin &&
      (user as StoredUser).verified &&
      (user as StoredUser).accountStatus === "accepted"
    ) {
      router.push("/");
      return;
    }

    setLoading(false);
  }, [user, router]);

  return { loading, handleLogout };
}
