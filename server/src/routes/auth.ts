import { Router } from "express";
const router = Router();
import {
  signup,
  login,
  logout,
  emailVerify,
  sendEmailVerification,
  sendResetPassword,
  resetPassword,
} from "../controllers/authController";
import { loginRateLimit } from "../middlewares/rateLimit";
import userAuth from "../middlewares/userAuth";

// auth routes
router.post("/signup", signup);
router.post(
  "/login",
  // loginRateLimit,
  login
);
router.get("/logout", userAuth, logout);

// email verification
router.get("/email/verify/:token", emailVerify);

// send verification email
router.get("/email/sendVerification", userAuth, sendEmailVerification);

// send reset password request email
router.post("/password/reset", sendResetPassword);
// reset password
router.put("/password/reset/:token", resetPassword);

export default router;
