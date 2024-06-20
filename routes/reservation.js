import express from "express";
import { body } from "express-validator";



import { getAll,getById, create, update, deleteOne } from "../controllers/reservation.js";

const router = express.Router();

router
 .route("/:id")
 .patch(update)
 .delete(deleteOne)
 .get(getById);
 
//  router
// .route("/:idCoach/:idSeance")
// .post(create);

router
    .route("/")
    .get(getAll)
    .post(create);

router.post('/reservations', create);
export default router;