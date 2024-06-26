import express from "express";
import {
  addFavorite,
  getAllFavorites,
  removeFavorite,
} from "../controllers/favoritePlan.js";

const router = express.Router();

router.route("/").post(addFavorite);

router.route("/:id").delete(removeFavorite);

router.route("/:userId").get(getAllFavorites);

export default router;
