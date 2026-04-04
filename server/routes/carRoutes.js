import express from "express";
import { isAuthenticated } from "../middlewares/userAuth.js";
import {
    deleteAd, getCarById, getCars, getMyAds,
    patchMyAdStatus, postAd, updateAd
} from "../controllers/Post-Ad/carController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// ─── AUTHENTICATED ROUTES FIRST ─────────────────────────────────
router.get("/my-ads", isAuthenticated, getMyAds);
router.get("/my-ads/:id", isAuthenticated, getCarById);

// ─── PUBLIC ROUTES SECOND ───────────────────────────────────────
router.get("/", getCars);

// DYNAMIC PARAMETER ROUTES LAST
router.get("/:id", getCarById); 

// ─── OTHER ROUTES ───────────────────────────────────────────────
router.post("/", isAuthenticated, upload.array("images", 10), postAd);
router.patch("/:id/status", isAuthenticated, patchMyAdStatus);
router.delete("/:id", isAuthenticated, deleteAd);
router.patch("/update/:id", isAuthenticated, upload.array("images", 10), updateAd);

export default router;
