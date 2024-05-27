import express from "express";
import { body } from "express-validator";



import { getAll,getOne, create, update, deleteOne } from "../controllers/coach.js";

const router = express.Router();

router
.route("/:id")
.patch(update)
.delete(deleteOne)
// router
// .route("/:idSeance/:idCoach");

router
    .route("/")
    .get(getAll)
    .post(

       body("NomCoach").isLength({ min: 3 }),
       body("PrénomCoach").isLength({ min: 3 }),
       body("Disponible").isBoolean(),
     body("Spécialité").isLength({ min: 3 }),
        create
    );
 
export default router;