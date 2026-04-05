// ─────────────────────────────────────────────────────────────────
// FILE: routes/carRoutes.js  ← REPLACE with this
// Two new routes added; everything else unchanged.
// ─────────────────────────────────────────────────────────────────
import express from "express";
import { isAuthenticated } from "../middlewares/userAuth.js";
import {
    deleteAd, getCarById, getCars, getMyAds,
    patchMyAdStatus, postAd, updateAd
} from "../controllers/Post-Ad/carController.js";
import { getSavedAds, toggleSaveAd } from "../controllers/Saved-Ads/savedAdsController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// ─── AUTHENTICATED SPECIFIC ROUTES FIRST ────────────────────────
router.get("/my-ads", isAuthenticated, getMyAds);
router.get("/my-ads/:id", isAuthenticated, getCarById);
router.get("/saved", isAuthenticated, getSavedAds);          // ← NEW

// ─── PUBLIC ROUTES ───────────────────────────────────────────────
router.get("/", getCars);

// ─── DYNAMIC PARAMETER ROUTES LAST ──────────────────────────────
router.get("/:id", getCarById);

// ─── MUTATION ROUTES ─────────────────────────────────────────────
router.post("/", isAuthenticated, upload.array("images", 10), postAd);
router.post("/:id/save", isAuthenticated, toggleSaveAd);     // ← NEW
router.patch("/:id/status", isAuthenticated, patchMyAdStatus);
router.delete("/:id", isAuthenticated, deleteAd);
router.patch("/update/:id", isAuthenticated, upload.array("images", 10), updateAd);

export default router;