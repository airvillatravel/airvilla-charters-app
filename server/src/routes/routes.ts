import { Router } from "express";
import user from "./user";
import ticket from "./ticket";
import auth from "./auth";
import master from "./master";
import dev from "./dev";
import team from "./team";
import invitation from "./invitation";
import { submitFeedback } from "../controllers/feedbackControllar";
import userAuth from "../middlewares/userAuth";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.use("/user", user);
router.use("/ticket", ticket);
router.use("/auth", auth);
router.use("/master", master);
router.use("/dev", dev);
router.use("/team", team);
router.use("/invitation", invitation);
router.post(
  "/submit-feedback",
  userAuth,
  upload.array("files"),
  submitFeedback
);

export default router;
