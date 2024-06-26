import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const resetPasswordvalidate = [
  body("password")
    .notEmpty()
    .withMessage("You must enter your new password")
    .isLength({ min: 8 })
    .withMessage("Password too short")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  validatorMiddleware,
];
