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
.post('/',
     seanceValidationRules(), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
},
 create);

router
     .route("/")
     .get(getAll)
;

export default router;