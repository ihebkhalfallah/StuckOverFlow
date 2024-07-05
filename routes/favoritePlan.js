import express from "express";
import {
  addFavorite,
  getAllFavorites,
  removeFavorite,
} from "../controllers/favoritePlan.js";
import { checkAccountApproval, authorize } from "../middlewares/authorize.js";

const router = express.Router();
router.use(authorize(["USER"]));

router.route("/").post(addFavorite, authorize(["USER"]));

router.route("/:id").delete(removeFavorite, authorize(["USER"]));

router.route("/:userId").get(getAllFavorites, authorize(["USER"]));

export default router;
