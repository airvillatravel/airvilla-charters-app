"use client";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AccountAcceptorListener = () => {
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.on("userRequestResponse", (res) => {
        if (res.accountStatus === "accepted") {
          router.push("/blockseats");
          return;
        }

        if (res.accountStatus === "rejected") {
          router.push("/signup-process/not-accepted");
          return;
        }
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("userRequestResponse");
      }
    };
  }, [socket]);

  return null; // This component doesn't need to render anything
};

export default AccountAcceptorListener;
