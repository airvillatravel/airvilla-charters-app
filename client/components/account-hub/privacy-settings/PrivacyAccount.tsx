"use client";
import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import ProgressLoading from "../../utils/ProgressLoading";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PrivacyAccountPanel = dynamic(() => import("./PrivacyAccountPanel"), {
  loading: () => <ProgressLoading />,
});
export default function PrivacyAccount() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!user.isLogin) {
      router.push("/signin");
      return;
    }

    setLoading(false);
  }, [user]);

  if (loading) {
    return <ProgressLoading />;
  }
  return <PrivacyAccountPanel />;
}
