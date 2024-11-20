"use client";
import { selectUser } from "@/redux/features/AuthSlice";
import { useAppSelector } from "@/redux/hooks";
import { StoredUser } from "@/utils/definitions/authDefinitions";
import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
}

// Export a custom hook useSocket that allows components to access the context value:
const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useAppSelector(selectUser);
  const userInfo = user as StoredUser;

  useEffect(() => {
    // Initialize the WebSocket connection
    const socketIo = io(process.env.SERVER_URL || "http://localhost:3000", {
      withCredentials: true,
    });

    // Join the user-specific room after the connection is established
    socketIo.on("connect", () => {
      if (userInfo && userInfo.id) {
        socketIo.emit("joinRoom", userInfo.id); // Emit an event to join the user's room
        console.log(`Joined room with ID: ${userInfo.id}`);
      }
    });

    // Handle disconnection
    socketIo.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(socketIo);

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
