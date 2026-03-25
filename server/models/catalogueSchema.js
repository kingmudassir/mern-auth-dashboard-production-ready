import mongoose from "mongoose";

const makeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Make name is required"],
            unique: true,
            trim: true
        },

        models: [
            {
                name: {
                    type: String,
                    required: true
                },
                years: [Number] // e.g. [2018, 2019, 2020, 2021, 2022, 2023]
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// makeSchema.index({ name: 1 });

export const Make = mongoose.model("Make", makeSchema);

// ================== Cities ==================
const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "City name is required"],
            unique: true,
            trim: true
        },

        province: {
            type: String,
            required: true,
            enum: ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB", "FATA", "ICT"]
        },

        regionCode: {
            type: String, // e.g. "LHR" for Lahore, "KHI" for Karachi
            unique: true,
            sparse: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        listingCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// citySchema.index({ name: 1 });
citySchema.index({ province: 1 });

export const City = mongoose.model("City", citySchema);
