import { Router } from "express";
import {
  createTeamMember,
  getTeamMembers,
  removeTeamMember,
  resendInvitation,
  getTeamId,
  searchTeamMembers,
  updateTeamMember,
} from "../controllers/teamController";

const router = Router();

import userAuth from "../middlewares/userAuth";

// router.use(userAuth);

router.get("/id", getTeamId);
router.post("/members", createTeamMember);
router.put("/members/:id", updateTeamMember);
router.get("/members", getTeamMembers);
router.get("/members/search", searchTeamMembers);
router.delete("/members/:id", removeTeamMember);
router.post("/invitations/resend", resendInvitation);

export default router;
