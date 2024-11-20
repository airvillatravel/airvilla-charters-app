"use client";
import React, { useState } from "react";
import ModalBlank from "@/components/modal-blank";
import { UserMinus, UserPlus, X } from "lucide-react";

export default function AlertWindow({
  title,
  content,
  yesBtnText,
  noBtnText,
  handleYesBtnClick,
  dangerModalOpen,
  setDangerModalOpen,
}: {
  title: string;
  content: string;
  yesBtnText: string;
  noBtnText: string;
  handleYesBtnClick: () => void;
  dangerModalOpen: boolean;
  setDangerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              {yesBtnText === "accept" ? (
                <UserPlus size={48} className="text-blue-500" />
              ) : (
                <UserMinus size={48} className="text-red-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-center dark:text-white mb-4 capitalize">
              {title}
            </h3>
            <p className="dark:text-gray-300 text-center mb-6">{content}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setDangerModalOpen(false);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
              >
                <X size={18} className="mr-2" />
                {noBtnText}
              </button>
              <button
                onClick={handleYesBtnClick}
                className="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center capitalize"
              >
                {yesBtnText === "accept" ? (
                  <UserPlus size={18} className="mr-2" />
                ) : (
                  <UserMinus size={18} className="mr-2" />
                )}
                {yesBtnText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
}
