import { Router } from "express";
import { createInvitation, updateInvitation, revokeInvitation,acceptInvitation } from "../controllers/invitationController";

const router = Router();

import userAuth from "../middlewares/userAuth";

// router.use(userAuth);

router.post('/invitations', createInvitation); // Create invitation
router.post("/accept", acceptInvitation);
router.put('/invitations/:id',  updateInvitation);// Update invitation status
router.delete('/invitations/:id', revokeInvitation);// Revoke invitation

export default router;
