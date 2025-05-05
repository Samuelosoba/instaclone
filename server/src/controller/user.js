import User from "../model/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../config/emailservice.js";
import { generateAccessToken } from "../config/generateToken.js";

export const registerUser = async (req, res, next) => {
  const { username, email, fullname, password } = req.body; //get info from client via form
  try {
    if (!username || !email || !fullname || !password) {
      return next(createHttpError(400, "All fields are required"));
    }
    //check if user already exists in db
    const [exisitingUsername, exisitingEmail] = await Promise.all([
      User.findOne({ username: username }),
      User.findOne({ email: email }),
    ]);
    if (exisitingUsername) {
      return next(createHttpError(409, "Username already exisit"));
    }
    if (exisitingEmail) {
      return next(createHttpError(409, "email already exisit"));
    }
    //proceed to register user if user dont exists
    const salt = await bcrypt.genSalt(10); //encryption mechanism for to handle password
    const hashedPassword = await bcrypt.hash(password, salt); //encrypt the user password
    //proceed to create the user
    const user = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
    });
    //generate the verification token
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    //specify the verifyAccountlink
    const verifyAccountLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`;
    //send email to user
    await sendMail({
      fullname: user.fullname,
      intro: [
        "Welcome to Instashots",
        "We are very excited to have you onboard",
      ],
      instructions: `To access our platform, please verify your email using this link:${verifyAccountLink}. Link will expire after 24 hours`,
      btnText: "Verify",
      subject: "Email Verification",
      to: user.email,
      link: verifyAccountLink,
    });
    //generate accessToken
    const accessToken = generateAccessToken(user._id, user.role);
    //send a response ro the client
    res.status(201).json({
      success: true,
      message:
        "Account creted successfully, please check your mail in order to verify your account",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return next(createHttpError(400, "Username or password missing"));
    }
    //find user - password is hidden by default, using select method brings it back
    const user = await User.findOne({ username: username }).select("+password");
    if (!user) {
      return next(createHttpError(404, "Account not found"));
    }
    //handle password check
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    //if all checks out, generate and send accessToken
    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({
      success: true,
      accessToken,
      message: `Welcome ${user.username}`,
    });
  } catch (error) {
    next(error);
  }
};
export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {}
};
export const resendEmailVerificationLink = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    //generate the verification token
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const verifyAccountLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`;
    //send email to user
    await sendMail({
      fullname: user.fullname,
      intro: [
        "Welcome to Instashots",
        "We are very excited to have you onboard",
      ],
      instructions: `To access our platform, please verify your email using this link:${verifyAccountLink}. Link will expire after 24 hours`,
      btnText: "Verify",
      subject: "Email Verification",
      to: user.email,
      link: verifyAccountLink,
    });
    res
      .status(200)
      .json({ success: true, message: "Email verification link sent" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailAccount = async (req, res, next) => {
  const { userId, verificationToken } = req.params;
  try {
    if (!userId || !verificationToken) {
      return next(
        createHttpError(400, "UserId or verificationToken not provided")
      );
    }
    //find user
    const user = await User.findOne({
      _id: userId,
      verificationToken: verificationToken,
    }).select("+verificationToken +verificationTokenExpires");
    if (!user) {
      return next(createHttpError(404, "Invalid User id or reset token"));
    }
    if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
      return next(
        createHttpError(
          401,
          "verification link has expires, please request a new one"
        )
      );
    } else {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
    }
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {}
};

export const sendForgotPasswordMail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(createHttpError(400, "Email is not provided"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    await user.save();
    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${user.passwordResetToken}`;
    //send email to user
    await sendMail({
      fullname: user.fullname,
      intro: [
        "You have requested a password rest for your account",
        "If you did not make this request, kindly ignore this email",
      ],
      instructions: `Click here to reset your password:${resetPasswordLink}. Link will expire after 30 minutes`,
      btnText: "Reset Password",
      subject: "Password Reset",
      to: user.email,
      link: resetPasswordLink,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  const { userId, passwordToken } = req.params;
  try {
    if (!newPassword || !confirmPassword) {
      return next(
        createHttpError(400, "New Password or confirm password is missing")
      );
    }
    //find user
    const user = await User.findOne({
      _id: userId,
      passwordResetToken: passwordToken,
    }).select("+passwordResetToken +passwordResetTokenExpires");
    if (!user) {
      return next(createHttpError(404, "Ivalid User id or reset token"));
    }
    //check token expiry
    if (user.passwordResetTokenExpires < Date.now()) {
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();
      return next(
        createHttpError(
          401,
          "Password link has expires, please request a new one"
        )
      );
    }
    //check newPassword and confirmed password are same
    if (newPassword !== confirmPassword) {
      return next(
        createHttpError(400, "New password and confirm password do not match")
      );
    }
    //proceed to has password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    res
      .status(200)
      .json({ sucess: true, message: "Password has been updated" });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
};
export const followUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: followerId } = req.params;
  try {
    if (!followerId) {
      return next(createHttpError(400, "Follower id is required"));
    }
    const user = await User.findById(userId);
    if (user.following.map((id) => id.toString()).includes(followerId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== followerId
      );
    } else {
      user.following.push(followerId);
    }
    //update the follower
    const followedUser = await User.findById(followerId);
    if (followedUser.followers.map((id) => id.toString()).includes(userId)) {
      followedUser.followers = followedUser.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      followedUser.followers.push(userId);
    }
    await followedUser.save();
    await user.save();
    res.status(200).json({
      success: true,
      message: user.following.map((id) => id.toString()).includes(followerId)
        ? "User followed"
        : "User unfollowed",
      user,
    });
  } catch (error) {
    next(error);
  }
};
