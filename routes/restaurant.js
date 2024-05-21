import express from "express";

import {
  getAllRestaurants,
  addOneRestaurant,
  getOneRestaurant,
  updateOneRestaurant,
  deleteOneRestaurant,
  getPlatsByRestaurantId,
} from "../controllers/restaurant.js";

const router = express.Router();

router.route("/").get(getAllRestaurants).post(addOneRestaurant);

router
  .route("/:id")
  .get(getOneRestaurant)
  .put(updateOneRestaurant)
  .delete(deleteOneRestaurant);

router.route("/:id/plats").get(getPlatsByRestaurantId);

export default router;
