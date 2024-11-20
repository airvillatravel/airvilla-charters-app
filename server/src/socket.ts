import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import cookie from "cookie";
import jwt from "jsonwebtoken";

interface CustomSocket extends Socket {
  userId?: string;
}

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_DOMAINS?.split(","),
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log("A user connected");

    try {
      // parse the cookies from the handshake headers
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.token; // get the accessToken

      if (!token) {
        // If there is no access token in cookies, check inside the handshake auth
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        socket.emit(
          "error",
          "Sorry, there was an error connecting to the server. Please try again later."
        );
        socket.disconnect(); // Disconnect the client
        return;
      }

      // decode the access token
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        throw new Error("Secret key not provided");
      }

      const decoded = jwt.verify(token, secretKey) as { id: string };

      socket.userId = decoded.id;
      socket.join(decoded.id);
      console.log("User connected yay -> userId: ", decoded.id);

      socket.on("disconnect", () => {
        console.log("user has disconnected 🚫. userId: ", decoded.id);
        if (socket.userId) {
          socket.leave(socket.userId);
        }
      });
    } catch (error) {
      console.error("Error during connection:", error);
      socket.emit(
        "error",
        "Sorry, there was an error connecting to the server. Please try again later."
      );
      socket.disconnect(); // Disconnect the client
    }
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
