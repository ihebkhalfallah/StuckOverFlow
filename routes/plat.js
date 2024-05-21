import express from "express";

import {
  getAllPlats,
  addOnePlat,
  getOnePlat,
  updateOnePlat,
  deleteOnePlat,
} from "../controllers/plat.js";

const router = express.Router();

router.route("/").get(getAllPlats).post(addOnePlat);

router.route("/:id").get(getOnePlat).put(updateOnePlat).delete(deleteOnePlat);

export default router;
