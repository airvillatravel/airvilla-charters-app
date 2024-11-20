"use client";
import useAffiliateUserAuth from "@/components/hooks/useAffiliateUserAuth";
import ProgressLoading from "@/components/utils/ProgressLoading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const loading = useAffiliateUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.push("/blockseats");
    }
  }, [loading, router]);

  if (loading) {
    return <ProgressLoading />;
  }
}
