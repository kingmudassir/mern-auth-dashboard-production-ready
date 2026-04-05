import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
    {
        // ── Core identity ─────────────────────────────────────────
        make: {
            type: String,
            required: [true, "Make is required."],
            trim: true,
        },

        model: {
            type: String,
            required: [true, "Model is required."],
            trim: true,
        },

        variant: {
            type: String,
            trim: true,
            default: undefined,
        },

        year: {
            type: Number,
            required: [true, "Year is required."],
            min: [1940, "Year must be 1940 or later."],
            max: [new Date().getFullYear() + 1, "Year cannot be in the future."],
        },

        condition: {
            type: String,
            enum: ["New", "Used"],
            default: "Used",
        },

        // ── Specs ─────────────────────────────────────────────────
        bodyType: {
            type: String,
            required: [true, "Body type is required."],
            trim: true,
        },

        color: {
            type: String,
            required: [true, "Color is required."],
            trim: true,
        },

        engineCC: {
            type: Number,
            default: undefined,
        },

        assembly: {
            type: String,
            enum: ["Local", "Imported"],
            default: "Local",
        },

        transmission: {
            type: String,
            required: [true, "Transmission is required."],
            enum: ["Automatic", "Manual"],
        },

        fuel: {
            type: String,
            required: [true, "Fuel type is required."],
            trim: true,
        },

        mileage: {
            type: Number,
            default: undefined,
        },

        registeredIn: {
            type: String,
            trim: true,
            default: undefined,
        },

        features: {
            type: [String],
            default: [],
        },

        // ── Pricing ───────────────────────────────────────────────
        price: {
            type: Number,
            required: [true, "Price is required."],
            min: [1, "Price must be greater than 0."],
        },

        negotiable: {
            type: Boolean,
            default: false,
        },

        // ── Description ───────────────────────────────────────────
        description: {
            type: String,
            required: [true, "Description is required."],
            minLength: [30, "Description must be at least 30 characters."],
            trim: true,
        },

        // ── Location & contact ────────────────────────────────────
        city: {
            type: String,
            required: [true, "City is required."],
            trim: true,
        },

        area: {
            type: String,
            trim: true,
            default: undefined,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required."],
            trim: true,
            validate: {
                validator: (v) => /^(\+92|0)[0-9]{10}$/.test(v),
                message: (props) => `${props.value} is not a valid Pakistani phone number.`,
            },
        },

        whatsapp: {
            type: Boolean,
            default: false,
        },

        // ── Images ────────────────────────────────────────────────
        images: {
            type: [
                {
                    url: { type: String, required: true },
                    publicId: { type: String, required: true },
                },
            ],
            validate: {
                validator: (arr) => arr.length >= 1 && arr.length <= 10,
                message: "At least 1 and at most 10 images are required.",
            },
        },

        status: {
            type: String,
            enum: ["pending", "active", "rejected", "sold"],
            default: "pending",
            index: true,
        },

        // Populated by the admin when status is set to "rejected"
        rejectionReason: {
            type: String,
            trim: true,
            default: undefined,
        },

        // Who approved / rejected and when (audit trail)
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined,
        },
        approvedAt: {
            type: Date,
            default: undefined,
        },
        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined,
        },
        rejectedAt: {
            type: Date,
            default: undefined,
        },

        // ── Legacy flags (kept for backward compat, derived from status) ─
        // isActive: true only when status === "active"
        isActive: {
            type: Boolean,
            default: false, // starts false until admin approves
        },

        isSold: {
            type: Boolean,
            default: false,
        },

        soldAt: {
            type: Date,
            default: undefined,
        },

        // Soft delete
        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: undefined,
        },

        // ── Ownership ─────────────────────────────────────────────
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        views: {
            type: Number,
            default: 0,
        },

        reportCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for common query patterns
carSchema.index({ status: 1, isDeleted: 1 });
carSchema.index({ city: 1, status: 1, isDeleted: 1 });
carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ postedBy: 1 });
carSchema.index({ createdAt: -1 });

export const Car = mongoose.model("Car", carSchema);