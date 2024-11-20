"use client";

import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import {
  Building,
  HelpCircle,
  Shield,
  Users,
  CreditCard,
  Bell,
  FileText,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountHubSidebar() {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  const userInfo = user as StoredUser;
  const pages = [
    {
      href: "/account-hub/account-overview",
      name: `${userInfo.role} Overview`,
      icon: <Building size={18} />,
      role: ["all"],
    },
    {
      href: "/account-hub/organization-settings",
      name: "Team Management",
      icon: <Users size={18} />,
      role: ["agency"],
    },
    {
      href: "/account-hub/subscription-management",
      name: "Subscription & Billing",
      icon: <CreditCard size={18} />,
      role: ["agency"],
    },
    {
      href: "/account-hub/credit-balance",
      name: "Credit Balance",
      icon: <DollarSign size={18} />,
      role: ["affiliate", "agency"],
    },
    {
      href: "/account-hub/privacy-settings",
      name: "Privacy & Security",
      icon: <Shield size={18} />,
      role: ["all"],
    },
    {
      href: "/account-hub/notifications",
      name: "Notifications",
      icon: <Bell size={18} />,
      role: ["all"],
    },
    {
      href: "/account-hub/reports",
      name: "Reports",
      icon: <FileText size={18} />,
      role: ["all"],
    },
    {
      href: "/account-hub/help-support",
      name: "Help & Support",
      icon: <HelpCircle size={18} />,
      role: ["all"],
    },
  ];

  return (
    // <div className="flex dark:bg-gray-800 rounded-2xl shadow-2xl">
    <div className="flex flex-nowrap shadow-2xl bg-white dark:bg-gray-700 w-full md:w-64 rounded-t-2xl md:rounded-none md:rounded-l-2xl p-4 md:p-6 overflow-x-scroll no-scrollbar md:block md:overflow-auto  border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 min-w-[15rem] md:space-y-3">
      <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
        {/* Account */}
        {pages.map((page) =>
          (userInfo.role && page.role?.includes(userInfo.role)) ||
          page.role?.includes("all") ? (
            <li key={page.name} className="mr-0.5 md:mr-0 md:mb-0.5">
              <Link
                href={page.href}
                className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-300 flex items-center cursor-pointer text-slate-700 dark:text-slate-100 ${
                  pathname.includes(page.href)
                    ? " text-white bg-red-500"
                    : "hover:bg-gray-400 dark:hover:bg-gray-600"
                }`}
              >
                <span className="md:mr-3">{page.icon}</span>
                <span className="hidden md:block capitalize">{page.name}</span>
              </Link>
            </li>
          ) : (
            <></>
          )
        )}
      </ul>
    </div>
  );
}
