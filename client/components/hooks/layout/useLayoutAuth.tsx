import { useEffect, useState } from "react";
import { detectIncognito } from "detectincognitojs";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser, selectUser } from "@/redux/features/AuthSlice";
import { fetchUserProfile } from "@/lib/data/userProfileData";
import { useRouter } from "next/navigation";

export default function useLayoutAuth() {
  // states
  const [isPrivateMode, setIsPrivateMode] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // hooks
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // functions
  // Fetch user info from the server
  const fetchUserInfo = async (): Promise<void> => {
    setLoading(true);

    // Fetch user info from the server
    const userInfo = await fetchUserProfile();

    // If the fetch was successful and the user info is present, update the state
    if (userInfo.success && userInfo.results) {
      dispatch(loginUser(userInfo.results));
      router.push("/blockseats");
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    // check if the user is in private mode
    const detectPrivateMode = async () => {};
    detectIncognito().then((result) => {
      console.log(result.browserName, result.isPrivate);
      setIsPrivateMode(result.isPrivate);
    });
    detectPrivateMode();
    fetchUserInfo();
  }, []);

  return { loading, isPrivateMode };
}
