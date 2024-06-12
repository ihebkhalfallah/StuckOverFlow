import { check, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../modules/user.js";
import bcrypt from "bcrypt";

export const getNutritionnisteValidator = [
  check("id").isMongoId().withMessage("Invalid nutritionniste id format"),
  validatorMiddleware,
];

export const createNutritionnisteValidator = [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("nickName").notEmpty().withMessage("nickName is required"),
  check("adresse").notEmpty().withMessage("Address required"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone Number must be 8 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password too short")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .custom((password, { req }) => {
      if (password !== req.body.passwordconfirm) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  check("passwordconfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validatorMiddleware,
];

export const updateNutritionnisteValidator = [
  check("firstName").optional(),
  check("lastName").optional(),
  check("nickName").optional(),
  check("adresse").optional(),
  check("phoneNumber")
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone must be 8 characters"),
  validatorMiddleware,
];

export const deleteNutritionnisteValidator = [
  check("id").isMongoId().withMessage("Invalid nutritionniste id format"),
  validatorMiddleware,
];

export const changepasswordvalidate = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("currentpassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordconfirm")
    .notEmpty()
    .withMessage("You must enter your new password confirmation"),
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
    .withMessage("Password must contain at least one special character")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (password !== req.body.passwordconfirm) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  validatorMiddleware,
];
