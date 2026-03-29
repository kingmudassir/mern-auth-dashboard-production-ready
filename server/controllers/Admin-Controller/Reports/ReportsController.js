import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Report } from "../../../models/reportSchema.js";
import { Car } from "../../../models/carSchema.js";
import { User } from "../../../models/userSchema.js";

export const getReports = catchAsyncError(async (req, res, next) => {
    const { status = "open", priority, category, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const reports = await Report.find(filter)
        .populate("reportedBy", "name email")
        .populate("resolvedBy", "name email")
        .sort({ createdAt: -1, priority: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Report.countDocuments(filter);

    res.status(200).json({
        success: true,
        reports,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

export const getReportById = catchAsyncError(async (req, res, next) => {
    const report = await Report.findById(req.params.reportId)
        .populate("reportedBy", "name email phone")
        .populate("resolvedBy", "name email");

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    // Populate target info based on targetModel
    if (report.targetModel === "Car") {
        await report.populate("targetId", "title price city make model year");
    } else if (report.targetModel === "User") {
        await report.populate("targetId", "name email phone");
    }

    res.status(200).json({
        success: true,
        report
    });
});

export const resolveReport = catchAsyncError(async (req, res, next) => {
    const { resolution, resolutionNotes } = req.body;

    if (!resolution || !["content_removed", "user_warned", "user_banned", "no_action", "verified_false"].includes(resolution)) {
        return next(new ErrorHandler("Invalid resolution type", 400));
    }

    const report = await Report.findByIdAndUpdate(
        req.params.reportId,
        {
            status: "resolved",
            resolution,
            resolutionNotes,
            resolvedBy: req.user._id,
            resolvedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate("reportedBy", "name email")
     .populate("resolvedBy", "name email");

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    // If user_banned, also ban the user who created the report target
    if (resolution === "user_banned" && report.category === "listing") {
        const listing = await Car.findById(report.targetId);
        if (listing) {
            await User.findByIdAndUpdate(listing.createdBy, { isBanned: true });
        }
    }

    res.status(200).json({
        success: true,
        message: "Report resolved successfully",
        report
    });
});

export const dismissReport = catchAsyncError(async (req, res, next) => {
    const report = await Report.findByIdAndUpdate(
        req.params.reportId,
        {
            status: "dismissed",
            resolvedBy: req.user._id,
            resolvedAt: new Date()
        },
        { new: true }
    );

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Report dismissed",
        report
    });
});

export const updateReportPriority = catchAsyncError(async (req, res, next) => {
    const { priority } = req.body;

    if (!priority || !["low", "medium", "high"].includes(priority)) {
        return next(new ErrorHandler("Invalid priority level", 400));
    }

    const report = await Report.findByIdAndUpdate(
        req.params.reportId,
        { priority },
        { new: true, runValidators: true }
    );

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Priority updated",
        report
    });
});
