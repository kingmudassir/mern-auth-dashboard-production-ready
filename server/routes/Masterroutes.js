import express from "express";
import { getVariants } from "../controllers/Post-Ad/masterController.js";

const router = express.Router();

router.get("/variants", getVariants);

export default router;