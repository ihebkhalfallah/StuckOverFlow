import express from "express";
import {body} from "express-validator";
import multer from "../middlewares/multer-config.js";
import {
    addOneCategorieRestaurant,
    deleteOneCategorieRestaurant,
    getAllCategorieRestaurants,
    getOneCategorieRestaurant,
    updateOneCategorieRestaurant,
} from "../controllers/categorieRestaurant.js";

const router = express.Router();
router
    .route("/")
    .get(getAllCategorieRestaurants)
    .post(
        multer("imageCategorieRestaurant", 5 * 1024 * 1024),
        body("libelle").isLength({max: 20}).notEmpty(),
        addOneCategorieRestaurant,
    );

router
    .route("/:id")
    .get(getOneCategorieRestaurant)
    .put(
        multer("imageCategorieRestaurant", 5 * 1024 * 1024),
        body("libelle").isLength({max: 20}).notEmpty(),
        updateOneCategorieRestaurant,
    )
    .delete(deleteOneCategorieRestaurant);

export default router;
