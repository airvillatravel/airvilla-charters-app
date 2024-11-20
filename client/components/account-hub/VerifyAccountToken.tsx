"use client";
import { loginUser, selectUser } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import ProgressLoading from "../utils/ProgressLoading";
import { fetchUpdateUserEmailVerify } from "@/lib/data/userProfileData";
import { UserProfileResType } from "@/utils/definitions/userProfileDefinitions";

const VerifyAccount = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<UserProfileResType | {}>({});
  const router = useRouter();
  const dispatch = useAppDispatch();

  // verify email
  const verfyUpdateEmail = async () => {
    setLoading(true);
    const updateEmail = await fetchUpdateUserEmailVerify(token);

    if (updateEmail.success) {
      dispatch(loginUser(updateEmail.results));
      router.push("/account-hub/account-overview");
    }

    setResults(updateEmail);

    setLoading(false);
  };

  useEffect(() => {
    verfyUpdateEmail();
  }, [token]);

  if (loading) {
    return <ProgressLoading />;
  }
  return (
    <div className="w-full h-[80hv] flex justify-center items-center">
      {!(results as UserProfileResType).success === false && (
        <div className="text-center text-red-500 font-semibold">
          Something went wrong, please try again later or send a new request!!{" "}
        </div>
      )}
      {!results && (
        <div className="text-center text-salte-500 text-xl font-bold">
          verfying...
        </div>
      )}
    </div>
  );
};

export default function VerifyAccountToken({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!user.isLogin) {
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <ProgressLoading />;
  }

  return <VerifyAccount token={token} />;
}
