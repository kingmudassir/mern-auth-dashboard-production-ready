// ─────────────────────────────────────────────────────────────────
// FILE: models/reportSchema.js
// ─────────────────────────────────────────────────────────────────
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        // ── What is being reported ────────────────────────────────
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: [true, "Car reference is required."],
            index: true,
        },

        // ── Who filed it ──────────────────────────────────────────
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reporter reference is required."],
        },

        // ── What's wrong ──────────────────────────────────────────
        reason: {
            type: String,
            required: [true, "A reason is required."],
            enum: [
                "Misleading price or description",
                "Duplicate listing",
                "Fraudulent or scam activity",
                "Wrong category",
                "Offensive content",
                "Car already sold",
                "Fake photos or stolen images",
                "Other",
            ],
        },

        // Optional free-text detail from the reporter
        description: {
            type: String,
            maxLength: [1000, "Description cannot exceed 1000 characters."],
            trim: true,
            default: undefined,
        },

        // ── Lifecycle ─────────────────────────────────────────────
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending",
            index: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },

        // ── Resolution audit trail ────────────────────────────────
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined,
        },

        resolvedAt: {
            type: Date,
            default: undefined,
        },

        resolution: {
            type: String,
            enum: [
                "content_removed",
                "user_warned",
                "user_banned",
                "no_action",
                "verified_false",
            ],
            default: undefined,
        },

        resolutionNotes: {
            type: String,
            trim: true,
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

// ── Compound unique index: one report per user per car ────────────
// This enforces the duplicate-report rule at the DB level as a safety net,
// in addition to the application-level check in the controller.
reportSchema.index({ car: 1, reportedBy: 1 }, { unique: true });

export const Report = mongoose.model("Report", reportSchema);