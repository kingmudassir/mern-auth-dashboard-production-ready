import mongoose from "mongoose";

const carListingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxLength: [120, "Title cannot exceed 120 characters"]
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            maxLength: [2000, "Description too long"]
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        // =========================
        // Car-specific fields
        // =========================
        make: {
            type: String,
            required: true, // e.g. Toyota, Honda
        },

        model: {
            type: String,
            required: true // e.g. Corolla, Civic
        },

        year: {
            type: Number,
            required: true,
            min: 1900,
            max: new Date().getFullYear() + 1
        },

        mileage: {
            type: Number,
            required: true, // in km
            min: 0
        },

        fuelType: {
            type: String,
            enum: ["petrol", "diesel", "hybrid", "electric"],
            required: true
        },

        transmission: {
            type: String,
            enum: ["manual", "automatic"],
            required: true
        },

        condition: {
            type: String,
            enum: ["new", "used"],
            required: true
        },

        registeredIn: {
            type: String, // e.g. Punjab, Sindh
            required: true
        },

        engineCapacity: {
            type: Number, // cc
            required: true
        },

        // =========================
        // Media
        // =========================
        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String } // if using Cloudinary
            }
        ],

        // =========================
        // Ownership
        // =========================
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // =========================
        // Moderation
        // =========================
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            default: undefined
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined
        },

        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined
        },

        approvedAt: Date,
        rejectedAt: Date,

        // =========================
        // Visibility / lifecycle
        // =========================
        isActive: {
            type: Boolean,
            default: true
        },

        isSold: {
            type: Boolean,
            default: false
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: undefined
        },

        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined
        },

        // =========================
        // Reporting system
        // =========================
        reportCount: {
            type: Number,
            default: 0
        },

        // =========================
        // Basic analytics
        // =========================
        views: {
            type: Number,
            default: 0
            }
        },
    {
        timestamps: true
    }
);

// =========================
// Indexes (IMPORTANT for performance)
// =========================
carListingSchema.index({ price: 1 });
carListingSchema.index({ city: 1 });
carListingSchema.index({ createdBy: 1 });
carListingSchema.index({ status: 1 });
carListingSchema.index({ createdAt: -1 });

export const CarListing = mongoose.model("CarListing", carListingSchema);