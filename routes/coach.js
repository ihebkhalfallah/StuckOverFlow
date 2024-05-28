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

const router = express.Router();
router.route("/signup").post(createCoachValidator, createCoach);
router.route("/").get(getAllCoaches);
router
  .route("/changepassword/:id")
  .put(changepasswordvalidate, changePasswordCoach);

router
  .route("/:id")
  .get(getCoachValidator, getCoach)
  .delete(deleteCoachValidator, deleteCoach)
  .put(updateCoachValidator, updateCoach);

export default router;
