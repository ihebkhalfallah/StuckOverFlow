import express from "express";
import { body, validationResult } from "express-validator";



import { getAll,getById, create, update, deleteOne ,reserver} from "../controllers/seance.js";

const router = express.Router();
router
.route("/:id")
.patch(update)
.delete(deleteOne)
.get(getById);
router
.route('/reserver/:idCoach/:idSeance')
.post(reserver);
router
     .route("/")
     .get(getAll)
     .post(

        body("DateEvent").isDate(),
        body("NomCoach").isLength({ min: 3 }),
        body("PrénomCoach").isLength({ min: 3 }),
        body("TypeEvent").isLength({ min: 3 }),
        body("IdSalleDeSport").isLength({ min: 3 }),
        body("NbrParticipant").isNumeric(),
        body("Capacity").isNumeric(),
        body("HeureDebutEvent").custom((value, { req }) => {
          if (new Date(value).getTime() >= new Date(req.body.HeureFinEvent).getTime()) {
              throw new Error('HeureDebutEvent doit être avant HeureFinEvent');
          }
          return true;
      }),
      body("HeureFinEvent").custom((value, { req }) => {
          if (new Date(value).getTime() <= new Date(req.body.HeureDebutEvent).getTime()) {
              throw new Error('HeureFinEvent doit être après HeureDebutEvent');
          }
          return true;
      }),
      (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
          next();
      },
      create
  );

;


export default router;