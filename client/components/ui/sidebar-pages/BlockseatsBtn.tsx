"use client";
import React, { useEffect, useState } from "react";
import SidebarLink from "../sidebar-link";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";

const BlockseatsBtn = ({
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
        segments.includes("blockseats") && "bg-slate-900"
      }`}
    >
      <SidebarLink href="/blockseats">
        <div className="flex items-center justify-between">
          <div className="grow flex items-center">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              viewBox="0 0 500 500"
              width={24}
              height={24}
            >
              <path
                className={`fill-current ${
                  segments.includes("blockseats")
                    ? "text-red-600"
                    : "text-slate-600"
                }`}
                fill="currentColor"
                d="M20 89.9v10l27 .3 27 .3 2.7 2.8 2.8 2.7.3 67 .3 67H78c-1.2 0-3.5 1.3-5.1 2.9l-2.9 2.9V290H20v20h64.2l2.9-2.9 2.9-2.9V260h10v80H20v20h42.5c37.3 0 43-.2 45.8-1.6 4.5-2.3 7.6-5.3 9.8-9.6 1.8-3.5 1.9-6.5 1.9-53.3v-49.7l-2.9-2.9c-2.7-2.7-3.5-2.9-10-2.9H100v-67.8c0-78.2.5-73.9-8.9-83.3C82.5 80.3 81 80 47.8 80H20zm159-8.2c-2.8 1-6.6 3.7-10.1 7.2-9.3 9.3-8.9 6.4-8.9 73.1v57.7l13.3.5c15.5.6 20.9 2.3 27.5 9.1 7.5 7.6 8.6 11.6 9 32.4l.4 18.3h79.6l.4-18.3c.4-20.8 1.5-24.8 9-32.4 6.6-6.8 12-8.5 27.6-9.1l13.2-.5V162c0-66.7.4-63.8-8.9-73.1-9.4-9.4-5.3-8.9-81.5-8.8-57.7 0-66.7.3-70.6 1.6m240 0c-2.8 1-6.6 3.7-10.1 7.2-9.4 9.4-8.9 5.1-8.9 83.3V240h-7.1c-6.5 0-7.3.2-10 2.9l-2.9 2.9v49.7c0 46.8.1 49.8 1.9 53.3 2.2 4.3 5.3 7.3 9.8 9.6 2.8 1.4 8.5 1.6 45.8 1.6H480v-20h-80v-80h10v44.2l2.9 2.9 2.9 2.9H480v-20h-50v-44.2l-2.9-2.9c-1.6-1.6-3.9-2.9-5.1-2.9h-2.1l.3-67 .3-67 2.8-2.7 2.7-2.8 27-.3 27-.3V80l-28.2.1c-23.1 0-29.1.3-32.8 1.6"
              />
              <path
                className={`fill-current ${
                  segments.includes("blockseats")
                    ? "text-red-600"
                    : "text-slate-600"
                }`}
                fill="currentColor"
                d="m142.9 242.9-2.9 2.9v49.9c0 49.7 0 49.8 2.3 53.7 1.2 2.2 3.9 5.3 6 7l3.9 3.1 96.6.2 96.7.3 3.9-2.3c2.2-1.2 5.3-3.9 7-6l3.1-3.9.3-50.9.3-51-3-3-2.9-2.9h-38.4l-2.9 2.9-2.9 2.9V300H190v-54.2l-2.9-2.9-2.9-2.9h-38.4zM70 373.8c0 3.5 3.7 19.9 5.5 24.4.7 1.7-1 1.8-27.4 1.8H20v20h74.2l2.9-2.9c3.7-3.8 3.7-6.5-.2-20-1.7-5.8-3.9-14.2-4.8-18.6l-1.8-8-10.1-.3-10.2-.3zm99.7-3.1c-.2.5-.8 3-1.2 5.7-.3 2.6-2.4 10.9-4.6 18.2-4.7 16.3-4.8 18.6-1 22.5l2.9 2.9h168.4l2.9-2.9c3.8-3.9 3.7-6.3-.7-21.3-2-6.6-4.1-15.1-4.8-18.7l-1.2-6.6-80.1-.3c-44.1-.1-80.4.1-80.6.5m240 0c-.3.5-.8 2.8-1.2 5.3s-2.5 10.7-4.6 18.3c-4.7 16.7-4.8 18.9-1 22.8l2.9 2.9H480v-20h-28.1c-26.4 0-28.1-.1-27.4-1.8 1.8-4.4 5.5-20.9 5.5-24.3V370h-9.9c-5.5 0-10.2.3-10.4.7"
              />
            </svg> */}
            <svg viewBox="0 0 24 24" className="shrink-0 h-6 w-7">
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                className={`fill-current ${
                  segments.includes("blockseats")
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
                d="M10.478 11.632L5.968 4.56l1.931-.518 6.951 6.42 5.262-1.41a1.5 1.5 0 01.776 2.898L5.916 15.96l-.776-2.898.241-.065 2.467 2.445-2.626.704a1 1 0 01-1.133-.48L1.466 10.94l1.449-.388 2.466 2.445 5.097-1.366zM4 19h16v2H4v-2z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
              blockseats
            </span>
          </div>
        </div>
      </SidebarLink>
    </li>
  );
};

export default BlockseatsBtn;
