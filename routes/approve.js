import express from "express";
import { approveUser } from "../services/approve.js";

const router = express.Router();
router.post("/", approveUser);

export default router;
