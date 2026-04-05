import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Report } from "../../../models/reportSchema.js";
import { Car } from "../../../models/carSchema.js";
import { User } from "../../../models/userSchema.js";

export const getReports = catchAsyncError(async (req, res, next) => {
    const { status = "open", priority, category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [reports, total] = await Promise.all([
        Report.find(filter)
            .populate("reportedBy", "name email")
            .populate("resolvedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Report.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        reports,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
    });
});

export const getReportById = catchAsyncError(async (req, res, next) => {
    const report = await Report.findById(req.params.reportId)
        .populate("reportedBy", "name email phone")
        .populate("resolvedBy", "name email")
        .populate("car", "make model year price city status")
        .lean();

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    res.status(200).json({ success: true, report });
});

export const resolveReport = catchAsyncError(async (req, res, next) => {
    const { resolution, resolutionNotes } = req.body;

    const validResolutions = [
        "content_removed",
        "user_warned",
        "user_banned",
        "no_action",
        "verified_false",
    ];

    if (!resolution || !validResolutions.includes(resolution)) {
        return next(new ErrorHandler("Invalid resolution type", 400));
    }

    const report = await Report.findByIdAndUpdate(
        req.params.reportId,
        {
            status: "resolved",
            resolution,
            resolutionNotes: resolutionNotes?.trim() || undefined,
            resolvedBy: req.user._id,
            resolvedAt: new Date(),
        },
        { new: true, runValidators: true }
    )
        .populate("reportedBy", "name email")
        .populate("resolvedBy", "name email");

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    // If resolution is to ban the user, find the listing's owner via postedBy.
    // BUG FIX: original code referenced listing.createdBy which does not exist
    // in the Car schema — the correct field is postedBy.
    if (resolution === "user_banned") {
        const listing = await Car.findById(report.car).select("postedBy").lean();
        if (listing?.postedBy) {
            await User.findByIdAndUpdate(listing.postedBy, {
                isBanned: true,
                banReason: `Banned via report resolution (report #${report._id})`,
                bannedAt: new Date(),
                bannedBy: req.user._id,
            });
        }
    }

    res.status(200).json({
        success: true,
        message: "Report resolved successfully",
        report,
    });
});

export const dismissReport = catchAsyncError(async (req, res, next) => {
    const report = await Report.findByIdAndUpdate(
        req.params.reportId,
        {
            status: "dismissed",
            resolvedBy: req.user._id,
            resolvedAt: new Date(),
        },
        { new: true }
    );

    if (!report) {
        return next(new ErrorHandler("Report not found", 404));
    }

    res.status(200).json({ success: true, message: "Report dismissed", report });
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

    res.status(200).json({ success: true, message: "Priority updated", report });
});