"use client";
import React, { useState } from "react";
import ModalBlank from "@/components/modal-blank";
import { MasterUserResultType } from "@/utils/definitions/masterDefinitions";

interface UserStatus {
  userId: string;
  status: string;
  value: string;
}

export default function RemoveUserFromMasterAlart({
  dangerModalOpen,
  setDangerModalOpen,
  setUserStatus,
  user,
}: {
  dangerModalOpen: boolean;
  setDangerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserStatus: React.Dispatch<React.SetStateAction<UserStatus>>;
  user: MasterUserResultType;
}) {
  /// ######## HANDLERS #############
  // handle Delete user by id
  const handleDeleteUser = async () => {
    // update the user states
    setUserStatus({ userId: user.id, status: "delete", value: "" });

    // close the alart window
    setDangerModalOpen(false);
  };

  return (
    <ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
      <div className="p-5 flex space-x-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
          <svg
            className="w-4 h-4 shrink-0 fill-current text-rose-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
          </svg>
        </div>
        {/* Content */}
        <div>
          {/* Modal header */}
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Remove User?
            </div>
          </div>
          {/* Modal content */}
          <div className="text-sm mb-10">
            <div className="space-y-2">
              <p>
                do you want to remove the user with email of{" "}
                <span className="text-red-600 font-bold">{user.email}</span>
              </p>
            </div>
          </div>
          {/* Modal footer */}
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              onClick={() => {
                setDangerModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
              onClick={handleDeleteUser}
            >
              Yes, Remove it
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
}
