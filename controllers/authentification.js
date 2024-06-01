import jwt from "jsonwebtoken";
import User from "../modules/user.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { getUserByEmail } from "./admin.js";
import httpStatus from "http-status";
import {
  generateAuthTokens,
} from "../controllers/token.js";
import crypto from "crypto";
import Token from "../modules/token.js";
import { sendEmail } from "../services/email.service.js";

export const handleLogin = async (req, res) => {
  try {
    const user = await login(req);
    const tokens = await generateAuthTokens({
      userId: user.id,
      roleId: user.role_id,
    });
    res.send({ user, tokens });
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
};

async function login(req) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email or password cannot be empty"
    );
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Please set your password before logging in"
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  delete user.password;
  return user;
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    console.log(">>>>>>>>>>>>>>>>>" + hash);
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const emailContent = `
      <p>You requested a password reset.</p>
      <p>Your reset token is: <strong>${resetToken}</strong></p>
      <p>Please use this token to reset your password by sending it along with your new password to the reset password endpoint.</p>
    `;
    await sendEmail(user.email, "Password Reset Request", emailContent);

    res.status(200).send({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const tokens = await Token.find();
    let userToken = null;

    // Find the token in the database
    for (let i = 0; i < tokens.length; i++) {
      const isTokenValid = await bcrypt.compare(token, tokens[i].token);
      if (isTokenValid) {
        userToken = tokens[i];
        break;
      }
    }

    if (!userToken) {
      return res
        .status(400)
        .send({ message: "Invalid or expired reset token" });
    }

    const user = await User.findById(userToken.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.password = password;
    await user.save();
    await userToken.deleteOne();

    res.status(200).send({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};
