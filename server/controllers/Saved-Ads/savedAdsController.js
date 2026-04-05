import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/errors.js";
import { Car } from "../../models/carSchema.js";
import { User } from "../../models/userSchema.js";

export const toggleSaveAd = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    // 1. Verify car exists
    const car = await Car.findById(id);
    if (!car) return next(new ErrorHandler("Listing not found", 404));

    // 2. Fetch the user's savedAds specifically
    const user = await User.findById(userId).select("savedAds");

    // 3. Robust Array Check: Convert single values to array or default to []
    let currentSaves = [];
    if (Array.isArray(user.savedAds)) {
        currentSaves = user.savedAds;
    } else if (user.savedAds) {
        // This handles your current DB error where it's a single ID
        currentSaves = [user.savedAds];
    }

    const alreadySaved = currentSaves.some((cid) => cid.toString() === id);

    // 4. Use Atomic Operations (Cleanest & Safest)
    const update = alreadySaved 
        ? { $pull: { savedAds: id } } 
        : { $addToSet: { savedAds: id } };

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        update,
        { new: true, validateBeforeSave: false }
    ).select("savedAds");

    res.status(200).json({
        success: true,
        saved: !alreadySaved,
        savedCount: updatedUser.savedAds?.length || 0,
    });
});

/**
 * GET /api/v2/cars/saved
 * Returns full car docs for the current user's saved ads.
 * Only returns approved + active cars (unsaved cars that were deleted/rejected are silently skipped).
 */
export const getSavedAds = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("savedAds");
    if (!user?.savedAds?.length) {
        return res.status(200).json({ success: true, ads: [] });
    }

    const cars = await Car.find({
        _id: { $in: user.savedAds },
        status: "active",
    })
        .populate("postedBy", "name createdAt")
        .select("make model variant year price city fuel transmission mileage condition color images createdAt postedBy")
        .lean();

    // Preserve the user's save order (most-recently-saved first)
    const idOrder = user.savedAds.map((id) => id.toString()).reverse();
    cars.sort((a, b) => idOrder.indexOf(a._id.toString()) - idOrder.indexOf(b._id.toString()));

    res.status(200).json({ success: true, ads: cars });
});