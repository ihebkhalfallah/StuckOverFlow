import express from "express";

// import validate from '../middlewares/validate.js';
import {
  handleLogin,
  //   handleRefreshToken,
  //   handleResetPassword,
  //   handleForgotPassword,
} from "../controllers/authentification.js";

// import {
//   validateLogin,
//   validateRefreshToken,
//   validateResetPassword,
//   validateForgotPassword,
// } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/login", handleLogin);
// router.post(
//   "/forgot-password",
//   validate(validateForgotPassword),
//   handleForgotPassword
// );
// router.post(
//   "/reset-password",
//   validate(validateResetPassword),
//   handleResetPassword
// );
// router.post(
//   "/refresh-tokens",
//   validate(validateRefreshToken),
//   handleRefreshToken
// );

export default router;
