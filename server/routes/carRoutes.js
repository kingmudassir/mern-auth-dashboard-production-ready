import express from "express";
import { isAuthenticated } from "../middlewares/userAuth.js";
import { deleteAd, getCarById, getCars, getMyAds, postAd } from "../controllers/Post-Ad/carController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getCars);
router.get("/my-ads", isAuthenticated, getMyAds);
router.get("/:id", getCarById);
router.post("/", isAuthenticated, upload.array("images", 10), postAd);
router.delete("/:id", isAuthenticated, deleteAd);

export default router;