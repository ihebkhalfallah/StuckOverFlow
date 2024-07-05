import express from "express";
import { body, query } from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
  getAllRestaurants,
  addOneRestaurant,
  getOneRestaurant,
  updateOneRestaurant,
  deleteOneRestaurant,
  getRestaurantsByAdresse,
  findRestaurantsNearPlace,
} from "../controllers/restaurant.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.route("/adresse").get(getRestaurantsByAdresse);
router.use(authorize(["ADMIN", "USER"]));

router
  .route("/nearby")
  .get(
    query("latitude").isFloat(),
    query("longitude").isFloat(),
    query("maxDistance").isInt(),
    findRestaurantsNearPlace,
    authorize(["ADMIN", "USER"])
  );

router
  .route("/")
  .get(getAllRestaurants, authorize(["ADMIN", "USER"]))
  .post(
    multer("imageRestaurant", 5 * 1024 * 1024),
    body("nomRestaurant").isLength({ max: 30 }),
    addOneRestaurant,
    authorize(["ADMIN"])
  );

router
  .route("/:id")
  .get(getOneRestaurant, authorize(["ADMIN", "USER"]))
  .put(
    multer("imageRestaurant", 5 * 1024 * 1024),
    body("nomRestaurant").isLength({ max: 30 }),
    updateOneRestaurant,
    authorize(["ADMIN"])
  )
  .delete(deleteOneRestaurant, authorize(["ADMIN"]));

export default router;
