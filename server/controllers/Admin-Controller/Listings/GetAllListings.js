import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Car } from "../../../models/carSchema.js";

export const getAllListings = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    const listings = await Car.find({ isDeleted: false })
        .populate("createdBy", "name email phone")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    const total = await Car.countDocuments({ isDeleted: false });

    res.status(200).json({
        success: true,
        listings,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});
