import express from "express";
import {
  createAdmin,
  getUser,
  getAllAdmins,
  getAllUsers,
  getAllCoaches,
  getAllNutritionnistes,
  deleteUser,
  updateAdmin,
  changePassword,
  desactiveAccount,
  reactiveAccount,
  getAllAccounts,
} from "../controllers/admin.js";

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
router.route("/createadmin").post(createCoachValidator, createAdmin);

router.use(authorize(["ADMIN", "COACH"]));
router.use(checkAccountApproval);
router.route("/").get(authorize([Roles.ADMIN]), getAllAccounts);
router.route("/admins").get(authorize([Roles.ADMIN]), getAllAdmins);
router.route("/users").get(authorize([Roles.ADMIN]), getAllUsers);
router.route("/coaches").get(authorize([Roles.ADMIN]), getAllCoaches);
router
  .route("/nutritionnistes")
  .get(authorize([Roles.ADMIN]), getAllNutritionnistes);
router
  .route("/changepassword/:id")
  .put(authorize([Roles.ADMIN]), changepasswordvalidate, changePassword);

router
  .route("/desactivate/:id")
  .put(authorize([Roles.ADMIN]), desactiveAccount);
router.route("/reactivate/:id").put(authorize([Roles.ADMIN]), reactiveAccount);
router
  .route("/:id")
  .get(authorize([Roles.ADMIN]), getCoachValidator, getUser)
  .delete(authorize([Roles.ADMIN]), deleteCoachValidator, deleteUser)
  .put(authorize([Roles.ADMIN]), updateCoachValidator, updateAdmin);

export default router;
