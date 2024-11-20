"use client";
import React, { useEffect, useState } from "react";
import SidebarLink from "../sidebar-link";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";

const SupportBtn = ({
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
  if (!user.verified || user.accountStatus !== "accepted") return;

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
        segments.includes("support") && "bg-slate-900"
      }`}
    >
      <SidebarLink href="/support">
        <div className="flex items-center justify-between">
          <div className="grow flex items-center">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="1em"
              width="1em"
              className="shrink-0 h-6 w-6"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                className={`fill-current ${
                  segments.includes("support")
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
                d="M6.455 19L2 22.5V4a1 1 0 011-1h18a1 1 0 011 1v14a1 1 0 01-1 1H6.455zM11 13v2h2v-2h-2zm0-6v5h2V7h-2z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
              support
            </span>
          </div>
        </div>
      </SidebarLink>
    </li>
  );
};

export default SupportBtn;
