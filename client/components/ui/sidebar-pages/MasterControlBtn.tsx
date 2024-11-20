"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import SidebarLinkGroup from "../sidebar-link-group";
import SidebarLink from "../sidebar-link";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import MasterControlSvg from "./MasterControlSvg";

const MasterControlBtn = ({
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

  // if user is affiliate don't show the flightLost button
  if (user.role !== "master" || user.accountStatus !== "accepted") return;

  return (
    <SidebarLinkGroup open={segments.includes("master-control")}>
      {(handleClick, open) => {
        return (
          <>
            <a
              href="#0"
              className={`block text-slate-200 truncate transition duration-150 ${
                segments.includes("master-control")
                  ? "hover:text-slate-200"
                  : "hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                expandOnly ? setSidebarExpanded(true) : handleClick();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-red-500">
                    {/* <MasterControlSvg segments={segments} /> */}
                    <svg
                      viewBox="0 0 1024 1024"
                      fill="currentColor"
                      className="shrink-0 h-6 w-7"
                    >
                      <path
                        className={`fill-current ${
                          segments.includes("master-control")
                            ? "text-red-500"
                            : "text-slate-400"
                        }`}
                        d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM404 683v77c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-77c-41.7-13.6-72-52.8-72-99s30.3-85.5 72-99V264c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v221c41.7 13.6 72 52.8 72 99s-30.3 85.5-72 99zm279.6-143.9c.2 0 .3-.1.4-.1v221c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V539c.2 0 .3.1.4.1-42-13.4-72.4-52.7-72.4-99.1 0-46.4 30.4-85.7 72.4-99.1-.2 0-.3.1-.4.1v-77c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v77c-.2 0-.3-.1-.4-.1 42 13.4 72.4 52.7 72.4 99.1 0 46.4-30.4 85.7-72.4 99.1zM616 440a36 36 0 1072 0 36 36 0 10-72 0zM403.4 566.5l-1.5-2.4c0-.1-.1-.1-.1-.2l-.9-1.2c-.1-.1-.2-.2-.2-.3-1-1.3-2-2.5-3.2-3.6l-.2-.2c-.4-.4-.8-.8-1.2-1.1-.8-.8-1.7-1.5-2.6-2.1h-.1l-1.2-.9c-.1-.1-.3-.2-.4-.3-1.2-.8-2.5-1.6-3.9-2.2-.2-.1-.5-.2-.7-.4-.4-.2-.7-.3-1.1-.5-.3-.1-.7-.3-1-.4-.5-.2-1-.4-1.5-.5-.4-.1-.9-.3-1.3-.4l-.9-.3-1.4-.3c-.2-.1-.5-.1-.7-.2-.7-.1-1.4-.3-2.1-.4-.2 0-.4 0-.6-.1-.6-.1-1.1-.1-1.7-.2-.2 0-.4 0-.7-.1-.8 0-1.5-.1-2.3-.1s-1.5 0-2.3.1c-.2 0-.4 0-.7.1-.6 0-1.2.1-1.7.2-.2 0-.4 0-.6.1-.7.1-1.4.2-2.1.4-.2.1-.5.1-.7.2l-1.4.3-.9.3c-.4.1-.9.3-1.3.4-.5.2-1 .4-1.5.5-.3.1-.7.3-1 .4-.4.2-.7.3-1.1.5-.2.1-.5.2-.7.4-1.3.7-2.6 1.4-3.9 2.2-.1.1-.3.2-.4.3l-1.2.9h-.1c-.9.7-1.8 1.4-2.6 2.1-.4.4-.8.7-1.2 1.1l-.2.2a54.8 54.8 0 00-3.2 3.6c-.1.1-.2.2-.2.3l-.9 1.2c0 .1-.1.1-.1.2l-1.5 2.4c-.1.2-.2.3-.3.5-2.7 5.1-4.3 10.9-4.3 17s1.6 12 4.3 17c.1.2.2.3.3.5l1.5 2.4c0 .1.1.1.1.2l.9 1.2c.1.1.2.2.2.3 1 1.3 2 2.5 3.2 3.6l.2.2c.4.4.8.8 1.2 1.1.8.8 1.7 1.5 2.6 2.1h.1l1.2.9c.1.1.3.2.4.3 1.2.8 2.5 1.6 3.9 2.2.2.1.5.2.7.4.4.2.7.3 1.1.5.3.1.7.3 1 .4.5.2 1 .4 1.5.5.4.1.9.3 1.3.4l.9.3 1.4.3c.2.1.5.1.7.2.7.1 1.4.3 2.1.4.2 0 .4 0 .6.1.6.1 1.1.1 1.7.2.2 0 .4 0 .7.1.8 0 1.5.1 2.3.1s1.5 0 2.3-.1c.2 0 .4 0 .7-.1.6 0 1.2-.1 1.7-.2.2 0 .4 0 .6-.1.7-.1 1.4-.2 2.1-.4.2-.1.5-.1.7-.2l1.4-.3.9-.3c.4-.1.9-.3 1.3-.4.5-.2 1-.4 1.5-.5.3-.1.7-.3 1-.4.4-.2.7-.3 1.1-.5.2-.1.5-.2.7-.4 1.3-.7 2.6-1.4 3.9-2.2.1-.1.3-.2.4-.3l1.2-.9h.1c.9-.7 1.8-1.4 2.6-2.1.4-.4.8-.7 1.2-1.1l.2-.2c1.1-1.1 2.2-2.4 3.2-3.6.1-.1.2-.2.2-.3l.9-1.2c0-.1.1-.1.1-.2l1.5-2.4c.1-.2.2-.3.3-.5 2.7-5.1 4.3-10.9 4.3-17s-1.6-12-4.3-17c-.1-.2-.2-.4-.3-.5z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                    Master Control
                  </span>
                </div>
                {/* Icon */}
                <div className="flex shrink-0 ml-2">
                  <svg
                    className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                      open && "rotate-180"
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </div>
            </a>
            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
              <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                <li className="mb-1 last:mb-0">
                  <SidebarLink href="/master-control/users">
                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                      users
                    </span>
                  </SidebarLink>
                </li>
                <li className="mb-1 last:mb-0">
                  <SidebarLink href="/master-control/team-management">
                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                      Team Management
                    </span>
                  </SidebarLink>
                </li>
                <li className="mb-1 last:mb-0">
                  <SidebarLink href="/master-control/ticket-requests">
                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                      Ticket Requests
                    </span>
                  </SidebarLink>
                </li>
                <li className="mb-1 last:mb-0">
                  <SidebarLink href="/master-control/tickets-overview">
                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                      Tickets Overview
                    </span>
                  </SidebarLink>
                </li>
              </ul>
            </div>
          </>
        );
      }}
    </SidebarLinkGroup>
  );
};

export default MasterControlBtn;
