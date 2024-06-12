import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../config/config.js";

export function generateToken(data, expiresMs, secret = config.jwt.secret) {
  const token = jwt.sign(
    { exp: Math.floor(expiresMs / 1000), ...data },
    secret
  );
  return token;
}

export async function verifyToken(token) {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    return payload;
  } catch (err) {
    throw new Error(`Invalid token: ${err}`);
  }
}

export async function encryptData(string) {
  const salt = await bycrypt.genSalt(10);
  const hashedString = await bycrypt.hash(string, salt);
  return hashedString;
}

export async function decryptData(string, hashedString) {
  const isValid = await bycrypt.compare(string, hashedString);
  return isValid;
}

export function setCookie(res, cookieName, cookieValue, expiresMs) {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    expires: new Date(expiresMs),
  });
}
export function generateExpires(hours) {
  const ms = Math.floor(Date.now() + hours * 60 * 60 * 1000);
  return ms;
}

export function decode(token) {
  try {
    const { secret } = config.jwt;

    return jwt.verify(token, secret);
  } catch (e) {
    return undefined;
  }
}
