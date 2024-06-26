import express from "express";
import {
  createNutritionniste,
  getAllNutritionnistes,
  getNutritionniste,
  updateNutritionnistes,
  deleteNutritionnistes,
  changePasswordNutritionnistes,
} from "../controllers/nutritionniste.js";

import {
  getNutritionnisteValidator,
  updateNutritionnisteValidator,
  deleteNutritionnisteValidator,
  createNutritionnisteValidator,
  changepasswordvalidate,
} from "../utils/validators/nutritionnisteValidator.js";

import Roles from "../modules/role.js";
import { checkAccountApproval, authorize } from "../middlewares/authorize.js";
const router = express.Router();
router
  .route("/signup")
  .post(createNutritionnisteValidator, createNutritionniste);
router.use(authorize(["ADMIN", "NUTRITIONNISTE"]));
router.use(checkAccountApproval);
router
  .route("/")
  .get(authorize([Roles.NUTRITIONNISTE], [Roles.ADMIN]), getAllNutritionnistes);
router
  .route("/changepassword/:id")
  .put(
    authorize([Roles.NUTRITIONNISTE], [Roles.ADMIN]),
    changepasswordvalidate,
    changePasswordNutritionnistes
  );

router
  .route("/:id")
  .get(
    authorize([Roles.NUTRITIONNISTE], [Roles.ADMIN]),
    getNutritionnisteValidator,
    getNutritionniste
  )
  .delete(
    authorize([Roles.NUTRITIONNISTE], [Roles.ADMIN]),
    deleteNutritionnisteValidator,
    deleteNutritionnistes
  )
  .put(
    authorize([Roles.NUTRITIONNISTE], [Roles.ADMIN]),
    updateNutritionnisteValidator,
    updateNutritionnistes
  );

export default router;
