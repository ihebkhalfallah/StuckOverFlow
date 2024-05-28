import jwt from "jsonwebtoken";
import User from "../modules/user.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { decryptData } from "../utils/auth.js";
import { getUserByEmail } from "./admin.js";
import httpStatus from "http-status";
import {
  generateAuthTokens,
  generateResetPasswordToken,
} from "../controllers/token.js";

const handleLogin = async (req, res) => {
  const user = await login(req);
  const tokens = await generateAuthTokens({
    userId: user.id,
    roleId: user.role_id,
  });
  res.send({ user, tokens });
};

async function login(req) {
  const { email, password } = req.body;

  // Check if email or password is empty
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
  const isPasswordMatch = await decryptData(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  delete user.password;
  return user;
}

export { handleLogin };
