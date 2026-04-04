import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Car } from "../../../models/carSchema.js";

export const getPendingListings = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    const [listings, total] = await Promise.all([
        Car.find({ status: "pending", isDeleted: false })
            .populate("postedBy", "name email phone")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Car.countDocuments({ status: "pending", isDeleted: false }),
    ]);

    res.status(200).json({
        success: true,
        listings,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
    });
});

export const getFlaggedListings = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "reportCount", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    const [listings, total] = await Promise.all([
        Car.find({ reportCount: { $gt: 0 }, isDeleted: false })
            .populate("postedBy", "name email phone")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Car.countDocuments({ reportCount: { $gt: 0 }, isDeleted: false }),
    ]);

    res.status(200).json({
        success: true,
        listings,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
    });
});

export const approveListing = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;

    const listing = await Car.findByIdAndUpdate(
        listingId,
        {
            status: "active",
            isActive: true,
            approvedBy: req.user._id,
            approvedAt: new Date(),
            // Clear any previous rejection data
            rejectionReason: undefined,
            rejectedBy: undefined,
            rejectedAt: undefined,
        },
        { new: true, runValidators: true }
    )
        .populate("postedBy", "name email")
        .lean();

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Listing approved and is now live on the marketplace",
        listing,
    });
});

export const rejectListing = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;
    const { rejectionReason } = req.body;

    // Rejection reason is optional — admin may reject without explanation,
    // but it's strongly encouraged. Remove the guard if you want to enforce it.
    const listing = await Car.findByIdAndUpdate(
        listingId,
        {
            status: "rejected",
            isActive: false,
            rejectionReason: rejectionReason?.trim() || undefined,
            rejectedBy: req.user._id,
            rejectedAt: new Date(),
        },
        { new: true, runValidators: true }
    )
        .populate("postedBy", "name email")
        .lean();

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Listing rejected",
        listing,
    });
});

export const removeFlaggedListing = catchAsyncError(async (req, res, next) => {
    const { listingId } = req.params;

    const listing = await Car.findByIdAndUpdate(
        listingId,
        {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false,
            status: "rejected", // treat hard removals as rejected in history
        },
        { new: true }
    )
        .populate("postedBy", "name email")
        .lean();

    if (!listing) {
        return next(new ErrorHandler("Listing not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Listing removed from platform",
        listing,
    });
});