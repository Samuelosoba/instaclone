import express from "express";
import {
  registerUser,
  loginUser,
  authenticateUser,
  resendEmailVerificationLink,
  verifyEmailAccount,
  sendForgotPasswordMail,
  resetPassword,
} from "../controller/user.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import createHttpError from "http-errors";
import User from "../model/user.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post(
  "/resend-verification-email",
  verifyToken,
  authorizeRoles("user", "admin"),
  resendEmailVerificationLink,
  sendForgotPasswordMail
);
router.post("/sendforgot-password-mail", sendForgotPasswordMail);
//get
router.get(
  "/user",
  verifyToken,
  authorizeRoles("user", "admin"),
  authenticateUser
);
//patch
router.patch(
  "/verify-account/:userId/:verificationToken",
  verifyToken,
  authorizeRoles("user", "admin"),
  verifyEmailAccount
);
router.patch(
  "/reset-password/:userId/:passwordToken",
  resetPassword
);

export default router;
