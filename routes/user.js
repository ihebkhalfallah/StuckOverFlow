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

const router = express.Router();

router.route("/signup").post(createuserValidator, createUser);

router.route("").get(getAllUsers);
router.route("/coaches").get(getAllCoaches);
router.route("/changepassword/:id").put(changepasswordvalidate, changePassword);

router
  .route("/:id")
  .get(getuserValidator, getUser)
  .delete(deleteuserValidator, deleteUser)
  .put(updateuserValidator, updateUser);

export default router;
