import jwt from "jsonwebtoken";
import User from "../modules/user.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { getUserByEmail } from "./admin.js";
import httpStatus from "http-status";
import { generateAuthTokens } from "../controllers/token.js";
import crypto from "crypto";
import Token from "../modules/token.js";
import { sendEmail } from "../services/email.service.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

// const GOOGLE_CLIENT_ID =
//   "739887847191-po6cohnbrq98pomf5580us13423u26m9.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:9090/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: "00112233@Ab",
            nickName: profile.displayName,
            birthDate: new Date(),
            role: "USER",
            isApproved: true,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err) {
        console.error("Error authenticating with Google:", err);
        return res.status(500).send({ message: "Authentication failed" });
      }

      if (!user) {
        return res.redirect("/login");
      }

      try {
        const tokens = await generateAuthTokens({
          userId: user.id,
          roleId: user.role_id,
        });

        res.redirect(
          `/dashboard?tokens=${encodeURIComponent(JSON.stringify(tokens))}`
        );
      } catch (tokenError) {
        console.error("Error generating tokens:", tokenError);
        return res.status(500).send({ message: "Token generation failed" });
      }
    }
  )(req, res, next);
};

export const handleLogin = async (req, res) => {
  try {
    const user = await login(req);
    const tokens = await generateAuthTokens({
      userId: user.id,
      roleId: user.role_id,
    });
    res.status(200).send({ user, tokens });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    res.status(status).send({ message });
  }
};

async function login(req) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw { status: 400, message: "Email or password cannot be empty" };
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  if (!user.password) {
    throw {
      status: 401,
      message: "Please set your password before logging in",
    };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw { status: 401, message: "Invalid credentials" };
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
