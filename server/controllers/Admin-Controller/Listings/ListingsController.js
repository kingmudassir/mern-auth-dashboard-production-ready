import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Car } from "../../../models/carSchema.js";

export const getPendingListings = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    const listings = await Car.find({ status: "pending", isDeleted: false })
        .populate("createdBy", "name email phone")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    const total = await Car.countDocuments({ status: "pending", isDeleted: false });

    res.status(200).json({
        success: true,
        listings,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

export const getFlaggedListings = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "reportCount", order = "desc" } = req.query;

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    const listings = await Car.find({ reportCount: { $gt: 0 }, isDeleted: false })
        .populate("createdBy", "name email phone")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

    const total = await Car.countDocuments({ reportCount: { $gt: 0 }, isDeleted: false });

    res.status(200).json({
        success: true,
        listings,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

export const approveListing = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;

    const listing = await Car.findByIdAndUpdate(
        listingId,
        {
            status: "approved",
            approvedBy: req.user._id,
            approvedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Listing approved successfully",
        listing
    });
});

export const rejectListing = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
        return next(new ErrorHandler("Rejection reason is required", 400));
    }

    const listing = await Car.findByIdAndUpdate(
        listingId,
        {
            status: "rejected",
            rejectionReason,
            rejectedBy: req.user._id,
            rejectedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Listing rejected",
        listing
    });
});

export const removeFlaggedListing = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;

    const listing = await Car.findByIdAndUpdate(
        listingId,
        {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: req.user._id
        },
        { new: true }
    ).populate("createdBy", "name email");

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Listing removed from platform",
        listing
    });
});
