import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import EditMenu from "@/components/edit-menu";
import { MasterUserResultType } from "@/utils/definitions/masterDefinitions";
import avatarPlaceholder from "@/public/images/placeholders/profile-placeholder.jpg";
import { GiCheckMark } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";
import MasterUsersCardEditBtn from "./MasterUsersCardEditBtn";
import RemoveUserFromMasterAlart from "./RemoveUserFromMasterAlart";
import React, { Suspense, useState } from "react";
import { IoMdEye } from "react-icons/io";
import ListLoading from "@/components/flight-tickets/myTickets/ListLoading";

interface UserStatus {
  userId: string;
  status: string;
  value: string;
}

function UsersCard({
  user,
  setUserStatus,
}: {
  user: MasterUserResultType;
  setUserStatus: React.Dispatch<React.SetStateAction<UserStatus>>;
}) {
  const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);

  return (
    <div className="relative flex flex-col h-full">
      <RemoveUserFromMasterAlart
        dangerModalOpen={dangerModalOpen}
        setDangerModalOpen={setDangerModalOpen}
        setUserStatus={setUserStatus}
        user={user}
      />
      {/* Card top */}
      <div className="grow p-5">
        {/* Menu button */}
        <div className="relative">
          <div className="absolute top-0 right-0">
            <MasterUsersCardEditBtn
              userId={user.id}
              align="right"
              setDangerModalOpen={setDangerModalOpen}
            />
          </div>
        </div>
        {/* Image + name */}
        <header>
          <div className="flex justify-center mb-2">
            <Link
              className="relative inline-flex items-start"
              href={`/master-control/users/${user.id}/account`}
            >
              <div
                className="absolute top-0 right-0 -mr-2 bg-white dark:bg-slate-700 rounded-full shadow"
                aria-hidden="true"
              >
                {/* <svg
                  className="w-8 h-8 fill-current text-amber-500"
                  viewBox="0 0 32 32"
                >
                  <path d="M21 14.077a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 010 1.5 1.5 1.5 0 00-1.5 1.5.75.75 0 01-.75.75zM14 24.077a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z" />
                </svg> */}
              </div>
              <Image
                className="rounded-full w-16 h-16 object-cover"
                src={user.avatar || avatarPlaceholder}
                width={64}
                height={64}
                alt={user.firstName}
              />
            </Link>
          </div>
          <div className="text-center">
            <Link
              className="inline-flex text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white"
              href={`/master-control/users/${user.id}/account`}
            >
              <h2 className="text-xl leading-snug justify-center font-semibold">
                {`${user.firstName} ${user.lastName}`}
              </h2>
            </Link>
          </div>
          <div className="flex justify-center items-center">
            <span className="text-sm font-medium text-slate-400 -mt-0.5 mr-1">
              -&gt;
            </span>{" "}
            <span>{user.role}</span>
          </div>
        </header>
        {/* Bio */}
        <div className="text-center mt-2">
          <div className="text-sm">{user.email}</div>
        </div>
      </div>
      {/* Card footer */}
      <div className="border-t border-slate-200 dark:border-slate-700">
        {/* {user.accountStatus === "pending" && (
          <div className="flex divide-x divide-slate-200 dark:divide-slate-700">
            <button
              className="block flex-1 text-center text-sm text-green-600 hover:text-green-700 dark:hover:text-green-500 px-3 py-4 font-bold"
              onClick={() =>
                setUserStatus({
                  userId: user.id,
                  status: "update",
                  value: "accepted",
                })
              }
            >
              <div className="flex items-center justify-center">
                <span className="w-4 h-4 fill-current shrink-0 mr-2">
                  <GiCheckMark />
                </span>
                <span>Accept</span>
              </div>
            </button>
            <button
              className="block flex-1 text-center text-sm text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200 font-bold px-3 py-4 group"
              onClick={() =>
                setUserStatus({
                  userId: user.id,
                  status: "update",
                  value: "rejected",
                })
              }
            >
              <div className="flex items-center justify-center">
                <span className="w-4 h-4 text-lg fill-current  shrink-0 mr-2">
                  <FaXmark />
                </span>
                <span>Reject</span>
              </div>
            </button>
          </div>
        )} */}

        {user.accountStatus === "pending" && (
          <div className="border-t border-slate-200 dark:border-slate-700">
            <Link
              className="block text-center  text-slate-600 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-500 font-medium px-3 py-4"
              href={`/master-control/users/${user.id}/account`}
            >
              <div className="flex items-center justify-center">
                <IoMdEye />
                <span className="ml-1">View Profile</span>
              </div>
            </Link>
          </div>
        )}
        {user.accountStatus === "accepted" && (
          <div className="border-t border-slate-200 dark:border-slate-700">
            <Link
              className="block text-center text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium px-3 py-4"
              href="/"
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 fill-current shrink-0 mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                </svg>
                <span>Send Message</span>
              </div>
            </Link>
          </div>
        )}
        {user.accountStatus === "rejected" && (
          <div className="border-t border-slate-200 dark:border-slate-700">
            <div className="block text-center text-sm text-salte-500 hover:text-salte-600 dark:hover:text-salte-400 font-medium px-3 py-4">
              <div className="flex items-center justify-center">
                <span>Rejected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MasterUsersCard = React.memo(UsersCard);
export default MasterUsersCard;
