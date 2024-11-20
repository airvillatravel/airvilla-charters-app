import { Router } from "express";
const router = Router();
import {
  getAllUsers,
  getSingleUserById,
  deleteSingleUser,
  searchAllUsers,
  userAccountRequest,
  updateUserInfoForMaster,
  updateUserPasswordForMaster,
} from "../controllers/masterUsersController";
import userAuth from "../middlewares/userAuth";
import {
  deleteSingleMasterTicket,
  getAllMasterTickets,
  getSingleMasterTicket,
  updateTicketStatus,
  updateValidTicket,
} from "../controllers/masterTicketsController";
import {
  getAgencyNames,
  getTotalTickets,
  getTotalUsers,
} from "../controllers/masterDashboardController";

// authorize the user
router.use(userAuth);

// master dashboard
router.get("/tickets/total", getTotalTickets);
router.get("/users/total", getTotalUsers);
router.get("/agencyNames", getAgencyNames);

// master users
router.get("/users", getAllUsers);
router.get("/users/search", searchAllUsers);
router.get("/users/:userId", getSingleUserById);
router.put("/users/:userId", updateUserInfoForMaster);
router.put("/users/:userId/request", userAccountRequest);
router.put("/users/:userId/password", updateUserPasswordForMaster);
router.delete("/users/:userId", deleteSingleUser);

//master tickets
router.post("/tickets", getAllMasterTickets);
router.get("/tickets/:refId", getSingleMasterTicket);
router.put("/tickets/:refId/status", updateTicketStatus);
router.put("/tickets/:refId/valid", updateValidTicket);
router.delete("/tickets/:refId", deleteSingleMasterTicket);

export default router;
