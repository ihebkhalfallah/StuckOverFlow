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

const router = express.Router();
router
  .route("/signup")
  .post(createNutritionnisteValidator, createNutritionniste);
router.route("/").get(getAllNutritionnistes);
router
  .route("/changepassword/:id")
  .put(changepasswordvalidate, changePasswordNutritionnistes);
router
  .route("/:id")
  .get(getNutritionnisteValidator, getNutritionniste)
  .delete(deleteNutritionnisteValidator, deleteNutritionnistes)
  .put(updateNutritionnisteValidator, updateNutritionnistes);

export default router;
