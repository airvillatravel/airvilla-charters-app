import React from "react";
import { OverlayProps } from "@/utils/definitions/blockseatsDefinitions";

export const Overlay = ({ isOpen, onClick }: OverlayProps) => {
  return isOpen ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-10"
      onClick={onClick}
    />
  ) : null;
};
