import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["fraudulent_listing", "fake_seller", "wrong_price", "spam_listing", "inappropriate_content", "other"],
            required: true
        },

        category: {
            type: String,
            enum: ["listing", "user"],
            required: true
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "targetModel",
            required: true
        },

        targetModel: {
            type: String,
            enum: ["CarListing", "User"],
            required: true
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        description: {
            type: String,
            maxLength: [1000, "Description cannot exceed 1000 characters"],
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        status: {
            type: String,
            enum: ["open", "investigating", "resolved", "dismissed"],
            default: "open"
        },

        resolution: {
            type: String,
            enum: ["content_removed", "user_warned", "user_banned", "no_action", "verified_false"],
            default: null
        },

        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        resolutionNotes: {
            type: String,
            maxLength: [2000, "Resolution notes cannot exceed 2000 characters"],
            default: null
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        evidence: [
            {
                type: String, // URL to image or document
                uploadedAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

reportSchema.index({ status: 1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ reportedBy: 1 });

export const Report = mongoose.model("Report", reportSchema);
