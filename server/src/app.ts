import "dotenv/config";
import express from "express";
import routes from "./routes/routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { createServer } from "http";
import { initSocket } from "./socket";
import "./utils/schedule/ticketStatusExpirationUpdater"; // check for any ticket that has expired date and make it unavailable
import "./utils/DatabaseUrl";
// PORT
const PORT = process.env.PORT || 3000;

// main app
const app = express();

// socket
const httpServer = createServer(app);
initSocket(httpServer);

// middleware

app.use(
  cors({
    origin: process.env.CLIENT_DOMAINS?.split(","),
    credentials: true,
  })
);
// app.use(express.json());
app.use(bodyParser.json({ limit: "500mb" })); // Set the limit for JSON payloads
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" })); // Set the limit for URL-encoded payloads
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", routes);

// if production is not test the run the server
if (process.env.NODE_ENV !== "test")
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
else console.log("test");
