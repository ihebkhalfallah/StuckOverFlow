import express from "express";
import {body} from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
  addOnePlat,
  deleteOnePlat,
  findPlatsWithinCalories,
  getAllPlats,
  getOnePlat,
  updateOnePlat,
} from "../controllers/plat.js";

const router = express.Router();

router.get(
    "/find-within-calories",
    findPlatsWithinCalories
);

router
    .route("/")
    .get(getAllPlats)
    .post(
        multer("imagePlat", 5 * 1024 * 1024),
        body("nomPlat").isLength({min: 2, max: 30}),
        body("cuisine").isLength({min: 2, max: 30}),
        body("calories").isInt({gt: 0}),
        body("prixPlat").isFloat({gt: 0}),
        addOnePlat);

router
    .route("/:id")
    .get(getOnePlat)
    .put(
        multer("imagePlat", 5 * 1024 * 1024),
        body("nomPlat").isLength({min: 2, max: 30}),
        body("cuisine").isLength({min: 2, max: 30}),
        body("calories").isInt({gt: 0}),
        body("prixPlat").isFloat({gt: 0}),
        updateOnePlat)
    .delete(deleteOnePlat);

export default router;
