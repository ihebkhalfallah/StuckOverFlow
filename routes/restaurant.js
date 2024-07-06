import express from "express";
import {body, query} from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
  addOneRestaurant,
  deleteOneRestaurant,
  findRestaurantsNearPlace,
  getAllRestaurants,
  getOneRestaurant,
  getRestaurantsByAdresse,
  updateOneRestaurant,
} from "../controllers/restaurant.js";

const router = express.Router();

router.route("/adresse").get(getRestaurantsByAdresse);

router
    .route("/nearby")
    .get(
        query("latitude").isFloat(),
        query("longitude").isFloat(),
        query("maxDistance").isInt(),
        findRestaurantsNearPlace
    );

router
    .route("/")
    .get(getAllRestaurants)
    .post(
        multer("imageRestaurant", 5 * 1024 * 1024),
        body("nomRestaurant").isLength({max: 30}),
        addOneRestaurant);

router
    .route("/:id")
    .get(getOneRestaurant)
    .put(
        multer("imageRestaurant", 5 * 1024 * 1024),
        body("nomRestaurant").isLength({max: 30}),
        updateOneRestaurant)
    .delete(deleteOneRestaurant);

export default router;
