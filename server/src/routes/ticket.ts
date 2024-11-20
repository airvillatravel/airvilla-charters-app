import { Router } from "express";
const router = Router();

import userAuth from "../middlewares/userAuth";
import {
  getAllTickets,
  getSingleTicket,
  searchTickets,
} from "../controllers/getTicketController";
import {
  createTicket,
  updateTicket,
} from "../controllers/userCreateTicketController";

router.use(userAuth);

// filter and search
router.post("/search", searchTickets);

// // get a ticket/tickets
router.get("/", getAllTickets);
router.get("/:ticketId", getSingleTicket);

// create and update a ticket
router.post("/new", createTicket);
router.put("/:ticketId", updateTicket);

export default router;
