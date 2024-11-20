"use client";
import React, { useEffect, useState } from "react";
import SidebarLink from "../sidebar-link";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";

const DashboardBtn = ({
  setSidebarExpanded,
  segments,
  expandOnly,
}: {
  segments: string[];
  expandOnly: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const usertype = useAppSelector(selectUser);
  const user = usertype as StoredUser;
  const [loading, setLoading] = useState(true);

  // to not show anything intill user is loaded
  useEffect(() => {
    setLoading(false);
  });
  if (loading) return;

  // if user is affiliate don't show the flightLost button
  if (
    !user.verified ||
    user.accountStatus !== "accepted" ||
    user.role !== "master"
  )
    return;

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
        segments.includes("dashboard") && "bg-slate-900"
      }`}
    >
      <SidebarLink href="/dashboard">
        <div className="flex items-center justify-between">
          <div className="grow flex items-center">
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path
                className={`fill-current ${
                  segments.includes("dashboard")
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
                d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
              />
              <path
                className={`fill-current ${
                  segments.includes("dashboard")
                    ? "text-red-600"
                    : "text-slate-600"
                }`}
                d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
              />
              <path
                className={`fill-current ${
                  segments.includes("dashboard")
                    ? "text-red-200"
                    : "text-slate-400"
                }`}
                d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
              dashboard
            </span>
          </div>
        </div>
      </SidebarLink>
    </li>
  );
};

export default DashboardBtn;
