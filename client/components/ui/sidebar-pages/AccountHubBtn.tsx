"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import SidebarLinkGroup from "../sidebar-link-group";
import SidebarLink from "../sidebar-link";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";

const AccountHubBtn = ({
  setSidebarExpanded,
  segments,
  expandOnly,
}: {
  segments: string[];
  expandOnly: boolean;
  setSidebarExpanded: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const usertype = useAppSelector(selectUser);
  const user = usertype as StoredUser;
  const [loading, setLoading] = useState(true);

  // to not show anything intill user is loaded
  useEffect(() => {
    setLoading(false);
  });
  if (loading) return;

  // if user is not logged in don't show the account button
  if (!user.isLogin) return;

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
        segments.includes("account-hub") && "bg-slate-900"
      }`}
    >
      <SidebarLink href="/account-hub/account-overview">
        <div className="flex items-center justify-between">
          <div className="grow flex items-center">
            <svg viewBox="0 0 24 24" className="shrink-0 h-6 w-7">
              <path
                className={`fill-current ${
                  segments.includes("account-hub")
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
                d="M20 20H4c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h16c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3zM4 6c-.551 0-1 .449-1 1v10c0 .551.449 1 1 1h16c.551 0 1-.449 1-1V7c0-.551-.449-1-1-1H4zm6 9H6a1 1 0 110-2h4a1 1 0 110 2zm0-4H6a1 1 0 110-2h4a1 1 0 110 2z"
              />
              <path
                className={`fill-current ${
                  segments.includes("account-hub")
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
                d="M18 10.5 A2 2 0 0 1 16 12.5 A2 2 0 0 1 14 10.5 A2 2 0 0 1 18 10.5 z"
              />
              <path
                className={`fill-current ${
                  segments.includes("account-hub")
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
                d="M16 13.356c-1.562 0-2.5.715-2.5 1.429 0 .357.938.715 2.5.715 1.466 0 2.5-.357 2.5-.715 0-.714-.98-1.429-2.5-1.429z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
              <span className="capitalize">{user.role}</span> Hub
            </span>
          </div>
        </div>
      </SidebarLink>
    </li>
  );
};

export default AccountHubBtn;
