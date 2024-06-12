import httpStatus from "http-status";

import config from "../config/config.js";
import ApiError from "../utils/apiError.js";
import { getUserByEmail } from "./admin.js";
import { generateToken, generateExpires } from "../utils/auth.js";

export async function generateResetPasswordToken(email) {
  const user = await getUserByEmail(email);
  if (!user || !user.id) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with this email");
  }

  const expiresMs = generateExpires(
    config.jwt.resetPasswordExpirationMinutes / 60
  );
  const resetPasswordToken = generateToken({ id: user.id }, expiresMs);

  return resetPasswordToken;
}

export async function generateAuthTokens({ userId, roleId }) {
  const refreshTokenExpires = generateExpires(
    config.jwt.refreshExpirationDays * 24
  );

  const refreshToken = generateToken({ userId }, refreshTokenExpires);

  const accessTokenExpires = generateExpires(
    config.jwt.accessExpirationMinutes / 60
  );
  const accessToken = generateToken({ userId, roleId }, accessTokenExpires);

  return {
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
  };
}
