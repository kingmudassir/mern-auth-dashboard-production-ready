import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Car } from "../../../models/carSchema.js";

export const getAdminListingById = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;

    const listing = await Car.findOne({ _id: listingId, isDeleted: false })
        .populate("postedBy", "name email phone createdAt city isAccountVerified")
        .populate("approvedBy", "name email")
        .populate("rejectedBy", "name email")
        .lean();

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({ success: true, listing });
});