"use client";
import { selectUser } from "@/redux/features/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProgressLoading from "../utils/ProgressLoading";
import useAffiliateUserAuth from "../hooks/useAffiliateUserAuth";
import TotalAvailableTickets from "./TotalAvailableTickets";
import useMasterUserAuth from "../hooks/useMasterUserAuth";
import {
  fetchTotalTicketsForMaster,
  fetchTotalUsersForMaster,
} from "@/lib/data/MasterDashboardData";
import { setMsg } from "@/redux/features/ActionMsgSlice";
import TotalUsers from "./TotalUsers";
import WelcomeBanner from "./WelcomeBanner";

const DashboardSection = () => {
  // total available tickets
  const [totalAvailableTickets, setTotalAvailableTickets] = useState("0");
  const [totalAvailableTicketsLoading, setTotalAvailableTicketsLoading] =
    useState(true);

  // total users
  const [totalUsers, setTotalUsers] = useState({
    agency: "0",
    affiliate: "0",
  });
  const [totalUsersLoading, setTotalUsersLoading] = useState(true);

  // hooks
  const dispatch = useAppDispatch();

  // FUNCTIONS --------------------------------------------
  // Fetch total number of tickets
  const fetchTotalTickets = async (status: string = "all") => {
    // Set loading state to true
    setTotalAvailableTicketsLoading(true);

    // Fetch total number of tickets from the master dashboard
    const data = await fetchTotalTicketsForMaster(status);

    // If the request was successful and data is returned
    if (data.success && data.results) {
      // Update the total number of tickets
      setTotalAvailableTickets(data.results);
    }

    // If the request was not successful
    if (!data.success) {
      // Dispatch an action to set the error message
      dispatch(setMsg({ message: data.message, success: data.success }));
    }

    // Set loading state to false
    setTotalAvailableTicketsLoading(false);
  };

  // Fetch total number of users
  const fetchTotalUsers = async (status: string = "all") => {
    // Set loading state to true
    setTotalUsersLoading(true);

    // Fetch total number of tickets from the master dashboard
    const agencyData = await fetchTotalUsersForMaster("agency", "accepted");
    const affiliateData = await fetchTotalUsersForMaster(
      "affiliate",
      "accepted"
    );

    // If the request was successful and data is returned
    if (
      agencyData.success &&
      agencyData.results &&
      affiliateData.success &&
      affiliateData.results
    ) {
      // Update the total number of tickets
      setTotalUsers({
        agency: agencyData.results,
        affiliate: affiliateData.results,
      });
    }

    // If the request was not successful
    if (!agencyData.success && agencyData.message) {
      // Dispatch an action to set the error message
      dispatch(
        setMsg({ message: agencyData.message, success: agencyData.success })
      );
    }

    if (!affiliateData.success && affiliateData.message) {
      // Dispatch an action to set the error message
      dispatch(
        setMsg({
          message: affiliateData.message,
          success: affiliateData.success,
        })
      );
    }
    // Set loading state to false
    setTotalUsersLoading(false);
  };

  // SIDE EFFECTS -----------------------------------------
  useEffect(() => {
    // Fetch total number of tickets
    fetchTotalTickets("available");
  }, []);

  useEffect(() => {
    // Fetch total number of users
    fetchTotalUsers();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-8 w-full max-w-7xl mx-auto">
      {/* section header */}
      <WelcomeBanner />
      {/* total available tickets */}
      <div className="grid grid-cols-12 gap-6">
        <TotalAvailableTickets
          totalAvailableTickets={totalAvailableTickets}
          loading={totalAvailableTicketsLoading}
        />

        {/* total agency users */}
        <TotalUsers
          totalUsers={totalUsers.agency}
          role="agency"
          loading={totalUsersLoading}
        />

        {/* total affiliate users */}
        <TotalUsers
          totalUsers={totalUsers.affiliate}
          role="affiliate"
          loading={totalUsersLoading}
        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const loading = useMasterUserAuth();

  if (loading) {
    return <ProgressLoading />;
  }

  return <DashboardSection />;
}
