import mongoose from "mongoose";

const masterVariantSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        make_id: {
            type: String,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        model_id: {
            type: String,
            trim: true,
        },
        variant_name: {
            type: String,
            required: true,
            trim: true,
        },
        // The years this variant was produced/sold
        years_active: {
            type: [Number],
            default: [],
            index: true,
        },
        specs: {
            engine: { type: String, trim: true },       // e.g. "1800 cc"
            transmission: { type: String, trim: true }, // e.g. "Automatic"
            fuel: { type: String, trim: true },         // e.g. "Petrol"
        },
        features: {
            type: [String],
            default: [],
        },
        colors: {
            type: [
                {
                    name: { type: String },
                    hex: { type: String },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
        collection: "masterkey", // explicit collection name
    }
);

// Compound index for the primary query pattern
masterVariantSchema.index({ make: 1, model: 1, years_active: 1 });

export const MasterVariant = mongoose.model("MasterVariant", masterVariantSchema);