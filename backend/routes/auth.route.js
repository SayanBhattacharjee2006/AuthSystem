import { Router } from "express";
import {
    signup,
    signin,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
    sendOtpController,
    verifyOtpController
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
export default router;
