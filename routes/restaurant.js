import express from "express";
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
  getAllRestaurants,
  addOneRestaurant,
  getOneRestaurant,
  updateOneRestaurant,
  deleteOneRestaurant,
} from "../controllers/restaurant.js";

const router = express.Router();

router
  .route("/")
  .get(getAllRestaurants)
  .post(
    multer("imageRestaurant", 5 * 1024 * 1024),
    body("nomRestaurant").isLength({ min: 1, max: 30 }),
    addOneRestaurant
  );

router
  .route("/:id")
  .get(getOneRestaurant)
  .put(
    multer("imageRestaurant", 5 * 1024 * 1024),
    body("nomRestaurant").isLength({ min: 1, max: 30 }),
    updateOneRestaurant
  )
  .delete(deleteOneRestaurant);

export default router;
