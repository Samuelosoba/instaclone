import express from "express";
import {
  registerUser,
  loginUser,
  authenticateUser,
  resendEmailVerificationLink,
  verifyEmailAccount,
  sendForgotPasswordMail,
  resetPassword,
  logout,
} from "../controller/user.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", rateLimiter, loginUser);
router.post(
  "/resend-verification-email",
  rateLimiter,
  verifyToken,
  authorizeRoles("user", "admin"),
  resendEmailVerificationLink,
  sendForgotPasswordMail
);
router.post("/sendforgot-password-mail", sendForgotPasswordMail);
router.post(
  "/logout",
  (req, res, next) => {
    clearCache(null, true);
    next();
  },
  logout
);
//get
router.get(
  "/user",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("auth_User", 600),
  authenticateUser
);
//patch
router.patch(
  "/verify-account/:userId/:verificationToken",
  verifyToken,
  authorizeRoles("user", "admin"),
  verifyEmailAccount
);
router.patch("/reset-password/:userId/:passwordToken", resetPassword);

export default router;
