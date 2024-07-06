import express from "express";
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
  getAllCategorieRestaurants,
  addOneCategorieRestaurant,
  getOneCategorieRestaurant,
  updateOneCategorieRestaurant,
  deleteOneCategorieRestaurant,
} from "../controllers/categorieRestaurant.js";
import { checkAccountApproval, authorize } from "../middlewares/authorize.js";

const router = express.Router();
router.use(authorize(["ADMIN", "USER"]));

router
  .route("/")
  .get(getAllCategorieRestaurants, authorize(["ADMIN", "USER"]))
  .post(
    multer("imageCategorieRestaurant", 5 * 1024 * 1024),
    body("libelle").isLength({ max: 20 }).notEmpty(),
    addOneCategorieRestaurant,
    authorize(["ADMIN"])
  );

router
  .route("/:id")
  .get(getOneCategorieRestaurant, authorize(["ADMIN", "USER"]))
  .put(
    multer("imageCategorieRestaurant", 5 * 1024 * 1024),
    body("libelle").isLength({ max: 20 }).notEmpty(),
    updateOneCategorieRestaurant,
    authorize(["ADMIN"])
  )
  .delete(deleteOneCategorieRestaurant, authorize(["ADMIN"]));

export default router;
