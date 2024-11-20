"use client";

import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const useMasterUserAuth = () => {
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // redirect the user to signin page if not signed in
    if (!user.isLogin) {
      router.push("/signin");
      return;
    }

    // redirect the user to not verified page if not verified yet
    if (!(user as StoredUser).verified) {
      router.push("/signup-process/not-verified");
      return;
    }

    // redirect the user to not approved page if not approved yet
    if ((user as StoredUser).accountStatus !== "accepted") {
      router.push("/signup-process/not-accepted");
      return;
    }

    // redirect the user to home page if not master
    if ((user as StoredUser).role !== "master") {
      router.push("/blockseats");
      return;
    }

    setLoading(false);
  }, [user, router]);

  return loading;
};

export default useMasterUserAuth;
