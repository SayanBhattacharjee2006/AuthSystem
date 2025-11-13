import User from "../../backend/models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../../backend/utils/generateTokenAndSetCookie.js";
import crypto from "crypto";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail
} from "../../backend/mailtrap/emails.js";
import { sendOTP,verifyOTP } from "../utils/twilio.js"; 


export const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !name || !password) {
            return res
                .status(400)
                .json({ message: "Please enter all the fields" });
        }

        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res
                .status(400)
                .json({ success: false, message: "User already exist" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        const verificationExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        const user = await User.create({
            email,
            name,
            password: hashedPassword,
            verificationToken,
            verificationExpiresAt,
        });

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await bcryptjs.compare(
            password,
            user.password
        );
        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Error in signin: ", error);
    }
};
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({ verificationToken: code });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {}
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpiresAt = new Date(
            Date.now() + 1 * 60 * 60 * 1000
        );

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await user.save();

        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
        );
        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.log("Error in forgotPassword: ", error);
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({ resetPasswordToken: token });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log("Error in resetPassword: ", error);
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const result = await sendOTP(phone);

    return res.status(200).json({
      message: "OTP sent successfully",
      sid: result.sid,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const result = await verifyOTP(phone, otp);

    if (result.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};