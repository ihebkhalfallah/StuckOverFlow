import express from "express";
import passport from "passport";
import {
  handleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authentification.js";
import { resetPasswordvalidate } from "../utils/validators/resetPasswordValidator.js";
import { generateAuthTokens } from "../controllers/token.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("/login");
      }

      const tokens = await generateAuthTokens({
        userId: req.user.id,
        roleId: req.user.role,
      });

      res.json({ user: req.user, tokens });
    } catch (error) {
      console.error("Error processing Google authentication:", error);
      res.status(500).send({ message: "Authentication failed" });
    }
  }
);

router.post("/login", handleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/", resetPasswordvalidate, resetPassword);

export default router;
