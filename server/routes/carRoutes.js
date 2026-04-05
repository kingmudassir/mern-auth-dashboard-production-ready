import express from "express";
import { isAuthenticated } from "../middlewares/userAuth.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import {
    deleteAd, getCarById, getCars, getMyAds,
    patchMyAdStatus, postAd, updateAd
} from "../controllers/Post-Ad/carController.js";
import { getSavedAds, toggleSaveAd } from "../controllers/Saved-Ads/savedAdsController.js";
import { reportAd } from "../controllers/Report/reportAdController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", isAuthenticated, upload.array("images"), postAd);

// ─── AUTHENTICATED SPECIFIC ROUTES FIRST ─────────────────────────
router.get("/my-ads",     isAuthenticated, getMyAds);
router.get("/my-ads/:id", isAuthenticated, getCarById);
router.get("/saved",      isAuthenticated, getSavedAds);

// ─── PUBLIC ROUTES ────────────────────────────────────────────────
router.get("/", optionalAuth, getCars);

// ─── DYNAMIC PARAMETER ROUTES LAST ───────────────────────────────
router.get("/:id",             optionalAuth,    getCarById);
router.post("/:carId/report",  isAuthenticated, reportAd);      // ← NEW
router.post("/:id/save",       isAuthenticated, toggleSaveAd);
router.patch("/:id/status",    isAuthenticated, patchMyAdStatus);
router.delete("/:id",          isAuthenticated, deleteAd);
router.patch("/update/:id",    isAuthenticated, upload.array("images", 10), updateAd);

export default router;