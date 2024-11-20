import { Router } from "express";
const router = Router();
import {
  deleteUserInfo,
  getUserInfo,
  updateUserEmail,
  updateUserInfo,
  updateUserPassword,
  verifyUpdatedEmail,
} from "../controllers/userController";
import {
  deleteUsersTicket,
  getAllUsersTickets,
  getSingleUsersTicket,
  updateTicketStatus,
  updateValidTicket,
  withdrawUpdateReqValidTicket,
} from "../controllers/userTicketController";
import userAuth from "../middlewares/userAuth";

// auth the user and login
router.use(userAuth);

// get and update profile
router.get("/profile", getUserInfo);
router.put("/profile", updateUserInfo);
router.post("/profile/delete", deleteUserInfo);
router.post("/email", updateUserEmail);
router.get("/email/verify/:token", verifyUpdatedEmail);
router.put("/password", updateUserPassword);

// user tickets
router.post("/tickets", getAllUsersTickets);
router.get("/tickets/:ticketId", getSingleUsersTicket);
router.put("/tickets/:refId/status", updateTicketStatus);
router.put("/tickets/:refId/update_request", updateValidTicket);
router.get(
  "/tickets/:refId/update_request/withdraw",
  withdrawUpdateReqValidTicket
);
router.delete("/tickets/:ticketId", deleteUsersTicket);

export default router;
