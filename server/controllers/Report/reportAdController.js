// ─────────────────────────────────────────────────────────────────
// FILE: controllers/Report/reportAdController.js
// ─────────────────────────────────────────────────────────────────
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/errors.js";
import { Report } from "../../models/reportSchema.js";
import { Car } from "../../models/carSchema.js";

// ── Config ────────────────────────────────────────────────────────
// When a car accumulates this many pending reports it is automatically
// pulled from the public marketplace and queued for admin review.
const REPORT_THRESHOLD = 5;

// ── POST /api/v2/cars/:carId/report ──────────────────────────────
export const reportAd = catchAsyncError(async (req, res, next) => {
    const { carId } = req.params;
    const { reason, description } = req.body;
    const reporterId = req.user._id;

    // 1. Validate reason
    if (!reason) {
        return next(new ErrorHandler("Please select a reason for your report.", 400));
    }

    // 2. Verify the listing exists and is visible
    const car = await Car.findOne({ _id: carId, isDeleted: false }).select(
        "_id status postedBy reportCount"
    );
    if (!car) {
        return next(new ErrorHandler("Listing not found.", 404));
    }

    // 3. Prevent self-reporting
    if (car.postedBy.toString() === reporterId.toString()) {
        return next(new ErrorHandler("You cannot report your own listing.", 403));
    }

    // 4. Duplicate check — one report per user per car
    // The unique compound index on the schema is the hard safety net;
    // this check gives a clean error message before hitting that constraint.
    const existingReport = await Report.exists({ car: carId, reportedBy: reporterId });
    if (existingReport) {
        return next(
            new ErrorHandler("You have already reported this listing.", 409)
        );
    }

    // 5. Create the report
    const report = await Report.create({
        car: carId,
        reportedBy: reporterId,
        reason,
        description: description?.trim() || undefined,
    });

    // 6. Atomically increment reportCount on the Car and fetch the new value.
    //    Using findByIdAndUpdate with { new: true } means we do this in a
    //    single round-trip and avoid a separate .save() call.
    const updatedCar = await Car.findByIdAndUpdate(
        carId,
        { $inc: { reportCount: 1 } },
        { new: true, select: "reportCount status" }
    );

    // 7. Auto-flag: if the car was active and has crossed the threshold,
    //    set it back to "pending" for admin review without hard-removing it.
    //    We only do this once (when it crosses the threshold, not on every
    //    subsequent report) to avoid redundant writes.
    if (
        updatedCar.status === "active" &&
        updatedCar.reportCount >= REPORT_THRESHOLD
    ) {
        await Car.findByIdAndUpdate(carId, {
            status: "pending",
            isActive: false,
        });
    }

    res.status(201).json({
        success: true,
        message:
            "Your report has been submitted. Our moderation team will review this listing.",
        reportId: report._id,
    });
});