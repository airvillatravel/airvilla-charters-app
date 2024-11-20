"use client";
import AccountHubSidebar from "@/components/account-hub/AccountHubSidebar";
import ContactSupportAccountHub from "@/components/account-hub/ContactSupportAccountHub";
import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import React from "react";

export default function AccountHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectUser);
  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="capitalize">{(user as StoredUser).role}</span> Hub
          </h1>
        </div>
        <div className="flex flex-col md:flex-row dark:bg-gray-800 rounded-2xl shadow-2xl">
          <AccountHubSidebar />
          <div className="flex-grow p-3 md:p-8 bg-gray-100 dark:bg-transparent">
            {children}
            <ContactSupportAccountHub />
          </div>
        </div>
      </div>
    </div>
  );
}
