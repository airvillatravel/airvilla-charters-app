"use client";

import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
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

export default function MasterUsersSettingsSidebar({
  userId,
}: {
  userId: string;
}) {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  const pages = [
    {
      href: `/master-control/users/${userId}/account`,
      name: `Account Overview`,
      icon: <Building size={18} />,
      role: ["all"],
    },
  ];

  return (
    <div className="flex flex-nowrap shadow-2xl bg-white dark:bg-gray-700 w-full md:w-64 rounded-l-2xl p-4 md:p-6 overflow-x-scroll no-scrollbar md:block md:overflow-auto  border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 min-w-[15rem] md:space-y-3">
      <ul className="flex flex-nowrap md:block mr-3 md:mr-0">
        {/* Account */}
        {pages.map((page) => (
          <li key={page.href} className="mr-0.5 md:mr-0 md:mb-0.5">
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
        ))}
      </ul>
    </div>
  );
}
