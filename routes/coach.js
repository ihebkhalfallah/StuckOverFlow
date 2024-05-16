import express from "express";
import { body } from "express-validator";



import { getAll,getOne, create, update, deleteOne } from "../controllers/coach.js";

const router = express.Router();

router
    .route("/")
    .get(getAll, getOne)
    .post(

        body("NomCoach").isLength({ min: 3 }),
        body("PrénomCoach").isLength({ min: 5 }),
        body("Disponible").isBoolean(true),
        create
    )
    .route("/:id")
    .patch(update)
    .route("/:idSeance/:idCoach")
    .post(addOnce);

export default router;