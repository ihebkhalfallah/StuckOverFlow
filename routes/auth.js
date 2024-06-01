import express from "express";

import {
  handleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authentification.js";
import { resetPasswordvalidate } from "../utils/validators/resetPasswordValidator.js";
const router = express.Router();

router.post("/login", handleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/", resetPasswordvalidate, resetPassword);

export default router;
