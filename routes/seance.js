import express from "express";
import { body, validationResult } from "express-validator";
import { seanceValidationRules } from "../validators/seancevalidator.js";


import { getAll,getById, create, update, deleteOne } from "../controllers/seance.js";

var DateSys = Date.now()
const router = express.Router();
router
.route("/:id")
.patch(update)
.delete(deleteOne)
.get(getById);

// router
// .route('/reserver/:idCoach/:idSeance')
// .post(reserver);

router
     .route("/")
     .get(getAll)
//      .post(

//         // body("DateEvent").isDate().custom((value, { req }) => {
//         //     if (new Date(value) <= DateSys) {
//         //         throw new Error('DateEvent doit être superieur à la date du systeme');
//         //     }
//         //     return true;
//         // }),
//         body('DateEvent').isISO8601().toDate().custom((value, { req }) => {
//             if (new Date(value) <= DateSys) {
//                 throw new Error('DateEvent doit être superieur à la date du systeme');
//             }
//             return true;
//         }),
//         body('Durée').isFloat({ min: 0 }),

//         body("TypeEvent").isLength({ min: 3 }),
//         body("IdSalleDeSport").isLength({ min: 3 }),
//         body("NbrParticipant").isNumeric(),
//         body("Capacity").isNumeric(),
//         // body("HeureDebutEvent").custom((value, { req }) => {
//         //   if (new Date(value).getTime() >= new Date(req.body.HeureFinEvent).getTime()) {
//         //       throw new Error('HeureDebutEvent doit être avant HeureFinEvent');
//         //   }
//         //   if (new Date(value).getTime() <= DateSys.getTime()) {
//         //       throw new Error('HeureDebutEvent doit être superieur à la date du systeme');
//         //   }
//     //       return true;
//     //   }),
//       body("Durée").isNumeric(),
//     //   body("HeureFinEvent").custom((value, { req }) => {
//     //       if (new Date(value).getTime() <= new Date(req.body.HeureDebutEvent).getTime()) {
//     //           throw new Error('HeureFinEvent doit être après HeureDebutEvent');
//     //       }
//     //       return true;
//     //   }),
//       (req, res, next) => {
//           const errors = validationResult(req);
//           if (!errors.isEmpty()) {
//               return res.status(400).json({ errors: errors.array() });
//           }
//           next();
//       },
//       create
//   );

router.post('/', seanceValidationRules(), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, create);

;
export default router;