import express from "express";
import {
  createCoach,
  getCoach,
  getAllCoaches,
  deleteCoach,
  updateCoach,
  changePasswordCoach,
} from "../controllers/coach.js";

import {
  getCoachValidator,
  updateCoachValidator,
  deleteCoachValidator,
  createCoachValidator,
  changepasswordvalidate,
} from "../utils/validators/coachValidator.js";

import { checkAccountApproval, authorize } from "../middlewares/authorize.js";
import Roles from "../modules/role.js";

const router = express.Router();
router.route("/signup").post(createCoachValidator, createCoach);
router.use(authorize(["ADMIN", "COACH"]));
router.use(checkAccountApproval);
router.route("/").get(authorize([Roles.COACH], [Roles.ADMIN]), getAllCoaches);
router
  .route("/changepassword/:id")
  .put(
    authorize([Roles.COACH], [Roles.ADMIN]),
    changepasswordvalidate,
    changePasswordCoach
  );

router
  .route("/:id")
  .get(authorize([Roles.COACH], [Roles.ADMIN]), getCoachValidator, getCoach)
  .delete(
    authorize([Roles.COACH], [Roles.ADMIN]),
    deleteCoachValidator,
    deleteCoach
  )
  .put(
    authorize([Roles.COACH], [Roles.ADMIN]),
    updateCoachValidator,
    updateCoach
  );

export default router;
