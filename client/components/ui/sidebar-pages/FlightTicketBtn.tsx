"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import SidebarLinkGroup from "../sidebar-link-group";
import FlightTicketSvg from "./flight-ticket-svg";
import SidebarLink from "../sidebar-link";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/AuthSlice";
import { StoredUser } from "@/utils/definitions/authDefinitions";

const FlightTicketBtn = ({
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
  if (user.role === "affiliate" || user.accountStatus !== "accepted") return;

  return (
    <SidebarLinkGroup open={segments.includes("flight-tickets")}>
      {(handleClick, open) => {
        return (
          <>
            <a
              href="#0"
              className={`block text-slate-200 truncate transition duration-150 ${
                segments.includes("flight-tickets")
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
                    {/* <FlightTicketSvg segments={segments} /> */}
                    <svg
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="shrink-0 h-6 w-7"
                    >
                      <path
                        className={`fill-current ${
                          segments.includes("flight-tickets")
                            ? "text-red-500"
                            : "text-slate-400"
                        }`}
                        d="M426.24 127.72l-10.94 10.94a29.67 29.67 0 01-42-42l10.94-10.94L314.52 16l-88 88-4 12.09-12.09 4L16 314.52l69.76 69.76 10.94-10.94a29.67 29.67 0 0142 42l-10.94 10.94L197.48 496l194.4-194.4 4-12.09 12.09-4 88-88zm-208.56 5.43l21.87-21.87 33 33-21.88 21.87zm43 43l21.88-21.88 32.52 32.52-21.88 21.88zm42.56 42.56l21.88-21.88 32.52 32.52-21.84 21.93zm75.57 75.56l-33-33 21.87-21.88 33 33z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                    flight tickets
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
                  <SidebarLink href="/flight-tickets/myTickets">
                    <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
                      My Tickets
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

export default FlightTicketBtn;
