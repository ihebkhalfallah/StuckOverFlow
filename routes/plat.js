import express from "express";
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
  getAllPlats,
  addOnePlat,
  getOnePlat,
  updateOnePlat,
  deleteOnePlat,
  findPlatsWithinCalories,
} from "../controllers/plat.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
router.use(authorize(["ADMIN", "USER"]));

router.get(
  "/find-within-calories",
  findPlatsWithinCalories,
  authorize(["ADMIN", "USER"])
);

router
  .route("/")
  .get(getAllPlats, authorize(["ADMIN", "USER"]))
  .post(
    multer("imagePlat", 5 * 1024 * 1024),
    body("nomPlat").isLength({ min: 2, max: 30 }),
    body("cuisine").isLength({ min: 2, max: 30 }),
    body("calories").isInt({ gt: 0 }),
    body("prixPlat").isFloat({ gt: 0 }),
    addOnePlat,
    authorize(["ADMIN"])
  );

router
  .route("/:id")
  .get(getOnePlat, authorize(["ADMIN", "USER"]))
  .put(
    multer("imagePlat", 5 * 1024 * 1024),
    body("nomPlat").isLength({ min: 2, max: 30 }),
    body("cuisine").isLength({ min: 2, max: 30 }),
    body("calories").isInt({ gt: 0 }),
    body("prixPlat").isFloat({ gt: 0 }),
    updateOnePlat,
    authorize(["ADMIN"])
  )
  .delete(deleteOnePlat);

export default router;
