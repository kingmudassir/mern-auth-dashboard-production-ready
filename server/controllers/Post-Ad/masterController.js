import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/errors.js";
import { MasterVariant } from "../../models/masterVariantSchema.js";

export const getVariants = catchAsyncError(async (req, res, next) => {
    const { make, model, year } = req.query;

    if (!make || !model) {
        return next(new ErrorHandler("make and model are required query params", 400));
    }

    const query = {
        make: { $regex: new RegExp(`^${make}$`, "i") },
        model: { $regex: new RegExp(`^${model}$`, "i") },
    };

    if (year) {
        const parsedYear = Number(year);
        if (!isNaN(parsedYear)) {
            query.years_active = parsedYear; // Mongoose treats this as $elemMatch for arrays
        }
    }

    const variants = await MasterVariant.find(query)
        .select("variant_name specs features colors years_active")
        .sort({ variant_name: 1 })
        .lean();

    res.status(200).json({
        success: true,
        count: variants.length,
        variants,
    });
});