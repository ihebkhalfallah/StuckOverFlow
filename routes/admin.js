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

const router = express.Router();
router.route("/createadmin").post(createCoachValidator, createAdmin);
router.route("/").get(getAllAccounts);
router.route("/admins").get(getAllAdmins);
router.route("/users").get(getAllUsers);
router.route("/coaches").get(getAllCoaches);
router.route("/nutritionnistes").get(getAllNutritionnistes);
router.route("/changepassword/:id").put(changepasswordvalidate, changePassword);

router.route("/desactivate/:id").put(desactiveAccount);
router.route("/reactivate/:id").put(reactiveAccount);
router
  .route("/:id")
  .get(getCoachValidator, getUser)
  .delete(deleteCoachValidator, deleteUser)
  .put(updateCoachValidator, updateAdmin);

export default router;
