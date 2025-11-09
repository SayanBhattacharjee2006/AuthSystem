import { Router } from "express";
import { signup, signin, logout, verifyEmail } from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);

export default router;