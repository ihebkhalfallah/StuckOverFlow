import express from "express";
import {
  createUser,
  getUser,
  getAllUsers,
  getAllCoaches,
  getAllNutritionnistes,
  deleteUser,
  updateUser,
  changePassword,
} from "../controllers/user.js";

import {
  getuserValidator,
  updateuserValidator,
  deleteuserValidator,
  createuserValidator,
  changepasswordvalidate,
} from "../utils/validators/userValidator.js";

import Roles from "../modules/role.js";
import { checkAccountApproval, authorize } from "../middlewares/authorize.js";
const router = express.Router();

router.route("/signup").post(createuserValidator, createUser);
router.use(authorize(["ADMIN", "USER"]));
router.use(checkAccountApproval);
router.route("").get(authorize([Roles.USER], [Roles.ADMIN]), getAllUsers);
router
  .route("/coaches")
  .get(authorize([Roles.USER], [Roles.ADMIN]), getAllCoaches);
router
  .route("/nutritionniste")
  .get(authorize([Roles.USER], [Roles.ADMIN]), getAllNutritionnistes);
router
  .route("/changepassword/:id")
  .put(
    authorize([Roles.USER], [Roles.ADMIN]),
    changepasswordvalidate,
    changePassword
  );
router
  .route("/:id")
  .get(authorize([Roles.USER], [Roles.ADMIN]), getuserValidator, getUser)
  .delete(
    authorize([Roles.USER], [Roles.ADMIN]),
    deleteuserValidator,
    deleteUser
  )
  .put(authorize([Roles.USER], [Roles.ADMIN]), updateuserValidator, updateUser);

export default router;
